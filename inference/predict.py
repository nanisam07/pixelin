import os
import sys
import json
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image

def get_model(num_classes):
    # Standard MobileNetV3 loading
    try:
        model = models.mobilenet_v3_large(weights=None)
    except Exception:
        model = models.mobilenet_v3_large()
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(in_features, num_classes)
    return model

def run_inference(image_path):
    # Check if crop model exists. If not, local models are not trained.
    crop_model_path = "models/crop-classifier/crop_classifier.pth"
    crop_indices_path = "models/crop-classifier/class_indices.json"
    healthy_model_path = "models/healthy-classifier/healthy_classifier.pth"
    
    if not os.path.exists(crop_model_path) or not os.path.exists(crop_indices_path) or not os.path.exists(healthy_model_path):
        return {"local_model_available": False}
        
    try:
        # Load indices mapping
        with open(crop_indices_path, 'r') as f:
            crop_to_idx = json.load(f)
        idx_to_crop = {v: k for k, v in crop_to_idx.items()}
        
        # Load image
        img = Image.open(image_path).convert("RGB")
        
        # Transformation
        img_size = 128
        transform = transforms.Compose([
            transforms.Resize((img_size, img_size)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])
        input_tensor = transform(img).unsqueeze(0) # add batch dim
        
        # 1. CROP DETECTION
        crop_model = get_model(len(crop_to_idx))
        crop_model.load_state_dict(torch.load(crop_model_path, map_location="cpu"))
        crop_model.eval()
        
        with torch.no_grad():
            outputs = crop_model(input_tensor)
            probs = torch.softmax(outputs, dim=1)[0]
            crop_confidence, crop_idx_pred = torch.max(probs, dim=0)
            crop_confidence = crop_confidence.item() * 100
            crop_idx_pred = crop_idx_pred.item()
            predicted_crop_label = idx_to_crop[crop_idx_pred] # paddy, tomato, pepper, potato
            
        # Determine broad crop category (Paddy vs Vegetables)
        if predicted_crop_label == "paddy":
            crop_category = "Paddy"
            sub_crop = "paddy"
        elif predicted_crop_label in ["tomato", "pepper", "potato"]:
            crop_category = "Vegetables"
            sub_crop = predicted_crop_label
        else:
            crop_category = "Unknown"
            sub_crop = predicted_crop_label
            
        # 2. HEALTHY DETECTION
        healthy_model = get_model(2)
        healthy_model.load_state_dict(torch.load(healthy_model_path, map_location="cpu"))
        healthy_model.eval()
        
        with torch.no_grad():
            outputs = healthy_model(input_tensor)
            probs = torch.softmax(outputs, dim=1)[0]
            healthy_prob = probs[0].item() * 100
            diseased_prob = probs[1].item() * 100
            
        is_healthy = healthy_prob > diseased_prob
        healthy_confidence = healthy_prob if is_healthy else diseased_prob
        
        if is_healthy:
            return {
                "local_model_available": True,
                "crop": crop_category,
                "sub_crop": sub_crop,
                "status": "healthy",
                "crop_confidence": round(crop_confidence, 1),
                "healthy_confidence": round(healthy_confidence, 1)
            }
            
        # 3. DISEASE DETECTION
        disease_label = "Unknown"
        disease_confidence = 50.0
        
        # Run specific crop disease models
        if crop_category == "Paddy":
            model_path = "models/disease-classifier/paddy_disease_classifier.pth"
            indices_path = "models/disease-classifier/paddy_indices.json"
            if os.path.exists(model_path) and os.path.exists(indices_path):
                with open(indices_path, 'r') as f:
                    disease_to_idx = json.load(f)
                idx_to_disease = {v: k for k, v in disease_to_idx.items()}
                
                model = get_model(len(disease_to_idx))
                model.load_state_dict(torch.load(model_path, map_location="cpu"))
                model.eval()
                
                with torch.no_grad():
                    outputs = model(input_tensor)
                    probs = torch.softmax(outputs, dim=1)[0]
                    conf, idx_pred = torch.max(probs, dim=0)
                    disease_confidence = conf.item() * 100
                    disease_label = idx_to_disease[idx_pred.item()]
                    
        elif sub_crop == "tomato":
            model_path = "models/disease-classifier/tomato_disease_classifier.pth"
            indices_path = "models/disease-classifier/tomato_indices.json"
            if os.path.exists(model_path) and os.path.exists(indices_path):
                with open(indices_path, 'r') as f:
                    disease_to_idx = json.load(f)
                idx_to_disease = {v: k for k, v in disease_to_idx.items()}
                
                model = get_model(len(disease_to_idx))
                model.load_state_dict(torch.load(model_path, map_location="cpu"))
                model.eval()
                
                with torch.no_grad():
                    outputs = model(input_tensor)
                    probs = torch.softmax(outputs, dim=1)[0]
                    conf, idx_pred = torch.max(probs, dim=0)
                    disease_confidence = conf.item() * 100
                    disease_label = idx_to_disease[idx_pred.item()]
                    
        elif sub_crop == "pepper":
            # Pepper only has bacterial spot, so if diseased, it is bacterial spot
            disease_label = "bacterial_spot"
            disease_confidence = 95.0
            
        elif sub_crop == "potato":
            model_path = "models/disease-classifier/potato_disease_classifier.pth"
            indices_path = "models/disease-classifier/potato_indices.json"
            if os.path.exists(model_path) and os.path.exists(indices_path):
                with open(indices_path, 'r') as f:
                    disease_to_idx = json.load(f)
                idx_to_disease = {v: k for k, v in disease_to_idx.items()}
                
                model = get_model(len(disease_to_idx))
                model.load_state_dict(torch.load(model_path, map_location="cpu"))
                model.eval()
                
                with torch.no_grad():
                    outputs = model(input_tensor)
                    probs = torch.softmax(outputs, dim=1)[0]
                    conf, idx_pred = torch.max(probs, dim=0)
                    disease_confidence = conf.item() * 100
                    disease_label = idx_to_disease[idx_pred.item()]
                    
        # Return final predictions
        return {
            "local_model_available": True,
            "crop": crop_category,
            "sub_crop": sub_crop,
            "status": "diseased",
            "disease": disease_label,
            "crop_confidence": round(crop_confidence, 1),
            "healthy_confidence": round(healthy_confidence, 1),
            "disease_confidence": round(disease_confidence, 1)
        }
    except Exception as e:
        return {
            "local_model_available": False,
            "error": str(e)
        }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided", "local_model_available": False}))
        sys.exit(1)
        
    image_path = sys.argv[1]
    result = run_inference(image_path)
    print(json.dumps(result))
