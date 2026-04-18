"""
Document Verification Model using TensorFlow/Keras
===================================================
A CNN-based model for classifying and verifying document images.
Supports classification of document types (e.g., Aadhaar, PAN, Passport, etc.)
and can be extended for authenticity verification (real vs. forged).

Usage:
    Training:   python model.py --mode train --data_dir ./dataset
    Evaluation: python model.py --mode evaluate --data_dir ./dataset
    Prediction: python model.py --mode predict --image_path ./test_image.jpg
"""

import os
import argparse
import numpy as np
try:
    import tensorflow as tf
    from tensorflow import keras
    from tensorflow.keras import layers, models, callbacks
    from tensorflow.keras.preprocessing.image import ImageDataGenerator
except ImportError:
    tf = None
    keras = type('Mock', (), {'Model': object})
    print("Warning: TensorFlow not found. Training and prediction will be disabled, but dataset generation is still available.")

import json
from datetime import datetime


# ============================================================================
# Configuration
# ============================================================================

class Config:
    """Model and training configuration."""
    
    # Image settings
    IMG_HEIGHT = 224
    IMG_WIDTH = 224
    IMG_CHANNELS = 3
    
    # Training settings
    BATCH_SIZE = 32
    EPOCHS = 50
    LEARNING_RATE = 1e-4
    VALIDATION_SPLIT = 0.2
    
    # Model settings
    DROPOUT_RATE = 0.5
    NUM_CLASSES = 9  # Will be updated based on dataset
    
    # Paths
    MODEL_SAVE_PATH = "saved_model"
    CHECKPOINT_PATH = "checkpoints"
    LOG_DIR = "logs"
    
    # Document class names (default — update based on your dataset)
    CLASS_NAMES = [
        "10th_marksheet",
        "12th_marksheet",
        "aadhaar_card",
        "caste_certificate",
        "income_certificate",
        "pan_card",
        "passport",
        "student_id",
        "voter_id"
    ]


# ============================================================================
# Data Pipeline
# ============================================================================

def create_data_generators(data_dir: str, config: Config):
    """
    Create training and validation data generators with augmentation.
    
    Expected directory structure:
        data_dir/
        ├── aadhaar_card/
        │   ├── img001.jpg
        │   ├── img002.jpg
        │   └── ...
        ├── pan_card/
        │   ├── img001.jpg
        │   └── ...
        ├── passport/
        │   └── ...
        ├── driving_license/
        │   └── ...
        └── voter_id/
            └── ...
    
    Args:
        data_dir: Path to the dataset directory.
        config: Configuration object.
    
    Returns:
        Tuple of (train_generator, val_generator)
    """
    # Training data augmentation
    train_datagen = ImageDataGenerator(
        rescale=1.0 / 255,
        rotation_range=15,
        width_shift_range=0.1,
        height_shift_range=0.1,
        shear_range=0.1,
        zoom_range=0.1,
        horizontal_flip=False,  # Documents shouldn't be flipped
        brightness_range=[0.8, 1.2],
        fill_mode="nearest",
        validation_split=config.VALIDATION_SPLIT,
    )

    # Validation data — only rescaling, no augmentation
    val_datagen = ImageDataGenerator(
        rescale=1.0 / 255,
        validation_split=config.VALIDATION_SPLIT,
    )

    train_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=(config.IMG_HEIGHT, config.IMG_WIDTH),
        batch_size=config.BATCH_SIZE,
        class_mode="categorical",
        subset="training",
        shuffle=True,
        seed=42,
    )

    val_generator = val_datagen.flow_from_directory(
        data_dir,
        target_size=(config.IMG_HEIGHT, config.IMG_WIDTH),
        batch_size=config.BATCH_SIZE,
        class_mode="categorical",
        subset="validation",
        shuffle=False,
        seed=42,
    )

    # Update config with actual class info
    config.NUM_CLASSES = len(train_generator.class_indices)
    config.CLASS_NAMES = list(train_generator.class_indices.keys())
    
    print(f"\n{'='*60}")
    print(f"Dataset Summary")
    print(f"{'='*60}")
    print(f"  Classes found    : {config.NUM_CLASSES}")
    print(f"  Class names      : {config.CLASS_NAMES}")
    print(f"  Training samples : {train_generator.samples}")
    print(f"  Validation samples: {val_generator.samples}")
    print(f"  Image size       : {config.IMG_HEIGHT}x{config.IMG_WIDTH}x{config.IMG_CHANNELS}")
    print(f"{'='*60}\n")

    return train_generator, val_generator


def create_tf_dataset(data_dir: str, config: Config):
    """
    Alternative: Create tf.data.Dataset pipeline for better performance.
    Uses tf.keras.utils.image_dataset_from_directory.
    
    Args:
        data_dir: Path to the dataset directory.
        config: Configuration object.
    
    Returns:
        Tuple of (train_ds, val_ds)
    """
    train_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=config.VALIDATION_SPLIT,
        subset="training",
        seed=42,
        image_size=(config.IMG_HEIGHT, config.IMG_WIDTH),
        batch_size=config.BATCH_SIZE,
        label_mode="categorical",
    )

    val_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=config.VALIDATION_SPLIT,
        subset="validation",
        seed=42,
        image_size=(config.IMG_HEIGHT, config.IMG_WIDTH),
        batch_size=config.BATCH_SIZE,
        label_mode="categorical",
    )

    # Update config
    config.CLASS_NAMES = train_ds.class_names
    config.NUM_CLASSES = len(config.CLASS_NAMES)

    # Performance optimization
    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

    print(f"\n{'='*60}")
    print(f"  tf.data Dataset loaded")
    print(f"  Classes: {config.CLASS_NAMES}")
    print(f"  Num classes: {config.NUM_CLASSES}")
    print(f"{'='*60}\n")

    return train_ds, val_ds


# ============================================================================
# Model Architecture
# ============================================================================

def build_custom_cnn(config: Config) -> keras.Model:
    """
    Build a custom CNN model for document classification.
    Good for smaller datasets where transfer learning may not be necessary.
    
    Architecture:
        - 4 Convolutional blocks with BatchNorm and MaxPooling
        - Global Average Pooling
        - Dense layers with Dropout
        - Softmax output
    
    Args:
        config: Configuration object.
    
    Returns:
        Compiled Keras model.
    """
    model = models.Sequential([
        # Input
        layers.Input(shape=(config.IMG_HEIGHT, config.IMG_WIDTH, config.IMG_CHANNELS)),
        
        # Block 1
        layers.Conv2D(32, (3, 3), padding="same"),
        layers.BatchNormalization(),
        layers.Activation("relu"),
        layers.Conv2D(32, (3, 3), padding="same"),
        layers.BatchNormalization(),
        layers.Activation("relu"),
        layers.MaxPooling2D((2, 2)),
        
        # Block 2
        layers.Conv2D(64, (3, 3), padding="same"),
        layers.BatchNormalization(),
        layers.Activation("relu"),
        layers.Conv2D(64, (3, 3), padding="same"),
        layers.BatchNormalization(),
        layers.Activation("relu"),
        layers.MaxPooling2D((2, 2)),
        
        # Block 3
        layers.Conv2D(128, (3, 3), padding="same"),
        layers.BatchNormalization(),
        layers.Activation("relu"),
        layers.Conv2D(128, (3, 3), padding="same"),
        layers.BatchNormalization(),
        layers.Activation("relu"),
        layers.MaxPooling2D((2, 2)),
        
        # Block 4
        layers.Conv2D(256, (3, 3), padding="same"),
        layers.BatchNormalization(),
        layers.Activation("relu"),
        layers.Conv2D(256, (3, 3), padding="same"),
        layers.BatchNormalization(),
        layers.Activation("relu"),
        layers.MaxPooling2D((2, 2)),
        
        # Classification Head
        layers.GlobalAveragePooling2D(),
        layers.Dense(512),
        layers.BatchNormalization(),
        layers.Activation("relu"),
        layers.Dropout(config.DROPOUT_RATE),
        layers.Dense(256),
        layers.BatchNormalization(),
        layers.Activation("relu"),
        layers.Dropout(config.DROPOUT_RATE * 0.6),
        layers.Dense(config.NUM_CLASSES, activation="softmax"),
    ])

    return model


def build_transfer_learning_model(config: Config) -> keras.Model:
    """
    Build a transfer learning model using MobileNetV2 as the base.
    Recommended for most document verification tasks — provides excellent
    accuracy even with limited data.
    
    Args:
        config: Configuration object.
    
    Returns:
        Compiled Keras model.
    """
    # Load pre-trained MobileNetV2 (without top classification layer)
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(config.IMG_HEIGHT, config.IMG_WIDTH, config.IMG_CHANNELS),
        include_top=False,
        weights="imagenet",
    )
    
    # Freeze the base model initially
    base_model.trainable = False

    # Build the full model
    inputs = layers.Input(shape=(config.IMG_HEIGHT, config.IMG_WIDTH, config.IMG_CHANNELS))
    
    # Preprocessing for MobileNetV2
    x = tf.keras.applications.mobilenet_v2.preprocess_input(inputs)
    
    # Base model
    x = base_model(x, training=False)
    
    # Classification head
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dense(256, activation="relu")(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(config.DROPOUT_RATE)(x)
    x = layers.Dense(128, activation="relu")(x)
    x = layers.Dropout(config.DROPOUT_RATE * 0.6)(x)
    outputs = layers.Dense(config.NUM_CLASSES, activation="softmax")(x)

    model = keras.Model(inputs, outputs, name="DocVerify_MobileNetV2")
    
    return model


def build_model(config: Config, use_transfer_learning: bool = True) -> keras.Model:
    """
    Build and compile the model.
    
    Args:
        config: Configuration object.
        use_transfer_learning: If True, uses MobileNetV2 transfer learning.
    
    Returns:
        Compiled Keras model.
    """
    if use_transfer_learning:
        print("[INFO] Building Transfer Learning model (MobileNetV2)...")
        model = build_transfer_learning_model(config)
    else:
        print("[INFO] Building Custom CNN model...")
        model = build_custom_cnn(config)
    
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=config.LEARNING_RATE),
        loss="categorical_crossentropy",
        metrics=[
            "accuracy",
            keras.metrics.Precision(name="precision"),
            keras.metrics.Recall(name="recall"),
        ],
    )
    
    model.summary()
    return model


# ============================================================================
# Training
# ============================================================================

def get_callbacks(config: Config) -> list:
    """
    Create training callbacks for monitoring and checkpointing.
    
    Returns:
        List of Keras callbacks.
    """
    os.makedirs(config.CHECKPOINT_PATH, exist_ok=True)
    os.makedirs(config.LOG_DIR, exist_ok=True)

    return [
        # Save best model
        callbacks.ModelCheckpoint(
            filepath=os.path.join(config.CHECKPOINT_PATH, "best_model.keras"),
            monitor="val_accuracy",
            save_best_only=True,
            mode="max",
            verbose=1,
        ),
        # Early stopping to prevent overfitting
        callbacks.EarlyStopping(
            monitor="val_loss",
            patience=10,
            restore_best_weights=True,
            verbose=1,
        ),
        # Reduce learning rate on plateau
        callbacks.ReduceLROnPlateau(
            monitor="val_loss",
            factor=0.5,
            patience=5,
            min_lr=1e-7,
            verbose=1,
        ),
        # TensorBoard logging
        callbacks.TensorBoard(
            log_dir=os.path.join(config.LOG_DIR, datetime.now().strftime("%Y%m%d-%H%M%S")),
            histogram_freq=1,
        ),
    ]


def train_model(model, train_data, val_data, config: Config):
    """
    Train the model with the given data.
    
    Args:
        model: Compiled Keras model.
        train_data: Training data generator or dataset.
        val_data: Validation data generator or dataset.
        config: Configuration object.
    
    Returns:
        Training history.
    """
    print(f"\n{'='*60}")
    print(f"Starting Training")
    print(f"{'='*60}")
    print(f"  Epochs          : {config.EPOCHS}")
    print(f"  Batch size      : {config.BATCH_SIZE}")
    print(f"  Learning rate   : {config.LEARNING_RATE}")
    print(f"  Classes         : {config.NUM_CLASSES}")
    print(f"{'='*60}\n")

    cb = get_callbacks(config)

    history = model.fit(
        train_data,
        validation_data=val_data,
        epochs=config.EPOCHS,
        callbacks=cb,
        verbose=1,
    )

    return history


def fine_tune_model(model, train_data, val_data, config: Config, fine_tune_at: int = 100):
    """
    Fine-tune the transfer learning model by unfreezing top layers of the base.
    Call this AFTER initial training.
    
    Args:
        model: Trained Keras model (transfer learning).
        train_data: Training data.
        val_data: Validation data.
        config: Configuration object.
        fine_tune_at: Layer index from which to start unfreezing.
    
    Returns:
        Fine-tuning history.
    """
    # Find the base model layer
    base_model = None
    for layer in model.layers:
        if isinstance(layer, keras.Model):
            base_model = layer
            break
    
    if base_model is None:
        print("[WARNING] No base model found for fine-tuning. Skipping.")
        return None

    # Unfreeze layers from `fine_tune_at` onwards
    base_model.trainable = True
    for layer in base_model.layers[:fine_tune_at]:
        layer.trainable = False
    
    # Recompile with lower learning rate
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=config.LEARNING_RATE / 10),
        loss="categorical_crossentropy",
        metrics=[
            "accuracy",
            keras.metrics.Precision(name="precision"),
            keras.metrics.Recall(name="recall"),
        ],
    )
    
    print(f"\n[INFO] Fine-tuning from layer {fine_tune_at}...")
    print(f"[INFO] Trainable layers: {len([l for l in base_model.layers if l.trainable])}")
    
    history = model.fit(
        train_data,
        validation_data=val_data,
        epochs=config.EPOCHS + 20,
        initial_epoch=config.EPOCHS,
        callbacks=get_callbacks(config),
        verbose=1,
    )
    
    return history


# ============================================================================
# Evaluation & Prediction
# ============================================================================

def evaluate_model(model, val_data, config: Config):
    """
    Evaluate the model on validation data and print metrics.
    
    Args:
        model: Trained Keras model.
        val_data: Validation data.
        config: Configuration object.
    """
    print(f"\n{'='*60}")
    print("Model Evaluation")
    print(f"{'='*60}")
    
    results = model.evaluate(val_data, verbose=1)
    metric_names = model.metrics_names
    
    for name, value in zip(metric_names, results):
        print(f"  {name:>15s}: {value:.4f}")
    
    # Calculate F1 Score
    if "precision" in metric_names and "recall" in metric_names:
        precision = results[metric_names.index("precision")]
        recall = results[metric_names.index("recall")]
        f1 = 2 * (precision * recall) / (precision + recall + 1e-7)
        print(f"  {'f1_score':>15s}: {f1:.4f}")
    
    print(f"{'='*60}\n")
    
    return dict(zip(metric_names, results))


def predict_document(model, image_path: str, config: Config):
    """
    Predict the class of a single document image.
    
    Args:
        model: Trained Keras model.
        image_path: Path to the document image.
        config: Configuration object.
    
    Returns:
        Dict with predicted class, confidence, and all probabilities.
    """
    # Load and preprocess the image
    img = tf.keras.utils.load_img(
        image_path,
        target_size=(config.IMG_HEIGHT, config.IMG_WIDTH),
    )
    img_array = tf.keras.utils.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0  # Normalize

    # Predict
    predictions = model.predict(img_array, verbose=0)
    predicted_class_idx = np.argmax(predictions[0])
    confidence = float(predictions[0][predicted_class_idx])
    predicted_class = config.CLASS_NAMES[predicted_class_idx]

    result = {
        "image_path": image_path,
        "predicted_class": predicted_class,
        "confidence": round(confidence, 4),
        "all_probabilities": {
            name: round(float(prob), 4)
            for name, prob in zip(config.CLASS_NAMES, predictions[0])
        },
        "is_verified": confidence >= 0.85,  # Threshold for verification
    }

    print(f"\n{'='*60}")
    print(f"Prediction Result")
    print(f"{'='*60}")
    print(f"  Image          : {image_path}")
    print(f"  Predicted class: {predicted_class}")
    print(f"  Confidence     : {confidence:.2%}")
    print(f"  Verified       : {'YES' if result['is_verified'] else 'NO'}")
    print(f"\n  All probabilities:")
    for cls, prob in result["all_probabilities"].items():
        bar = "#" * int(prob * 30)
        print(f"    {cls:>20s}: {prob:.2%} {bar}")
    print(f"{'='*60}\n")

    return result


# ============================================================================
# Save / Load Utilities
# ============================================================================

def save_model(model, config: Config):
    """Save the trained model and its configuration."""
    os.makedirs(config.MODEL_SAVE_PATH, exist_ok=True)
    
    # Save model
    model_path = os.path.join(config.MODEL_SAVE_PATH, "document_verification_model.keras")
    model.save(model_path)
    print(f"[INFO] Model saved to: {model_path}")
    
    # Save config
    config_data = {
        "img_height": config.IMG_HEIGHT,
        "img_width": config.IMG_WIDTH,
        "img_channels": config.IMG_CHANNELS,
        "num_classes": config.NUM_CLASSES,
        "class_names": config.CLASS_NAMES,
        "model_path": model_path,
        "saved_at": datetime.now().isoformat(),
    }
    config_path = os.path.join(config.MODEL_SAVE_PATH, "config.json")
    with open(config_path, "w") as f:
        json.dump(config_data, f, indent=2)
    print(f"[INFO] Config saved to: {config_path}")


def load_model(model_dir: str = "saved_model"):
    """Load a saved model and its configuration."""
    config_path = os.path.join(model_dir, "config.json")
    with open(config_path, "r") as f:
        config_data = json.load(f)
    
    config = Config()
    config.IMG_HEIGHT = config_data["img_height"]
    config.IMG_WIDTH = config_data["img_width"]
    config.IMG_CHANNELS = config_data["img_channels"]
    config.NUM_CLASSES = config_data["num_classes"]
    config.CLASS_NAMES = config_data["class_names"]
    
    model = keras.models.load_model(config_data["model_path"])
    print(f"[INFO] Model loaded from: {config_data['model_path']}")
    print(f"[INFO] Classes: {config.CLASS_NAMES}")
    
    return model, config


# ============================================================================
# Demo / Synthetic Data (for testing without a real dataset)
# ============================================================================

def create_demo_dataset(output_dir: str = "dataset", num_per_class: int = 50):
    """
    Create a synthetic demo dataset with realistic document-like images.
    Each class gets unique visual features (layout, colors, patterns) so
    the model can learn meaningful distinguishing characteristics.
    
    Args:
        output_dir: Directory to create the dataset in.
        num_per_class: Number of synthetic images per class.
    """
    from PIL import Image, ImageDraw
    
    class_configs = {
        "aadhaar_card": {
            "bg": (255, 255, 255), "header_color": (0, 70, 140),
            "accent": (200, 100, 0), "has_photo": True, "has_stamp": True,
            "aspect": (856, 540), "border_color": (0, 50, 120),
        },
        "pan_card": {
            "bg": (255, 255, 240), "header_color": (0, 0, 120),
            "accent": (180, 0, 0), "has_photo": True, "has_stamp": False,
            "aspect": (856, 540), "border_color": (0, 0, 100),
        },
        "passport": {
            "bg": (240, 245, 255), "header_color": (0, 50, 100),
            "accent": (0, 100, 60), "has_photo": True, "has_stamp": True,
            "aspect": (500, 700), "border_color": (0, 40, 80),
        },
        "voter_id": {
            "bg": (255, 255, 250), "header_color": (100, 0, 0),
            "accent": (0, 80, 0), "has_photo": True, "has_stamp": True,
            "aspect": (856, 540), "border_color": (80, 0, 0),
        },
        "student_id": {
            "bg": (245, 250, 255), "header_color": (30, 60, 120),
            "accent": (200, 50, 50), "has_photo": True, "has_stamp": False,
            "aspect": (540, 856), "border_color": (20, 40, 100),
        },
        "10th_marksheet": {
            "bg": (255, 255, 245), "header_color": (60, 20, 80),
            "accent": (0, 80, 120), "has_photo": False, "has_stamp": True,
            "aspect": (800, 1100), "border_color": (40, 10, 60),
        },
        "12th_marksheet": {
            "bg": (250, 255, 250), "header_color": (0, 80, 40),
            "accent": (120, 60, 0), "has_photo": False, "has_stamp": True,
            "aspect": (800, 1100), "border_color": (0, 60, 30),
        },
        "income_certificate": {
            "bg": (255, 252, 245), "header_color": (80, 40, 0),
            "accent": (0, 60, 100), "has_photo": False, "has_stamp": True,
            "aspect": (800, 1100), "border_color": (60, 30, 0),
        },
        "caste_certificate": {
            "bg": (250, 248, 255), "header_color": (60, 0, 80),
            "accent": (150, 0, 50), "has_photo": False, "has_stamp": True,
            "aspect": (800, 1100), "border_color": (50, 0, 70),
        },
    }
    
    print(f"[INFO] Creating realistic demo dataset in '{output_dir}'...")
    
    for cls, cfg in class_configs.items():
        class_dir = os.path.join(output_dir, cls)
        os.makedirs(class_dir, exist_ok=True)
        
        for i in range(num_per_class):
            w, h = cfg["aspect"]
            # Add slight random variation to dimensions
            w += np.random.randint(-20, 20)
            h += np.random.randint(-20, 20)
            
            # Background with slight noise
            bg = cfg["bg"]
            img_arr = np.full((h, w, 3), bg, dtype=np.uint8)
            noise = np.random.randint(-8, 8, (h, w, 3), dtype=np.int16)
            img_arr = np.clip(img_arr.astype(np.int16) + noise, 0, 255).astype(np.uint8)
            
            img = Image.fromarray(img_arr)
            draw = ImageDraw.Draw(img)
            
            # Border
            bw = np.random.randint(2, 5)
            draw.rectangle([bw, bw, w-bw, h-bw], outline=cfg["border_color"], width=bw)
            
            # Header bar
            header_h = int(h * np.random.uniform(0.08, 0.14))
            draw.rectangle([bw, bw, w-bw, header_h], fill=cfg["header_color"])
            
            # Title lines in header
            for tx in range(2):
                tw = int(np.random.uniform(0.2, 0.6) * w)
                tx_start = (w - tw) // 2
                ty = bw + 8 + tx * 18
                draw.rectangle([tx_start, ty, tx_start + tw, ty + 10], fill=(255, 255, 255))
            
            # Text lines (body)
            line_start = header_h + int(h * 0.05)
            line_spacing = int(h * np.random.uniform(0.03, 0.05))
            margin = int(w * 0.06)
            
            photo_area = None
            if cfg["has_photo"]:
                # Photo placeholder (right or left side)
                ph_w = int(w * np.random.uniform(0.18, 0.25))
                ph_h = int(h * np.random.uniform(0.25, 0.40))
                if np.random.random() > 0.5:
                    ph_x = w - margin - ph_w
                else:
                    ph_x = margin
                ph_y = line_start
                photo_area = (ph_x, ph_y, ph_x + ph_w, ph_y + ph_h)
                # Draw photo box
                draw.rectangle(photo_area, fill=(210, 210, 210), outline=(100, 100, 100), width=2)
                # Cross lines in photo
                draw.line([ph_x, ph_y, ph_x+ph_w, ph_y+ph_h], fill=(180, 180, 180), width=1)
                draw.line([ph_x+ph_w, ph_y, ph_x, ph_y+ph_h], fill=(180, 180, 180), width=1)
            
            # Draw text lines
            for y in range(line_start, int(h * 0.85), line_spacing):
                # Skip if in photo area
                if photo_area and photo_area[1] < y < photo_area[3]:
                    if photo_area[0] < w // 2:
                        x_start = photo_area[2] + 10
                    else:
                        x_start = margin
                        lw = photo_area[0] - margin - 10
                        if lw > 0:
                            draw.rectangle([x_start, y, x_start + lw, y + 6], 
                                         fill=(40 + np.random.randint(0, 30), 40, 40))
                        continue
                else:
                    x_start = margin
                
                # Variable width text lines
                lw = int(np.random.uniform(0.3, 0.85) * (w - 2*margin))
                if np.random.random() > 0.7:
                    # Label: Value format
                    label_w = int(lw * 0.3)
                    draw.rectangle([x_start, y, x_start + label_w, y + 6], 
                                 fill=(60, 60, 60))
                    draw.rectangle([x_start + label_w + 15, y, x_start + lw, y + 6], 
                                 fill=(30, 30, 30))
                else:
                    draw.rectangle([x_start, y, x_start + lw, y + 6], 
                                 fill=(40 + np.random.randint(0, 30), 40, 40))
            
            # Stamp/seal (circular)
            if cfg["has_stamp"]:
                stamp_r = int(min(w, h) * np.random.uniform(0.06, 0.10))
                sx = int(w * np.random.uniform(0.6, 0.85))
                sy = int(h * np.random.uniform(0.7, 0.88))
                stamp_color = tuple(c // 2 for c in cfg["accent"])
                for r in range(stamp_r, stamp_r - 3, -1):
                    draw.ellipse([sx-r, sy-r, sx+r, sy+r], outline=stamp_color, width=2)
            
            # Accent line at bottom
            accent_y = int(h * np.random.uniform(0.90, 0.95))
            draw.rectangle([margin, accent_y, w-margin, accent_y+3], fill=cfg["accent"])
            
            # Resize to model input size and save
            img = img.resize((224, 224), Image.LANCZOS)
            img.save(os.path.join(class_dir, f"{cls}_{i:04d}.jpg"), quality=92)
    
    total = len(class_configs) * num_per_class
    print(f"[INFO] Demo dataset created: {len(class_configs)} classes x {num_per_class} images")
    print(f"[INFO] Total images: {total}")
    return output_dir


# ============================================================================
# Main Entry Point
# ============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Document Verification Model — TensorFlow/Keras",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Create demo dataset and train
  python model.py --mode demo

  # Train on your own dataset
  python model.py --mode train --data_dir ./dataset

  # Evaluate a trained model
  python model.py --mode evaluate --data_dir ./dataset

  # Predict a single image
  python model.py --mode predict --image_path ./test.jpg

  # Use custom CNN instead of transfer learning
  python model.py --mode train --data_dir ./dataset --no-transfer-learning
        """,
    )
    
    parser.add_argument(
        "--mode",
        type=str,
        choices=["train", "evaluate", "predict", "demo"],
        default="demo",
        help="Mode to run: train, evaluate, predict, or demo",
    )
    parser.add_argument("--data_dir", type=str, default="dataset", help="Path to dataset directory")
    parser.add_argument("--image_path", type=str, help="Path to image for prediction")
    parser.add_argument("--model_dir", type=str, default="saved_model", help="Path to saved model")
    parser.add_argument("--epochs", type=int, default=50, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=32, help="Batch size")
    parser.add_argument("--lr", type=float, default=1e-4, help="Learning rate")
    parser.add_argument(
        "--no-transfer-learning",
        action="store_true",
        help="Use custom CNN instead of MobileNetV2 transfer learning",
    )
    parser.add_argument("--fine-tune", action="store_true", help="Fine-tune the base model after initial training")
    
    args = parser.parse_args()
    
    # Setup config
    config = Config()
    config.EPOCHS = args.epochs
    config.BATCH_SIZE = args.batch_size
    config.LEARNING_RATE = args.lr
    
    # Print GPU info
    print(f"\n{'='*60}")
    print(f"Document Verification Model")
    print(f"{'='*60}")
    print(f"  TensorFlow version : {tf.__version__}")
    gpus = tf.config.list_physical_devices("GPU")
    print(f"  GPUs available     : {len(gpus)}")
    if gpus:
        for gpu in gpus:
            print(f"    - {gpu.name}")
    else:
        print(f"  Running on         : CPU")
    print(f"  Mode               : {args.mode}")
    print(f"{'='*60}\n")
    
    # ---- DEMO MODE ----
    if args.mode == "demo":
        print("[DEMO] Creating synthetic dataset and training a demo model...\n")
        data_dir = create_demo_dataset(args.data_dir, num_per_class=100)
        
        train_gen, val_gen = create_data_generators(data_dir, config)
        model = build_model(config, use_transfer_learning=not args.no_transfer_learning)
        
        # Train for fewer epochs in demo
        config.EPOCHS = 10
        history = train_model(model, train_gen, val_gen, config)
        
        evaluate_model(model, val_gen, config)
        save_model(model, config)
        
        print("\n[DEMO] Done! Your model is saved in 'saved_model/'")
        print("[DEMO] To use with real data, organize your images in the dataset/ folder")
        print("[DEMO] and run: python model.py --mode train --data_dir ./dataset\n")
    
    # ---- TRAIN MODE ----
    elif args.mode == "train":
        if not os.path.exists(args.data_dir):
            print(f"[ERROR] Dataset directory not found: {args.data_dir}")
            print("[INFO]  Run 'python model.py --mode demo' to create a demo dataset first.")
            return
        
        train_gen, val_gen = create_data_generators(args.data_dir, config)
        model = build_model(config, use_transfer_learning=not args.no_transfer_learning)
        
        history = train_model(model, train_gen, val_gen, config)
        
        # Optional fine-tuning
        if args.fine_tune and not args.no_transfer_learning:
            fine_tune_model(model, train_gen, val_gen, config)
        
        evaluate_model(model, val_gen, config)
        save_model(model, config)
    
    # ---- EVALUATE MODE ----
    elif args.mode == "evaluate":
        model, config = load_model(args.model_dir)
        _, val_gen = create_data_generators(args.data_dir, config)
        evaluate_model(model, val_gen, config)
    
    # ---- PREDICT MODE ----
    elif args.mode == "predict":
        if not args.image_path:
            print("[ERROR] Please provide --image_path for prediction mode.")
            return
        if not os.path.exists(args.image_path):
            print(f"[ERROR] Image not found: {args.image_path}")
            return
        
        model, config = load_model(args.model_dir)
        result = predict_document(model, args.image_path, config)
        
        # Save prediction result
        result_path = "prediction_result.json"
        with open(result_path, "w") as f:
            json.dump(result, f, indent=2)
        print(f"[INFO] Result saved to: {result_path}")


if __name__ == "__main__":
    main()
