from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import sys
from pathlib import Path

# Add parent directory to path to import deepseek_tokenizer
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.deepseek_tokenizer import DeepSeekTokenizer

app = FastAPI(title="DeepSeek V3 Tokenizer API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

tokenizer = DeepSeekTokenizer()

class TextRequest(BaseModel):
    text: str

class TokenResponse(BaseModel):
    token_count: int
    char_count: int

class DirectoryRequest(BaseModel):
    path: str
    pattern: str = "*.py"
    recursive: bool = True

class FileStat(BaseModel):
    path: str
    name: str
    tokens: int
    chars: int
    size_kb: float

class DirectoryResponse(BaseModel):
    files: List[FileStat]
    total_files: int
    total_tokens: int
    total_chars: int
    total_size_kb: float

@app.get("/")
async def root():
    return {"message": "DeepSeek V3 Tokenizer API is running"}

@app.post("/tokenize/text", response_model=TokenResponse)
async def tokenize_text(request: TextRequest):
    try:
        count = tokenizer.count_tokens(request.text)
        return {
            "token_count": count,
            "char_count": len(request.text)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tokenize/directory", response_model=DirectoryResponse)
async def tokenize_directory(request: DirectoryRequest):
    try:
        directory = Path(request.path)
        if not directory.exists() or not directory.is_dir():
            raise HTTPException(status_code=404, detail="Directory not found")

        if request.recursive:
            files = list(directory.rglob(request.pattern))
        else:
            files = list(directory.glob(request.pattern))

        results = []
        total_tokens = 0
        total_chars = 0

        for file_path in files:
            try:
                # Skip if it's not a file
                if not file_path.is_file():
                    continue
                    
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()

                token_count = tokenizer.count_tokens(content)
                char_count = len(content)
                size_kb = file_path.stat().st_size / 1024

                results.append({
                    'path': str(file_path),
                    'name': file_path.name,
                    'tokens': token_count,
                    'chars': char_count,
                    'size_kb': size_kb
                })

                total_tokens += token_count
                total_chars += char_count
            except Exception as e:
                print(f"Error processing {file_path}: {e}")
                continue

        return {
            "files": results,
            "total_files": len(results),
            "total_tokens": total_tokens,
            "total_chars": total_chars,
            "total_size_kb": total_chars / 1024 # Approximation based on chars, or sum size_kb
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/system/info")
async def system_info():
    return {
        "version": "1.0.0",
        "status": "online"
    }
