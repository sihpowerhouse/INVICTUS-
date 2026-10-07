import os
try:
    from PIL import Image
except ImportError:
    print("Pillow missing")
    exit(1)

img_path = 'public/emblem.jpg'
out_path = 'public/emblem.png'

if not os.path.exists(img_path):
    print(f"File not found: {img_path}")
    exit(1)

print("Opening image...")
img = Image.open(img_path).convert('RGBA')
datas = img.getdata()

new_data = []
print("Processing pixels...")
for item in datas:
    # item is (R, G, B, A)
    r, g, b, _ = item
    # calculate luminance/alpha
    a = max(r, g, b)
    if a == 0:
        new_data.append((0, 0, 0, 0))
    else:
        # un-premultiply
        new_r = min(int((r / a) * 255), 255)
        new_g = min(int((g / a) * 255), 255)
        new_b = min(int((b / a) * 255), 255)
        new_data.append((new_r, new_g, new_b, a))

print("Saving PNG...")
img.putdata(new_data)
img.save(out_path, "PNG")
print("Successfully converted emblem.jpg to emblem.png with alpha transparency based on luminance.")
