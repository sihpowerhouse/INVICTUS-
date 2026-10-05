import os

files_to_update = [
    r"c:\Users\Yash\OneDrive\Desktop\SIHHHH\invictus-frontend\src\pages\AuditPage.tsx",
    r"c:\Users\Yash\OneDrive\Desktop\SIHHHH\invictus-frontend\src\components\media\MediaCommandBar.tsx",
    r"c:\Users\Yash\OneDrive\Desktop\SIHHHH\invictus-frontend\src\components\media\MediaViewer.tsx",
    r"c:\Users\Yash\OneDrive\Desktop\SIHHHH\invictus-frontend\src\components\intelligence\SearchFilters.tsx",
    r"c:\Users\Yash\OneDrive\Desktop\SIHHHH\invictus-frontend\src\components\evidence\EvidenceCommandBar.tsx",
    r"c:\Users\Yash\OneDrive\Desktop\SIHHHH\invictus-frontend\src\components\documents\DocumentCommandBar.tsx",
    r"c:\Users\Yash\OneDrive\Desktop\SIHHHH\invictus-frontend\src\components\cases\CaseFilters.tsx",
    r"c:\Users\Yash\OneDrive\Desktop\SIHHHH\invictus-frontend\src\components\cases\CaseCommandBar.tsx",
]

for file_path in files_to_update:
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace imports
        content = content.replace("import Dropdown from '../common/Dropdown';", "import InvictusSelect from '../ui/InvictusSelect';")
        content = content.replace("import Dropdown from '../components/common/Dropdown';", "import InvictusSelect from '../components/ui/InvictusSelect';")
        
        # Replace components
        content = content.replace("<Dropdown", "<InvictusSelect")
        content = content.replace("</Dropdown>", "</InvictusSelect>")
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file_path}")

# Now remove the old Dropdown component to ensure it's not used
old_dropdown = r"c:\Users\Yash\OneDrive\Desktop\SIHHHH\invictus-frontend\src\components\common\Dropdown.tsx"
old_css = r"c:\Users\Yash\OneDrive\Desktop\SIHHHH\invictus-frontend\src\components\common\Dropdown.css"

if os.path.exists(old_dropdown):
    os.remove(old_dropdown)
if os.path.exists(old_css):
    os.remove(old_css)

print("Done")
