import os
import zipfile
import json
import random
from inference.predict import run_inference

def test_inference_pipeline():
    datasets_dir = r"C:\Users\samue\Desktop\Pixelin-sciences\datasets"
    
    plantvillage_zip = os.path.join(datasets_dir, "Plantvillagedataset.zip")
    rice_guard_zip = os.path.join(datasets_dir, "RiceGuard19K.zip")
    
    # We will test:
    # 1. A Paddy leaf image
    # 2. A Tomato leaf image
    
    os.makedirs("tmp_test", exist_ok=True)
    random.seed(42)
    
    # Paddy test
    paddy_img_path = "tmp_test/test_paddy.jpeg"
    print("Extracting a test Paddy image from zip...")
    if os.path.exists(rice_guard_zip):
        with zipfile.ZipFile(rice_guard_zip, 'r') as z:
            # Let's find a blast leaf image
            blast_images = [name for name in z.namelist() if "blast" in name and name.lower().endswith(('.jpg', '.jpeg', '.png'))]
            if blast_images:
                test_file = random.choice(blast_images)
                print(f"Selected Paddy test file: {test_file}")
                with open(paddy_img_path, 'wb') as f:
                    f.write(z.read(test_file))
                    
        if os.path.exists(paddy_img_path):
            print("Running prediction on Paddy test image...")
            result = run_inference(paddy_img_path)
            print(json.dumps(result, indent=2))
            assert result.get("local_model_available") == True, "Local model should be available"
            assert result.get("crop") == "Paddy", f"Expected Paddy crop, got {result.get('crop')}"
            print("Paddy test PASSED!")
            os.remove(paddy_img_path)
        else:
            print("Error: Could not extract test Paddy image")
    else:
        print("RiceGuard19K.zip not found, skipping Paddy test.")

    # Tomato test
    tomato_img_path = "tmp_test/test_tomato.JPG"
    print("\nExtracting a test Tomato image from zip...")
    if os.path.exists(plantvillage_zip):
        with zipfile.ZipFile(plantvillage_zip, 'r') as z:
            # Let's find a Tomato Early Blight image
            eb_images = [name for name in z.namelist() if "Tomato___Early_blight" in name and name.lower().endswith(('.jpg', '.jpeg', '.png'))]
            if eb_images:
                test_file = random.choice(eb_images)
                print(f"Selected Tomato test file: {test_file}")
                with open(tomato_img_path, 'wb') as f:
                    f.write(z.read(test_file))
                    
        if os.path.exists(tomato_img_path):
            print("Running prediction on Tomato test image...")
            result = run_inference(tomato_img_path)
            print(json.dumps(result, indent=2))
            assert result.get("local_model_available") == True, "Local model should be available"
            assert result.get("crop") == "Vegetables", f"Expected Vegetables crop, got {result.get('crop')}"
            assert result.get("sub_crop") == "tomato", f"Expected tomato sub-crop, got {result.get('sub_crop')}"
            print("Tomato test PASSED!")
            os.remove(tomato_img_path)
        else:
            print("Error: Could not extract test Tomato image")
    else:
        print("Plantvillagedataset.zip not found, skipping Tomato test.")
        
    try:
        os.rmdir("tmp_test")
    except Exception:
        pass
        
    print("\nAll tests finished!")

if __name__ == "__main__":
    test_inference_pipeline()
