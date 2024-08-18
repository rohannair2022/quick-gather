import requests

def create_user():
    body = {
        'username': 'rohannair2',
        'email': 'nairrohan151@gmail.com',
        'password': '1234567',
    };
    response = requests.post('http://localhost:5000/auth/signup', json=body, headers= {
          "content-type": "application/json",
        },)
    return response.json()

create_user()