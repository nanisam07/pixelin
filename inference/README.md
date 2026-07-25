# Web Inference Pipeline

Client-side model runner:
- `onnxRunner.js`: Interface to load and run ONNX models in browser using `onnxruntime-web`.
- `tfjsRunner.js`: Interface to load and run TFJS models in browser.
- `mockInference.js`: Fallback predictor returning mock values based on local datasets when models are not loaded.
