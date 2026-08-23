from PIL import Image
import collections

img = Image.open('public/logo-main.png').convert('RGBA')
pixels = list(img.getdata())

# Find the most common colors
# Exclude transparent pixels and white-ish pixels and blue-ish pixels
colors = []
for r, g, b, a in pixels:
    if a > 50: # not transparent
        if r > 150 and g < 150 and b < 100: # rough filter for orange/red
            colors.append((r, g, b))

counter = collections.Counter(colors)
print("Most common orange-ish colors:")
for color, count in counter.most_common(5):
    print(f"#{color[0]:02x}{color[1]:02x}{color[2]:02x} : {count} pixels")
