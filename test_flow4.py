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
    
    page.goto("http://localhost:5173/cases")
    page.wait_for_load_state("networkidle")
    
    # Save the HTML to a file
    with open("cases_html.txt", "w", encoding="utf-8") as f:
        f.write(page.content())
    browser.close()

