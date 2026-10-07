from playwright.sync_api import sync_playwright
import time
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:5173/login")
    
    page.fill("input[type='text']", "TSFSL-0001")
    page.fill("input[type='password']", "password")
    page.click("button[type='submit']")
    page.wait_for_load_state("networkidle")
    
    # Check if we are on dashboard or cases
    print("URL after login:", page.url)
    
    if "dashboard" in page.url:
        # Click view all cases
        page.goto("http://localhost:5173/cases")
        page.wait_for_load_state("networkidle")
        
    print("At cases URL:", page.url)
    # Click the first case card
    page.click(".case-card:first-child, .my-cases-item:first-child")
    page.wait_for_load_state("networkidle")
    print("Entered case. URL:", page.url)
    
    # Click Document Registry
    page.click("text=DOCUMENT REGISTRY, text=DOCUMENTS")
    page.wait_for_load_state("networkidle")
    print("In document registry. URL:", page.url)
    
    # Click Secure Document Ingestion
    page.click("button:has-text('SECURE'), button:has-text('UPLOAD'), .upload-button, button:has-text('INGESTION')")
    print("Clicked secure ingestion")
    
    # Wait for file input
    file_input = page.wait_for_selector("input[type='file']", state="attached", timeout=5000)
    file_input.set_input_files("test_upload.pdf")
    print("Set file")
    
    page.wait_for_timeout(500)
    
    # Submit
    page.click("button:has-text('UPLOAD'), button:has-text('SUBMIT'), button:has-text('CONFIRM')")
    print("Clicked submit")
    
    # Wait for OTP prompt
    page.wait_for_selector("text=Enter verification code, text=AUTHORIZATION", timeout=5000)
    print("OTP Prompt reached.")
    
    time.sleep(2)
    # Read OTP
    with open("latest_otp.txt", "r") as f:
        otp = f.read().strip()
    
    print("Found OTP:", otp)
    
    # Fill OTP
    inputs = page.query_selector_all("input[type='text']")
    if len(inputs) == 6:
        for i, char in enumerate(otp):
            inputs[i].fill(char)
    else:
        page.fill("input[placeholder*='OTP'], input[placeholder*='code']", otp)
        
    page.click("button:has-text('Verify'), button:has-text('Confirm'), button:has-text('Submit')")
    print("Clicked Verify OTP")
    
    page.wait_for_selector("text=PROCESSING, text=success, .document-row", timeout=15000)
    print("Upload completed successfully.")
    
    browser.close()

