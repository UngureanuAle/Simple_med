from prescriptions.signature import *
import base64

create_and_store_keys_to_json()

with open('keys.json', 'r') as file:
    data = json.load(file)

#print(data)
private_key = data['private_key']
public_key = data['public_key']


signature = sign_message(private_key, 'SIMPLEMED'.encode('utf-8'))
signature_str = base64.b64encode(signature).decode('utf-8')
print(signature_str)

verify_signature(public_key, 'SIMPLEMED'.encode('utf-8'), base64.b64decode(signature_str.encode('utf-8')))