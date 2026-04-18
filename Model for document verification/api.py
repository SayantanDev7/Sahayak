"""
Document Verification API — Smart Hybrid Approach
===================================================
Combines ML model classification with real image analysis heuristics
to provide meaningful document verification results.

Pipeline:
  1. Basic validation (format, size, corruption check)
  2. Image quality analysis (resolution, sharpness, contrast)
  3. Document-likeness scoring (aspect ratio, edge density, text patterns)
  4. ML model type classification (predicted document type)
  5. Combined verdict
"""
from flask import Flask, request, jsonify
import os
import sys
import numpy as np
from werkzeug.utils import secure_filename
from PIL import Image, ImageFilter, ImageStat

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

import model as verify_model

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB max
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Allowed extensions for document images
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'bmp', 'tiff', 'tif', 'webp'}

# Standard document aspect ratios (width/height)
DOCUMENT_RATIOS = {
    'id_card':    (1.58, 0.25),   # Credit card / Aadhaar / PAN (85.6×53.98mm)
    'a4_portrait': (0.707, 0.15), # A4 portrait (210×297mm)
    'a4_landscape': (1.414, 0.15), # A4 landscape
    'letter':     (0.773, 0.15),  # US Letter
    'passport':   (0.714, 0.15),  # Passport (125×88mm)
}

# Load the TF model for document type classification
loaded_model, config = None, None
try:
    loaded_model, config = verify_model.load_model("saved_model")
    print("ML model loaded successfully!")
    print(f"Classes: {config.CLASS_NAMES}")
except Exception as e:
    print(f"Warning: ML model not loaded: {e}")
    print("Will use heuristic-only verification.")


def allowed_file(filename):
    """Check if the file extension is an allowed image format."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def analyze_image_quality(img):
    """
    Analyze image quality metrics.
    Returns dict with quality scores.
    """
    width, height = img.size
    
    # Convert to grayscale for analysis
    gray = img.convert('L')
    stat = ImageStat.Stat(gray)
    
    # 1. Resolution score (documents should be at least 300px on short side)
    min_dim = min(width, height)
    if min_dim >= 600:
        resolution_score = 1.0
    elif min_dim >= 300:
        resolution_score = 0.7
    elif min_dim >= 150:
        resolution_score = 0.4
    else:
        resolution_score = 0.1
    
    # 2. Sharpness score (via Laplacian variance — blurry = low variance)
    laplacian = gray.filter(ImageFilter.FIND_EDGES)
    lap_stat = ImageStat.Stat(laplacian)
    sharpness = lap_stat.var[0]
    
    if sharpness > 1500:
        sharpness_score = 1.0
    elif sharpness > 500:
        sharpness_score = 0.8
    elif sharpness > 100:
        sharpness_score = 0.5
    else:
        sharpness_score = 0.2  # Very blurry
    
    # 3. Contrast score (standard deviation of pixel values)
    contrast = stat.stddev[0]
    if contrast > 60:
        contrast_score = 1.0
    elif contrast > 40:
        contrast_score = 0.7
    elif contrast > 20:
        contrast_score = 0.4
    else:
        contrast_score = 0.1  # Very low contrast (blank page?)
    
    # 4. Brightness check (not too dark, not too bright)
    mean_brightness = stat.mean[0]
    if 50 < mean_brightness < 220:
        brightness_score = 1.0
    elif 30 < mean_brightness < 240:
        brightness_score = 0.6
    else:
        brightness_score = 0.2  # Way too dark or too bright
    
    return {
        'resolution_score': resolution_score,
        'sharpness_score': sharpness_score,
        'contrast_score': contrast_score,
        'brightness_score': brightness_score,
        'width': width,
        'height': height,
        'sharpness_raw': round(sharpness, 1),
        'contrast_raw': round(contrast, 1),
        'brightness_raw': round(mean_brightness, 1),
    }


def analyze_document_likeness(img):
    """
    Determine how likely this image is an actual document (vs random photo).
    
    Real documents have:
    - Standard aspect ratios (card-sized or paper-sized)
    - Moderate edge density (text, borders — NOT random noise)
    - Structured layout (text areas vs whitespace)
    - Mixed regions (headers + body + photo)
    """
    width, height = img.size
    gray = img.convert('L')
    
    # 1. Aspect ratio match
    aspect = width / height if height > 0 else 0
    best_ratio_match = 0.0
    matched_type = 'unknown'
    
    for doc_type, (target_ratio, tolerance) in DOCUMENT_RATIOS.items():
        # Check both orientations
        diff_normal = abs(aspect - target_ratio)
        diff_rotated = abs(aspect - (1.0 / target_ratio)) if target_ratio > 0 else 999
        diff = min(diff_normal, diff_rotated)
        
        match = max(0, 1.0 - (diff / (tolerance * 4)))
        if match > best_ratio_match:
            best_ratio_match = match
            matched_type = doc_type
    
    # 2. Edge density analysis
    edges = gray.filter(ImageFilter.FIND_EDGES)
    edge_arr = np.array(edges, dtype=float)
    edge_density = np.mean(edge_arr > 30)  # Fraction of strong edges
    
    # KEY INSIGHT: Random noise has VERY HIGH edge density (>0.30) because
    # every pixel differs from its neighbors. Real documents have MODERATE
    # edge density (0.02-0.15) — text and borders but also whitespace.
    if 0.02 <= edge_density <= 0.20:
        edge_score = 0.9   # Sweet spot — structured content with whitespace
    elif 0.01 <= edge_density <= 0.25:
        edge_score = 0.6   # Borderline — might be very dense text or sparse
    elif edge_density > 0.30:
        edge_score = 0.05  # Almost certainly random noise or chaotic image
    elif edge_density > 0.25:
        edge_score = 0.2   # Too many edges — likely a photo, not a document
    else:
        edge_score = 0.15  # Almost no edges — blank page or solid color
    
    # 3. Spatial structure — divide image into grid and check variance
    arr = np.array(gray)
    grid_size = 4
    h_step = arr.shape[0] // grid_size
    w_step = arr.shape[1] // grid_size
    
    region_means = []
    for i in range(grid_size):
        for j in range(grid_size):
            region = arr[i*h_step:(i+1)*h_step, j*w_step:(j+1)*w_step]
            if region.size > 0:
                region_means.append(np.mean(region))
    
    # Documents have varied regions (text vs white space vs images)
    # Random noise has UNIFORM region means (all ~128 for random noise)
    if len(region_means) > 1:
        region_variance = np.std(region_means)
        if region_variance > 25:
            structure_score = 1.0  # High variation — structured layout
        elif region_variance > 12:
            structure_score = 0.7  # Moderate — could be a document
        elif region_variance > 5:
            structure_score = 0.4  # Low — some structure
        elif region_variance > 2:
            structure_score = 0.2  # Very uniform — noise or blank
        else:
            structure_score = 0.05  # Perfectly uniform — random noise
    else:
        structure_score = 0.1
    
    # 4. Color analysis — documents tend to be more neutral/white
    if img.mode == 'RGB':
        r, g, b = img.split()
        r_mean, g_mean, b_mean = ImageStat.Stat(r).mean[0], ImageStat.Stat(g).mean[0], ImageStat.Stat(b).mean[0]
        color_spread = max(abs(r_mean - g_mean), abs(g_mean - b_mean), abs(r_mean - b_mean))
        
        # Documents tend to have low color spread (mostly black text on white)
        # or moderate spread (colored logos/headers)
        if color_spread < 40:
            color_score = 0.9  # Neutral — document-like
        elif color_spread < 80:
            color_score = 0.6  # Some color — could be a colored document
        else:
            color_score = 0.3  # Very colorful — probably not a document
    else:
        color_score = 0.7  # Grayscale — likely a scan
    
    return {
        'aspect_ratio_score': round(best_ratio_match, 3),
        'edge_density_score': round(edge_score, 3),
        'structure_score': round(structure_score, 3),
        'color_score': round(color_score, 3),
        'matched_doc_type': matched_type,
        'aspect_ratio': round(aspect, 3),
        'edge_density_raw': round(edge_density, 4),
    }


def get_ml_prediction(filepath):
    """Run ML model prediction if available."""
    if loaded_model is None or config is None:
        return None
    
    try:
        result = verify_model.predict_document(loaded_model, filepath, config)
        return {
            'predicted_class': result['predicted_class'],
            'confidence': result['confidence'],
            'all_probabilities': result.get('all_probabilities', {}),
        }
    except Exception as e:
        print(f"ML prediction error: {e}")
        return None


def compute_final_verdict(quality, doc_likeness, ml_result):
    """
    Combine all signals into a final verification verdict.
    
    Scoring weights:
      - Image quality:      20%
      - Document likeness:  50%  (most important — is this actually a document?)
      - ML classification:  30%  (what type of document)
    """
    # Quality composite
    quality_composite = (
        quality['resolution_score'] * 0.25 +
        quality['sharpness_score'] * 0.30 +
        quality['contrast_score'] * 0.25 +
        quality['brightness_score'] * 0.20
    )
    
    # Document-likeness composite
    doc_composite = (
        doc_likeness['aspect_ratio_score'] * 0.20 +
        doc_likeness['edge_density_score'] * 0.35 +
        doc_likeness['structure_score'] * 0.30 +
        doc_likeness['color_score'] * 0.15
    )
    
    # ML composite (if available)
    if ml_result:
        ml_confidence = ml_result['confidence']
        # Boost ML score if it's confident about a specific class
        ml_composite = min(ml_confidence * 1.5, 1.0)
    else:
        ml_composite = 0.5  # Neutral if no ML
    
    # Final weighted score
    final_score = (
        quality_composite * 0.20 +
        doc_composite * 0.50 +
        ml_composite * 0.30
    )
    
    # Decision thresholds
    if final_score >= 0.55:
        is_valid = True
        if final_score >= 0.75:
            verdict = "Document verified successfully"
        else:
            verdict = "Document accepted with moderate confidence"
    else:
        is_valid = False
        if doc_composite < 0.35:
            verdict = "This does not appear to be a valid document. Please upload a clear photo of your Aadhaar, PAN, or other ID."
        elif quality_composite < 0.4:
            verdict = "Image quality is too low. Please upload a clearer, well-lit photo of your document."
        else:
            verdict = "Could not verify this document. Please try again with a different image."
    
    confidence_pct = round(final_score * 100, 1)
    
    return {
        'is_valid': is_valid,
        'confidence': confidence_pct,
        'verdict': verdict,
        'scores': {
            'quality': round(quality_composite * 100, 1),
            'document_likeness': round(doc_composite * 100, 1),
            'ml_classification': round(ml_composite * 100, 1),
            'final': confidence_pct,
        }
    }


@app.route('/api/verify-document', methods=['POST'])
def verify_document():
    """Main document verification endpoint."""
    if 'document' not in request.files:
        return jsonify({"error": "No document file provided"}), 400
    
    file = request.files['document']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400
    
    if not allowed_file(file.filename):
        ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else 'unknown'
        return jsonify({
            "is_valid": False,
            "valid": False,
            "confidence": 0,
            "message": f"Invalid file format (.{ext}). Please upload JPG, PNG, or PDF.",
        }), 400
    
    # Save temporarily
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    try:
        # Load and validate image
        try:
            img = Image.open(filepath)
            img.verify()  # Check for corruption
            img = Image.open(filepath)  # Re-open after verify
            img.load()   # Force full load
        except Exception:
            return jsonify({
                "is_valid": False,
                "valid": False,
                "confidence": 0,
                "message": "Corrupted or invalid image file. Please upload a valid image.",
            }), 400
        
        # Convert RGBA/palette to RGB
        if img.mode in ('RGBA', 'P', 'LA'):
            img = img.convert('RGB')
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Step 1: Image quality analysis
        quality = analyze_image_quality(img)
        
        # Step 2: Document likeness analysis
        doc_likeness = analyze_document_likeness(img)
        
        # Step 3: ML model classification (optional)
        ml_result = get_ml_prediction(filepath)
        
        # Step 4: Combine into final verdict
        verdict = compute_final_verdict(quality, doc_likeness, ml_result)
        
        # Build response
        predicted_class = ml_result['predicted_class'] if ml_result else 'unknown'
        
        response = {
            "is_valid": verdict['is_valid'],
            "valid": verdict['is_valid'],
            "confidence": verdict['confidence'],
            "score": verdict['confidence'],
            "predicted_class": predicted_class,
            "message": verdict['verdict'],
            "analysis": {
                "quality": verdict['scores']['quality'],
                "document_likeness": verdict['scores']['document_likeness'],
                "ml_classification": verdict['scores']['ml_classification'],
                "image_dimensions": f"{quality['width']}x{quality['height']}",
            },
        }
        
        if ml_result:
            response["all_probabilities"] = ml_result.get('all_probabilities', {})
        
        print(f"[VERIFY] {filename}: valid={verdict['is_valid']}, confidence={verdict['confidence']}%, "
              f"quality={verdict['scores']['quality']}%, doc_like={verdict['scores']['document_likeness']}%, "
              f"class={predicted_class}")
        
        return jsonify(response)
    
    except Exception as e:
        print(f"Verification error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    
    finally:
        # Always clean up
        if os.path.exists(filepath):
            os.remove(filepath)


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok",
        "model_loaded": loaded_model is not None,
        "classes": config.CLASS_NAMES if config else [],
        "verification": "hybrid (quality + document-likeness + ML classification)",
    })


if __name__ == '__main__':
    print("\n" + "="*60)
    print("Document Verification API")
    print("="*60)
    print(f"  ML Model:  {'Loaded' if loaded_model else 'Not loaded (heuristic-only mode)'}")
    print(f"  Endpoint:  POST /api/verify-document")
    print(f"  Health:    GET  /api/health")
    print(f"  Port:      5001")
    print("="*60 + "\n")
    app.run(debug=True, port=5001)
