import zipfile
import os
import json
import random

def build_dataset_index():
    datasets_dir = r"C:\Users\samue\Desktop\Pixelin-sciences\datasets"
    
    plantvillage_zip = os.path.join(datasets_dir, "Plantvillagedataset.zip")
    rice_guard_zip = os.path.join(datasets_dir, "RiceGuard19K.zip")
    rice_disease_zip = os.path.join(datasets_dir, "RiceDisease30K.zip")
    
    print("Indexing datasets...")
    
    # We will build an index with the structure:
    # {
    #   "crops": {
    #      "paddy": {
    #         "healthy": [{"zip": "rice_guard", "path": "test/healthy/1.jpeg"}, ...],
    #         "blast": [...]
    #      },
    #      "tomato": { ... }
    #   }
    # }
    index = {
        "zips": {
            "plantvillage": plantvillage_zip,
            "rice_guard": rice_guard_zip,
            "rice_disease": rice_disease_zip
        },
        "crops": {
            "paddy": {},
            "tomato": {},
            "pepper": {},
            "potato": {},
            "cotton": {}  # Kept empty as no cotton zip is available
        }
    }
    
    image_exts = ('.jpg', '.jpeg', '.png', '.bmp')

    # Helper to check if file is an image
    def is_img(name):
        return name.lower().endswith(image_exts)

    # 1. Index Paddy - RiceGuard19K.zip
    print(f"Reading {rice_guard_zip}...")
    if os.path.exists(rice_guard_zip):
        with zipfile.ZipFile(rice_guard_zip, 'r') as z:
            # Structure: test/blast/Augmented_0_8656.jpeg
            for name in z.namelist():
                if not is_img(name):
                    continue
                parts = name.split('/')
                if len(parts) >= 3:
                    # split can be train/blast/..., val/..., test/...
                    split = parts[0] # train, val, test
                    disease = parts[1] # blast, healthy, insect, leaf_folder, scald, stripes, tungro
                    
                    # Map RiceGuard diseases to target Paddy classes
                    class_map = {
                        "healthy": "healthy",
                        "blast": "rice_blast",
                        "leaf_folder": "leaf_folder",
                        "insect": "stem_borer",  # map general insect to stem borer as stand-in
                        "scald": "sheath_blight",
                        "tungro": "gundhi_bug" # map tungro as stand-in or skip
                    }
                    
                    if disease in class_map:
                        target_class = class_map[disease]
                        if target_class not in index["crops"]["paddy"]:
                            index["crops"]["paddy"][target_class] = []
                        index["crops"]["paddy"][target_class].append({
                            "zip": "rice_guard",
                            "path": name,
                            "split": split
                        })
    else:
        print("Warning: RiceGuard19K.zip not found!")

    # 2. Index Paddy - RiceDisease30K.zip
    print(f"Reading {rice_disease_zip}...")
    if os.path.exists(rice_disease_zip):
        with zipfile.ZipFile(rice_disease_zip, 'r') as z:
            # Structure: Rice Disease/Bacterial Blight/1601885203_image2.jpg
            for name in z.namelist():
                if not is_img(name):
                    continue
                parts = name.split('/')
                if len(parts) >= 3:
                    disease_folder = parts[1]
                    
                    class_map = {
                        "Healthy": "healthy",
                        "Bacterial Blight": "bacterial_leaf_blight",
                        "Brown Spot": "brown_plant_hopper",
                        "False Smut": "false_smut",
                        "Hispa": "rice_hispa",
                        "Leaf Blast": "rice_blast",
                        "Neck Blast": "rice_blast",
                        "Sheath Blight": "sheath_blight",
                        "Stem Rot": "stem_borer"
                    }
                    
                    if disease_folder in class_map:
                        target_class = class_map[disease_folder]
                        if target_class not in index["crops"]["paddy"]:
                            index["crops"]["paddy"][target_class] = []
                        # Since RiceDisease doesn't have split folders, we assign a split randomly later
                        index["crops"]["paddy"][target_class].append({
                            "zip": "rice_disease",
                            "path": name,
                            "split": None
                        })
    else:
        print("Warning: RiceDisease30K.zip not found!")

    # 3. Index Vegetables - Plantvillagedataset.zip
    print(f"Reading {plantvillage_zip}...")
    if os.path.exists(plantvillage_zip):
        with zipfile.ZipFile(plantvillage_zip, 'r') as z:
            # Structure: plantvillage dataset/color/Tomato___Bacterial_spot/00075aa8-d81a-4184-8541-b692b78d398a___FREC_Scab 3335.JPG
            for name in z.namelist():
                if not is_img(name):
                    continue
                parts = name.split('/')
                if len(parts) >= 4 and parts[1] == 'color':
                    class_folder = parts[2]  # e.g., Tomato___Bacterial_spot
                    
                    # Split into crop and disease
                    if "___" in class_folder:
                        crop_part, disease_part = class_folder.split("___")
                        crop_part = crop_part.lower().replace(",_bell", "").strip()
                        
                        target_crop = None
                        if "tomato" in crop_part:
                            target_crop = "tomato"
                        elif "pepper" in crop_part:
                            target_crop = "pepper"
                        elif "potato" in crop_part:
                            target_crop = "potato"
                            
                        if target_crop:
                            disease_name = disease_part.lower().replace(" ", "_").replace("(", "").replace(")", "").strip()
                            if disease_name not in index["crops"][target_crop]:
                                index["crops"][target_crop][disease_name] = []
                            index["crops"][target_crop][disease_name].append({
                                "zip": "plantvillage",
                                "path": name,
                                "split": None
                            })
    else:
        print("Warning: Plantvillagedataset.zip not found!")

    # Perform splits for items with None split and shuffle/log counts
    random.seed(42)
    print("\nDataset Summary and Split Generation:")
    for crop, classes in index["crops"].items():
        print(f"Crop: {crop}")
        if not classes:
            print("  (No datasets available / skipped)")
            continue
        for cls_name, items in classes.items():
            # Check how many are unsplit
            unsplit_items = [item for item in items if item["split"] is None]
            split_items = [item for item in items if item["split"] is not None]
            
            if unsplit_items:
                random.shuffle(unsplit_items)
                n = len(unsplit_items)
                train_end = int(n * 0.7)
                val_end = int(n * 0.85)
                
                for idx, item in enumerate(unsplit_items):
                    if idx < train_end:
                        item["split"] = "train"
                    elif idx < val_end:
                        item["split"] = "val"
                    else:
                        item["split"] = "test"
                        
                items = split_items + unsplit_items
                classes[cls_name] = items
            
            # Print class count
            train_cnt = sum(1 for x in items if x["split"] == "train")
            val_cnt = sum(1 for x in items if x["split"] == "val")
            test_cnt = sum(1 for x in items if x["split"] == "test")
            print(f"  Class '{cls_name}': {len(items)} items (train: {train_cnt}, val: {val_cnt}, test: {test_cnt})")

    # Save index to training/dataset_index.json
    os.makedirs("training", exist_ok=True)
    out_path = "training/dataset_index.json"
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(index, f, indent=2)
    print(f"\nSaved dataset index to {out_path}")

if __name__ == "__main__":
    build_dataset_index()
