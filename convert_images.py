import os
from PIL import Image

def convert_to_webp(folder):
    for root, dirs, files in os.walk(folder):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                filepath = os.path.join(root, file)
                webp_path = os.path.splitext(filepath)[0] + '.webp'
                if not os.path.exists(webp_path):
                    try:
                        img = Image.open(filepath)
                        # Remove alpha channel for JPEGs if needed, but for WebP it handles RGBA fine
                        img.save(webp_path, 'WEBP', quality=80, method=6)
                        
                        # Print size difference
                        orig_size = os.path.getsize(filepath)
                        new_size = os.path.getsize(webp_path)
                        savings = (orig_size - new_size) / orig_size * 100
                        print(f"Converted {file}: {orig_size/1024:.1f}KB -> {new_size/1024:.1f}KB (Saved {savings:.1f}%)")
                    except Exception as e:
                        print(f"Failed to convert {file}: {e}")

if __name__ == "__main__":
    print("Starting conversion...")
    convert_to_webp("public")
    print("Done!")
