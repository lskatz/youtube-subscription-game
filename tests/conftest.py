import sys
import os

# Allow imports from src/ without installing as a package
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))
