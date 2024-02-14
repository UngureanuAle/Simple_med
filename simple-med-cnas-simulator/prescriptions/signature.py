from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization, hashes, asymmetric
from cryptography.hazmat.primitives.asymmetric import rsa
import base64
import json

# Key generation functions
def generate_key_pair():
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=512,  # Adjust the key size as needed
        backend=default_backend()
    )
    public_key = private_key.public_key()
    return private_key, public_key

# Serialization functions
def serialize_public_key(key):
    return key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode('utf-8')

def serialize_private_key(private_key):
    return private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    ).decode('utf-8')

# Deserialization functions
def deserialize_private_key(serialized_key):
    return serialization.load_pem_private_key(
        serialized_key.encode('utf-8'),
        password=None,
        backend=default_backend()
    )

def deserialize_public_key(serialized_key):
    return serialization.load_pem_public_key(
        serialized_key.encode('utf-8'),
        backend=default_backend()
    )

# Signature functions
def sign_message(private_key, message):
    private_key = deserialize_private_key(private_key)
    signature = private_key.sign(
        message,
        asymmetric.padding.PSS(
            mgf=asymmetric.padding.MGF1(hashes.SHA256()),
            salt_length=asymmetric.padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256()
    )
    return signature

def verify_signature(public_key, message, signature):
    public_key = deserialize_public_key(public_key)
    try:
        public_key.verify(
            signature,
            message,
            asymmetric.padding.PSS(
                mgf=asymmetric.padding.MGF1(hashes.SHA256()),
                salt_length=asymmetric.padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )
        print("Signature is valid.")
        return True
    except Exception as e:
        print(f"Signature verification failed: {e}")
        return False

# Main script
def create_and_store_keys_to_json(filename="keys.json"):
    # Generate key pair
    private_key, public_key = generate_key_pair()

    # Serialize keys
    serialized_private_key = serialize_private_key(private_key)
    serialized_public_key = serialize_public_key(public_key)

    # Store keys in a dictionary
    key_pair_dict = {
        "private_key": serialized_private_key,
        "public_key": serialized_public_key,
    }

    # Write keys to JSON file
    with open(filename, 'w') as json_file:
        json.dump(key_pair_dict, json_file, indent=4)

    print(f"Key Pair stored in {filename}")

    return (serialized_private_key, serialized_public_key)
