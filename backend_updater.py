import sys
import re

with open("invite_backend.py", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update upload_document signature
sig_old = """async def upload_document(
    background_tasks: BackgroundTasks,
    case_id: str = Form(...),
    document_type: str = Form(...),
    file: UploadFile = File(...),
    authorization: str | None = Header(default=None),
):"""
sig_new = """async def upload_document(
    background_tasks: BackgroundTasks,
    case_id: str = Form(...),
    document_type: str = Form(...),
    file: UploadFile = File(...),
    document_id: str | None = Form(default=None),
    authorization: str | None = Header(default=None),
):"""
content = content.replace(sig_old, sig_new)

# 2. Update upload logic:
upload_logic_old = """        # One logical document per CASE + DOCUMENT TYPE.
        existing = supabase.table("documents").select("document_id,current_version_id,file_type,uploader_id").eq("case_id", case_id).eq("document_type", document_type).limit(1).execute()
        if existing.data:
            did = existing.data[0]["document_id"]
            versions = supabase.table("document_versions").select("version_id,version_number,file_hash").eq("document_id", did).order("version_number", desc=True).limit(1).execute()
            latest = versions.data[0] if versions.data else None
            version_number = int(latest.get("version_number") or 1) + 1 if latest else 1
            previous_hash = latest.get("file_hash") if latest else None
        else:
            dr = supabase.table("documents").insert({"case_id": case_id, "document_type": document_type, "file_type": ft, "uploader_id": u["user_id"]}).execute()
            if not dr.data:
                raise RuntimeError("Document insert returned no row.")
            did = dr.data[0]["document_id"]
            version_number = 1
            previous_hash = None"""

upload_logic_new = """        # Version by explicit document_id if provided, else one logical document per CASE + DOCUMENT TYPE.
        existing = None
        if document_id:
            existing = supabase.table("documents").select("document_id,current_version_id,file_type,uploader_id").eq("document_id", document_id).limit(1).execute()
        else:
            existing = supabase.table("documents").select("document_id,current_version_id,file_type,uploader_id").eq("case_id", case_id).eq("document_type", document_type).limit(1).execute()
            
        if existing and existing.data:
            did = existing.data[0]["document_id"]
            versions = supabase.table("document_versions").select("version_id,version_number,file_hash").eq("document_id", did).order("version_number", desc=True).limit(1).execute()
            latest = versions.data[0] if versions.data else None
            version_number = int(latest.get("version_number") or 1) + 1 if latest else 1
            previous_hash = latest.get("file_hash") if latest else None
        else:
            dr = supabase.table("documents").insert({"case_id": case_id, "document_type": document_type, "file_type": ft, "uploader_id": u["user_id"]}).execute()
            if not dr.data:
                raise RuntimeError("Document insert returned no row.")
            did = dr.data[0]["document_id"]
            version_number = 1
            previous_hash = None"""
            
content = content.replace(upload_logic_old, upload_logic_new)

# Add new endpoints at the end before if __name__ == "__main__":
new_endpoints = """
@app.get("/analytics/summary")
def get_analytics_summary(authorization: str | None = Header(default=None)):
    u = get_current_user(authorization)
    # Get total cases
    cases_count = supabase.table("cases").select("case_id", count="exact").execute().count or 0
    active_cases = supabase.table("cases").select("case_id", count="exact").eq("status", "ACTIVE").execute().count or 0
    docs_count = supabase.table("documents").select("document_id", count="exact").execute().count or 0
    
    # Processed AI
    ai_processed = supabase.table("ai_documents").select("version_id", count="exact").eq("status", "completed").execute().count or 0
    
    return {
        "success": True,
        "metrics": {
            "totalCases": cases_count,
            "activeCases": active_cases,
            "closedCases": cases_count - active_cases,
            "totalDocuments": docs_count,
            "totalVersions": docs_count,
            "processing": 0,
            "completed": ai_processed,
            "extractionPending": 0,
            "extractionAccepted": 0
        }
    }

@app.get("/audit/logs")
def get_audit_logs(authorization: str | None = Header(default=None)):
    u = get_current_user(authorization)
    logs = supabase.table("audit_events").select("*").order("created_at", desc=True).limit(50).execute()
    # Format events
    results = []
    for log in (logs.data or []):
        results.append({
            "id": log.get("event_id"),
            "timestamp": log.get("created_at"),
            "actor": log.get("user_id"),
            "action": log.get("action"),
            "target": log.get("target_id") or "SYSTEM",
            "details": log.get("details", {})
        })
    return {"success": True, "logs": results}

@app.get("/documents/{document_id}/activity")
def get_document_activity(document_id: str, authorization: str | None = Header(default=None)):
    u = get_current_user(authorization)
    # Fetch upload events and AI events
    versions = supabase.table("document_versions").select("version_id,version_number,timestamp,uploader_id").eq("document_id", document_id).order("timestamp", desc=True).execute()
    activities = []
    for v in (versions.data or []):
        vid = v["version_id"]
        vnum = v.get("version_number")
        ts = v.get("timestamp")
        activities.append({
            "id": f"upload-{vid}",
            "type": "DOCUMENT_UPLOADED" if vnum == 1 else "VERSION_CREATED",
            "timestamp": ts,
            "versionId": vid,
            "actor": v.get("uploader_id"),
            "details": f"Version {vnum} uploaded."
        })
        ai = supabase.table("ai_documents").select("status,created_at,completed_at").eq("version_id", vid).limit(1).execute()
        if ai.data:
            a = ai.data[0]
            activities.append({
                "id": f"ai-start-{vid}",
                "type": "OCR_PROCESSING_STARTED",
                "timestamp": a.get("created_at"),
                "versionId": vid,
                "actor": "SYSTEM",
                "details": "AI extraction started."
            })
            if a.get("status") == "completed":
                activities.append({
                    "id": f"ai-end-{vid}",
                    "type": "OCR_PROCESSING_COMPLETED",
                    "timestamp": a.get("completed_at") or a.get("created_at"),
                    "versionId": vid,
                    "actor": "SYSTEM",
                    "details": "AI extraction completed."
                })
    
    # Also fetch audit events
    audits = supabase.table("audit_events").select("*").eq("target_id", document_id).order("created_at", desc=True).execute()
    for aud in (audits.data or []):
        activities.append({
            "id": aud.get("event_id"),
            "type": aud.get("action"),
            "timestamp": aud.get("created_at"),
            "versionId": aud.get("details", {}).get("version_id"),
            "actor": aud.get("user_id"),
            "details": aud.get("details", {}).get("message", "Activity logged.")
        })
    
    activities.sort(key=lambda x: x["timestamp"], reverse=True)
    return {"success": True, "activities": activities}

@app.post("/documents/versions/{version_id}/extraction/accept")
def accept_extraction(version_id: str, authorization: str | None = Header(default=None)):
    u = get_current_user(authorization)
    # Verify version exists
    v = supabase.table("document_versions").select("document_id").eq("version_id", version_id).limit(1).execute()
    if not v.data: raise HTTPException(404, "Version not found")
    did = v.data[0]["document_id"]
    
    log_audit(u["user_id"], "EXTRACTION_ACCEPTED", did, {"version_id": version_id, "message": "Extraction accepted."})
    return {"success": True, "message": "Extraction accepted."}

class EditExtractionRequest(BaseModel):
    text: str

@app.post("/documents/versions/{version_id}/extraction/edit")
def edit_extraction(version_id: str, req: EditExtractionRequest, authorization: str | None = Header(default=None)):
    u = get_current_user(authorization)
    v = supabase.table("document_versions").select("document_id").eq("version_id", version_id).limit(1).execute()
    if not v.data: raise HTTPException(404, "Version not found")
    did = v.data[0]["document_id"]
    
    # Update extracted_text in ai_documents
    supabase.table("ai_documents").update({"extracted_text": req.text}).eq("version_id", version_id).execute()
    log_audit(u["user_id"], "EXTRACTION_EDITED", did, {"version_id": version_id, "message": "Extraction text edited."})
    return {"success": True, "message": "Extraction updated."}

@app.post("/documents/versions/{version_id}/reprocess")
def reprocess_document(version_id: str, background_tasks: BackgroundTasks, authorization: str | None = Header(default=None)):
    u = get_current_user(authorization)
    v = supabase.table("document_versions").select("document_id").eq("version_id", version_id).limit(1).execute()
    if not v.data: raise HTTPException(404, "Version not found")
    did = v.data[0]["document_id"]
    
    supabase.table("ai_documents").update({
        "status": "queued", "progress_percent": 0, "stage": "Initializing...", 
        "queued_at": iso(now())
    }).eq("version_id", version_id).execute()
    background_tasks.add_task(_process_ai_job, version_id)
    log_audit(u["user_id"], "DOCUMENT_REPROCESSED", did, {"version_id": version_id, "message": "Document reprocessed manually."})
    
    return {"success": True, "message": "Reprocessing started."}

"""

if new_endpoints not in content:
    content = content.replace('if __name__ == "__main__":', new_endpoints + '\nif __name__ == "__main__":')

with open("invite_backend.py", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated invite_backend.py")
