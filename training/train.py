import os
import json
import zipfile
import io
import time
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms, models
from PIL import Image

# Ensure models directory exists
os.makedirs("models/crop-classifier", exist_ok=True)
os.makedirs("models/healthy-classifier", exist_ok=True)
os.makedirs("models/disease-classifier", exist_ok=True)

class ZipDataset(Dataset):
    def __init__(self, zip_paths, items, transform=None):
        self.zip_paths = zip_paths
        self.items = items
        self.transform = transform
        self.zip_handles = {}

    def __len__(self):
        return len(self.items)

    def __getitem__(self, idx):
        item = self.items[idx]
        zip_key = item["zip"]
        inner_path = item["path"]
        label = item["label"]
        
        # Lazy open of zip files for thread/worker safety
        if zip_key not in self.zip_handles:
            self.zip_handles[zip_key] = zipfile.ZipFile(self.zip_paths[zip_key], 'r')
            
        z = self.zip_handles[zip_key]
        try:
            img_bytes = z.read(inner_path)
            img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        except Exception as e:
            # Fallback to black image in case of corrupted file
            print(f"Error reading image {inner_path} in {zip_key}: {e}")
            img = Image.new("RGB", (224, 224), (0, 0, 0))
            
        if self.transform:
            img = self.transform(img)
            
        return img, label

    def __del__(self):
        for z in self.zip_handles.values():
            z.close()

def train_model(model_name, train_dataset, val_dataset, num_classes, epochs=5, batch_size=32, device="cpu"):
    print(f"\n--- Training {model_name} ({num_classes} classes) ---")
    
    # Load pre-trained MobileNetV3
    try:
        from torchvision.models import mobilenet_v3_large, MobileNet_V3_Large_Weights
        model = mobilenet_v3_large(weights=MobileNet_V3_Large_Weights.DEFAULT)
        # Freeze base layers
        for param in model.parameters():
            param.requires_grad = False
        print("Loaded pre-trained weights for MobileNetV3.")
    except Exception as e:
        print(f"Could not load pre-trained weights ({e}). Training from scratch.")
        from torchvision.models import mobilenet_v3_large
        model = mobilenet_v3_large(weights=None)
        
    # Replace classification head
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(in_features, num_classes)
    model = model.to(device)
    
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=0)
    
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.classifier[3].parameters(), lr=0.001)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', patience=1, factor=0.5)
    
    best_loss = float('inf')
    best_weights = None
    
    for epoch in range(epochs):
        t0 = time.time()
        # Train Loop
        model.train()
        train_loss = 0.0
        train_correct = 0
        total_train = 0
        
        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            train_loss += loss.item() * inputs.size(0)
            _, preds = torch.max(outputs, 1)
            train_correct += torch.sum(preds == labels.data).item()
            total_train += inputs.size(0)
            
        epoch_train_loss = train_loss / total_train
        epoch_train_acc = train_correct / total_train
        
        # Validation Loop
        model.eval()
        val_loss = 0.0
        val_correct = 0
        total_val = 0
        
        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs, labels = inputs.to(device), labels.to(device)
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                
                val_loss += loss.item() * inputs.size(0)
                _, preds = torch.max(outputs, 1)
                val_correct += torch.sum(preds == labels.data).item()
                total_val += inputs.size(0)
                
        epoch_val_loss = val_loss / total_val
        epoch_val_acc = val_correct / total_val
        
        scheduler.step(epoch_val_loss)
        
        print(f"Epoch {epoch+1}/{epochs} ({time.time()-t0:.1f}s) | "
              f"Train Loss: {epoch_train_loss:.4f} Acc: {epoch_train_acc:.4f} | "
              f"Val Loss: {epoch_val_loss:.4f} Acc: {epoch_val_acc:.4f}")
        
        # Checkpoint Best Model
        if epoch_val_loss < best_loss:
            best_loss = epoch_val_loss
            best_weights = model.state_dict()
            
    # Save best weights
    if best_weights:
        model.load_state_dict(best_weights)
        
    return model

def main():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using training device: {device}")
    
    # Load dataset index
    index_path = "training/dataset_index.json"
    if not os.path.exists(index_path):
        print(f"Dataset index file {index_path} not found! Please run extract_dataset.py first.")
        return
        
    with open(index_path, 'r', encoding='utf-8') as f:
        index = json.load(f)
        
    zip_paths = index["zips"]
    crops = index["crops"]
    
    # Set up transformations
    # Image downscaling to 128x128 to drastically reduce CPU overhead during forward/backward passes
    img_size = 128
    
    train_transform = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(15),
        transforms.ColorJitter(brightness=0.1, contrast=0.1),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    
    val_transform = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    
    # ----------------------------------------------------
    # 1. CROP CLASSIFIER
    # Classes: paddy, tomato, pepper, potato
    # ----------------------------------------------------
    crop_list = [c for c in crops.keys() if crops[c]]
    crop_to_idx = {c: idx for idx, c in enumerate(crop_list)}
    
    crop_train_items = []
    crop_val_items = []
    
    # Limit dataset sizes on CPU to prevent excessive run times while maintaining structure
    # Use configurable max sample limits to make training fast and complete in < 2 mins.
    # Default is 300 images per class for training, 50 for validation.
    max_train_samples = 300
    max_val_samples = 50
    
    for c_name in crop_list:
        c_idx = crop_to_idx[c_name]
        all_class_train = []
        all_class_val = []
        
        # Combine all sub-disease folders for this crop to get its samples
        for d_items in crops[c_name].values():
            for item in d_items:
                c_item = {"zip": item["zip"], "path": item["path"], "label": c_idx}
                if item["split"] == "train":
                    all_class_train.append(c_item)
                elif item["split"] == "val":
                    all_class_val.append(c_item)
                    
        # Apply sampling to stay within CPU performance constraints
        random_seed = 42
        import random
        random.seed(random_seed)
        
        if len(all_class_train) > max_train_samples:
            all_class_train = random.sample(all_class_train, max_train_samples)
        if len(all_class_val) > max_val_samples:
            all_class_val = random.sample(all_class_val, max_val_samples)
            
        crop_train_items.extend(all_class_train)
        crop_val_items.extend(all_class_val)
        
    print(f"\nCrop Classifier: {len(crop_train_items)} train, {len(crop_val_items)} validation images.")
    crop_train_dataset = ZipDataset(zip_paths, crop_train_items, train_transform)
    crop_val_dataset = ZipDataset(zip_paths, crop_val_items, val_transform)
    
    crop_model = train_model("Crop Classifier", crop_train_dataset, crop_val_dataset, len(crop_list), epochs=3, device=device)
    torch.save(crop_model.state_dict(), "models/crop-classifier/crop_classifier.pth")
    with open("models/crop-classifier/class_indices.json", "w") as f:
        json.dump(crop_to_idx, f)
        
    # ----------------------------------------------------
    # 2. HEALTHY CLASSIFIER
    # Classes: 0 -> Healthy, 1 -> Diseased (Across all crops)
    # ----------------------------------------------------
    healthy_train_items = []
    healthy_val_items = []
    
    for c_name in crop_list:
        for d_name, items in crops[c_name].items():
            label = 0 if d_name == "healthy" else 1
            
            c_train = [{"zip": x["zip"], "path": x["path"], "label": label} for x in items if x["split"] == "train"]
            c_val = [{"zip": x["zip"], "path": x["path"], "label": label} for x in items if x["split"] == "val"]
            
            # Sampling per sub-class to keep sizes balanced
            sub_train_limit = max_train_samples // len(crops[c_name])
            sub_val_limit = max_val_samples // len(crops[c_name])
            
            if len(c_train) > sub_train_limit:
                c_train = random.sample(c_train, sub_train_limit)
            if len(c_val) > sub_val_limit:
                c_val = random.sample(c_val, sub_val_limit)
                
            healthy_train_items.extend(c_train)
            healthy_val_items.extend(c_val)
            
    print(f"\nHealthy Classifier: {len(healthy_train_items)} train, {len(healthy_val_items)} validation images.")
    healthy_train_dataset = ZipDataset(zip_paths, healthy_train_items, train_transform)
    healthy_val_dataset = ZipDataset(zip_paths, healthy_val_items, val_transform)
    
    healthy_model = train_model("Healthy vs Diseased", healthy_train_dataset, healthy_val_dataset, 2, epochs=3, device=device)
    torch.save(healthy_model.state_dict(), "models/healthy-classifier/healthy_classifier.pth")
    with open("models/healthy-classifier/class_indices.json", "w") as f:
        json.dump({"healthy": 0, "diseased": 1}, f)

    # ----------------------------------------------------
    # 3. CROP SPECIFIC DISEASE CLASSIFIERS
    # For Paddy, Tomato, Potato
    # ----------------------------------------------------
    for c_name in crop_list:
        diseases = [d for d in crops[c_name].keys() if d != "healthy"]
        if len(diseases) <= 1:
            print(f"\nSkipping disease classifier for {c_name} (only {len(diseases)} disease classes available).")
            continue
            
        disease_to_idx = {d: idx for idx, d in enumerate(diseases)}
        d_train_items = []
        d_val_items = []
        
        for d_name in diseases:
            d_idx = disease_to_idx[d_name]
            c_train = [{"zip": x["zip"], "path": x["path"], "label": d_idx} for x in crops[c_name][d_name] if x["split"] == "train"]
            c_val = [{"zip": x["zip"], "path": x["path"], "label": d_idx} for x in crops[c_name][d_name] if x["split"] == "val"]
            
            if len(c_train) > max_train_samples:
                c_train = random.sample(c_train, max_train_samples)
            if len(c_val) > max_val_samples:
                c_val = random.sample(c_val, max_val_samples)
                
            d_train_items.extend(c_train)
            d_val_items.extend(c_val)
            
        print(f"\n{c_name.capitalize()} Disease Classifier: {len(d_train_items)} train, {len(d_val_items)} validation images.")
        d_train_dataset = ZipDataset(zip_paths, d_train_items, train_transform)
        d_val_dataset = ZipDataset(zip_paths, d_val_items, val_transform)
        
        d_model = train_model(f"{c_name.capitalize()} Disease", d_train_dataset, d_val_dataset, len(diseases), epochs=3, device=device)
        torch.save(d_model.state_dict(), f"models/disease-classifier/{c_name}_disease_classifier.pth")
        with open(f"models/disease-classifier/{c_name}_indices.json", "w") as f:
            json.dump(disease_to_idx, f)
            
    print("\nModel training pipeline complete! All model files stored in models/")

if __name__ == "__main__":
    main()
