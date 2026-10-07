import os
import sys
from dotenv import load_dotenv

load_dotenv(override=False)

import ai_engine

def test_pipeline():
    print("Testing native extraction...")
    try:
        with open("ai_test_case.txt", "rb") as f:
            data = f.read()
    except FileNotFoundError:
        print("DOCUMENT EXTRACTION = FAIL (File ai_test_case.txt not found)")
        return
        
    try:
        res = ai_engine.extract_document(data, "ai_test_case.txt")
        print(f"Extraction provider: {res.get('provider', 'unknown')}")
        text = res["text"]
        if "John Example" in text:
            print("DOCUMENT EXTRACTION = PASS")
        else:
            print("DOCUMENT EXTRACTION = FAIL")
            
        print("Testing chunking...")
        chunks = ai_engine.chunk_pages(res.get("pages", []), 100)
        if chunks:
            print("CHUNKING = PASS")
        else:
            print("CHUNKING = FAIL")
            
        print("Testing Q&A (Case AI / Document AI)...")
        prompt = f"Answer from this text:\n{text}\n\nWhat is the status of TEST-001?"
        ans = ai_engine.answer_question(prompt)
        
        lower_ans = ans.get("text", "").lower()
        if "investigation open" in lower_ans or "open" in lower_ans:
            print("CASE AI = PASS")
            print("DOCUMENT AI = PASS")
            print(f"Used provider: {ans.get('provider')}")
        else:
            print("CASE AI = FAIL")
            print(f"Output: {ans.get('text')}")
    except Exception as e:
        print(f"PIPELINE FAIL: {type(e).__name__} - {e}")

if __name__ == "__main__":
    test_pipeline()
