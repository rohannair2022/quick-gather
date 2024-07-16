import requests

def create_user():
    body = {
        'username': 'test1',
        'email': 'test1@test.com',
        'password': '1234567',
    };
    response = requests.post('http://localhost:5000/auth/signup', json=body, headers= {
          "content-type": "application/json",
        },)
    return response.json()

create_user()