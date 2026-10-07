from playwright.sync_api import sync_playwright
import time
import os

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:5173/login")
    
    page.fill("input[type='text'], input[name='employeeId'], input[placeholder*='ID']", "TSFSL-0001")
    page.fill("input[type='password']", "password")
    page.click("button:has-text('Login'), button[type='submit']")
    
    page.wait_for_url("**/cases*", timeout=10000)
    print("Logged in successfully.")
    
    # Click the first case
    page.click("table tbody tr:first-child, .case-card:first-child, [data-case-id]:first-child")
    
    page.wait_for_selector("text=DOCUMENT REGISTRY", timeout=10000)
    
    # Click Secure Document Ingestion
    page.click("button:has-text('SECURE INGESTION'), button:has-text('UPLOAD'), .upload-button")
    
    # Wait for file input
    file_input = page.wait_for_selector("input[type='file']", state="attached")
    file_input.set_input_files("test_upload.pdf")
    
    # Submit
    page.click("button:has-text('UPLOAD'), button:has-text('SUBMIT'), button:has-text('CONFIRM')")
    
    # Wait for OTP prompt
    page.wait_for_selector("text=Enter verification code", timeout=5000)
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
    
    page.wait_for_selector("text=success", timeout=10000)
    print("Upload completed successfully.")
    
    browser.close()

