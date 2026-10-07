from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:5173/login")
    
    page.fill("input[type='text']", "TSFSL-0001")
    page.fill("input[type='password']", "password")
    page.click("button[type='submit']")
    page.wait_for_load_state("networkidle")
    
    page.goto("http://localhost:5173/dashboard")
    page.wait_for_load_state("networkidle")
    print(page.content())
    browser.close()

