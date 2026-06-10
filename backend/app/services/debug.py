# Save this as debug.py inside backend/app/services/
from pathlib import Path
import os
from dotenv import load_dotenv

print("Current file:", __file__)
print("Looking for .env at:", Path(__file__).parent.parent.parent / ".env")
print(".env exists:", (Path(__file__).parent.parent.parent / ".env").exists())

load_dotenv(Path(__file__).parent.parent.parent / ".env")
print("GROQ_API_KEY:", os.getenv("GROQ_API_KEY"))