import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        
        await page.goto('http://localhost:5174/login')
        await page.wait_for_selector('input[type="text"]')
        
        await page.fill('input[type="text"]', 'SEC-PS-HEAD-001')
        await page.fill('input[type="password"]', 'password')
        await page.click('button[type="submit"]')
        
        await page.wait_for_url('http://localhost:5174/dashboard', timeout=10000)
        
        # Click the sidebar link specifically using its href or just wait for the DOM
        html = await page.evaluate("document.body.innerHTML")
        with open('body.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Saved body.html")
        await browser.close()

asyncio.run(main())
