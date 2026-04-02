"""
Test login via API
"""
import requests
import json

url = "http://localhost:8000/api/auth/login"
headers = {
    "Content-Type": "application/json"
}

# Test data
login_data = {
    "email": "admin@qazmind.kz",
    "password": "606007"
}

print(f"Sending request to {url}")
print(f"Data: {json.dumps(login_data, indent=2)}")
print()

try:
    response = requests.post(url, json=login_data, headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("\n✓ LOGIN SUCCESSFUL!")
    else:
        print("\n✗ LOGIN FAILED!")
        
except Exception as e:
    print(f"✗ Error: {str(e)}")
