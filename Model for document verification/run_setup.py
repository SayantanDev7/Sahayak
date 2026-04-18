import os
import sys

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from model import create_demo_dataset

if __name__ == "__main__":
    print("Generating synthetic dataset...")
    # Generate 50 images per class for a quick training set
    create_demo_dataset(output_dir="dataset", num_per_class=50)
    print("Dataset generation complete.")
