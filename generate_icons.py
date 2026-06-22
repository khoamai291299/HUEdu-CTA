import os
import sys
from PIL import Image, ImageOps

source_image_path = r"C:\Users\khoam\.gemini\antigravity-ide\brain\071d08b5-f9ac-4b9e-9f9f-b2661f2928dd\media__1782052701055.png"
base_res_dir = r"C:\Users\khoam\Downloads\HUEdu-CTA_complete_source\HUEdu-CTA\android\app\src\main\res"

sizes = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192
}

def make_square(img):
    # Padding the image to a square
    width, height = img.size
    max_dim = max(width, height)
    
    # Let's add some padding so the logo doesn't touch the edges
    padded_dim = int(max_dim * 1.2)
    
    # Create a new white background image
    new_img = Image.new("RGBA", (padded_dim, padded_dim), (255, 255, 255, 255))
    
    # Paste the original image in the center
    offset = ((padded_dim - width) // 2, (padded_dim - height) // 2)
    # If the original image has an alpha channel, we use it as a mask
    if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
        new_img.paste(img, offset, img.convert('RGBA'))
    else:
        new_img.paste(img, offset)
        
    return new_img

def main():
    if not os.path.exists(source_image_path):
        print(f"Error: Source image not found at {source_image_path}")
        sys.exit(1)
        
    print(f"Opening {source_image_path}...")
    img = Image.open(source_image_path)
    
    # Convert to square
    sq_img = make_square(img)
    
    # Generate for each size
    for folder, size in sizes.items():
        out_dir = os.path.join(base_res_dir, folder)
        if not os.path.exists(out_dir):
            os.makedirs(out_dir)
            
        resized = sq_img.resize((size, size), Image.Resampling.LANCZOS)
        
        # Save as both ic_launcher and ic_launcher_round
        out_path1 = os.path.join(out_dir, "ic_launcher.png")
        out_path2 = os.path.join(out_dir, "ic_launcher_round.png")
        
        resized.save(out_path1, "PNG")
        resized.save(out_path2, "PNG")
        print(f"Saved {size}x{size} to {folder}")
        
    print("Icons generated successfully!")

if __name__ == '__main__':
    main()
