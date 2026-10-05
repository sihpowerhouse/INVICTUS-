import os
import json
import urllib.request
import urllib.error
from dotenv import load_dotenv

load_dotenv(override=False)

def check_ollama():
    key = os.getenv("OLLAMA_API_KEY", "").strip()
    model = os.getenv("OLLAMA_MODEL", "gemma4:31b").strip()
    url = os.getenv("OLLAMA_URL", "https://ollama.com").rstrip("/")
    
    print(f"Ollama key configured: {'YES' if key else 'NO'}")
    print(f"Ollama model configured: {'YES' if model else 'NO'} ({model})")
    
    if not key:
        print("Ollama model available: NO (No API Key)")
        print("Ollama chat test: FAIL")
        return
        
    req = urllib.request.Request(f"{url}/api/tags", headers={"Authorization": f"Bearer {key}"})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read().decode())
            models = [m.get("name") for m in data.get("models", [])]
            if model in models or f"{model}:latest" in models or any(m.startswith(model) for m in models):
                print("Ollama model available: YES")
            else:
                print(f"Ollama model available: NO (Available models: {', '.join(models)})")
    except urllib.error.HTTPError as e:
        print(f"Ollama model available: NO (HTTP {e.code}: {e.read().decode(errors='replace')[:100]})")
    except Exception as e:
        print(f"Ollama model available: NO (Error checking tags: {type(e).__name__} - {e})")
        
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": "Say 'hello' and nothing else."}],
        "stream": False,
        "options": {"temperature": 0},
    }
    req2 = urllib.request.Request(
        f"{url}/api/chat", 
        data=json.dumps(payload).encode(), 
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"}, 
        method="POST"
    )
    try:
        with urllib.request.urlopen(req2, timeout=15) as r:
            res = json.loads(r.read().decode())
            ans = res.get("message", {}).get("content", "")
            if ans:
                print("Ollama chat test: PASS")
            else:
                print("Ollama chat test: FAIL (Empty response)")
    except urllib.error.HTTPError as e:
        print(f"Ollama chat test: FAIL (HTTP {e.code}: {e.read().decode(errors='replace')[:100]})")
    except Exception as e:
        print(f"Ollama chat test: FAIL ({type(e).__name__} - {e})")

def check_gemini():
    key = os.getenv("GEMINI_API_KEY", "").strip()
    model = os.getenv("GEMINI_MODEL", "gemini-3.8-flash").strip()
    
    print(f"Gemini key configured: {'YES' if key else 'NO'}")
    print(f"Gemini model configured: {'YES' if model else 'NO'} ({model})")
    
    if not key:
        print("Gemini generateContent test: FAIL")
        return
        
    payload = {"contents": [{"parts": [{"text": "Say 'hello' and nothing else."}]}]}
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    req = urllib.request.Request(url, data=json.dumps(payload).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": key}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            res = json.loads(r.read().decode())
            cands = res.get("candidates", [])
            if cands and cands[0].get("content", {}).get("parts"):
                print("Gemini generateContent test: PASS")
            else:
                print("Gemini generateContent test: FAIL (Empty response)")
    except urllib.error.HTTPError as e:
        print(f"Gemini generateContent test: FAIL (HTTP {e.code}: {e.read().decode(errors='replace')[:100]})")
    except Exception as e:
        print(f"Gemini generateContent test: FAIL ({type(e).__name__} - {e})")

if __name__ == "__main__":
    check_ollama()
    print("-" * 30)
    check_gemini()
