import os
import sys

# Ensure backend package root is importable so `scripts.*` seed modules can be imported by tests.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
