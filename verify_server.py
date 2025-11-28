import requests
import json

BASE_URL = "http://localhost:8000"

def test_root():
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Root endpoint: {response.status_code}")
        print(response.json())
    except Exception as e:
        print(f"Root endpoint failed: {e}")

def test_tokenize_text():
    try:
        response = requests.post(f"{BASE_URL}/tokenize/text", json={"text": "Hello World"})
        print(f"Tokenize text: {response.status_code}")
        print(response.json())
    except Exception as e:
        print(f"Tokenize text failed: {e}")

def test_tokenize_directory():
    try:
        response = requests.post(f"{BASE_URL}/tokenize/directory", json={"path": "./examples", "recursive": True})
        print(f"Tokenize directory: {response.status_code}")
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Tokenize directory failed: {e}")

if __name__ == "__main__":
    test_root()
    test_tokenize_text()
    test_tokenize_directory()
