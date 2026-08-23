import shutil
from PIL import Image
import colorsys

# Backup
shutil.copyfile('public/logo-main.png', 'public/logo-main-backup.png')

img = Image.open('public/logo-main.png').convert('RGBA')
width, height = img.size
pixels = img.load()

target_r, target_g, target_b = 255, 107, 26 # #FF6B1A
target_h, target_s, target_v = colorsys.rgb_to_hsv(target_r/255.0, target_g/255.0, target_b/255.0)

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        if a > 0:
            h, s, v = colorsys.rgb_to_hsv(r/255.0, g/255.0, b/255.0)
            # Logo's original orange is around #FF3C00 (h ~ 0.04)
            if (h < 0.1 or h > 0.9) and s > 0.3:
                new_r, new_g, new_b = colorsys.hsv_to_rgb(target_h, target_s, v)
                pixels[x, y] = (int(new_r*255), int(new_g*255), int(new_b*255), a)

img.save('public/logo-main.png')
print("Logo updated successfully.")
