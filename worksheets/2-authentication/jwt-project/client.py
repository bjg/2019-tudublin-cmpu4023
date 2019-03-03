# Using Python 3
import hmac
import hashlib
import base64
import datetime
import json
import requests


while True:
    print('Welcome to the Client for this Lab.')
    print('------------------------------------------------')
    print('Please select from one of the following options:')
    print('1. Send a POST HMAC request with a body.')
    print('2. Send a GET HMAC request without a body')
    print('------------------------------------------------')
    answer = input('Enter your choice: ')
    
    if answer == '1':
        # Get the user information
        username = input('Please enter your username: ')
        password = input('Please enter your password: ')

        # Get the access key and shared secret
        access_key = input('Please enter your access key: ')
        shared_secret_key = 'helloworld'

        # Get todays date
        now = datetime.datetime.now().date()

        # Construct a body to be hashed
        message = username+password+access_key+str(now)

        # Generate a hmac
        h = hmac.new(bytes(shared_secret_key, 'latin-1'), message.encode('utf-8'), hashlib.sha256)
        print('')
        print('Message: '+str(json.dumps(message).encode('utf-8')))
        print('Signature: '+h.hexdigest())
        print('')
        print('Sending HMAC request...')

        # Send the request
        headers = {
            'Signature': h.hexdigest(),
            'Access-Key': access_key
        }

        response = requests.post('http://localhost:3000/login/hmac', headers=headers, data={'username': username, 'password': password})

        # Print the response
        print(response)
        print(response.text)
        print('')
    
    elif answer == '2':
        # Get the access key and shared secret
        access_key = input('Please enter your access key: ')
        shared_secret_key = 'helloworld'

         # Get todays date
        now = datetime.datetime.now().date()

        # Construct a body to be hashed
        message = access_key+str(now)

        # Generate a hmac
        h = hmac.new(bytes(shared_secret_key, 'latin-1'), message.encode('utf-8'), hashlib.sha256)
        print('')
        print('Message: '+str(json.dumps(message).encode('utf-8')))
        print('Signature: '+h.hexdigest())
        print('')
        print('Sending HMAC request...')

        # Send the request
        headers = {
            'Signature': h.hexdigest(),
            'Access-Key': access_key
        }

        response = requests.get('http://localhost:3000/products/hmac', headers=headers)

        # Print the response
        print(response)
        print(response.text)
        print('')