import pyqrcode
import cv2
import gzip
from pyzbar.pyzbar import decode
import io, base64

def compress(content):
    return gzip.compress(content)

def decompress(content):
    return gzip.decompress(content)

def encode_to_qr(content):
    url = pyqrcode.create(content)
    url.png('datamatrix_barcode.png', scale=4)

def decode_qr(path='datamatrix_barcode.png'):
    img = cv2.imread(path)
    barcodes = decode(img)
    scanned_data = barcodes[0].data.decode('utf-8')
    decoded_bytes = base64.b64decode(scanned_data)
    print(decompress(decoded_bytes).decode('utf-8'))


content = bytes('''{
    "prescriptor_signature": "bwAAq90fSbs611VRwrw0unKb6ID25Kp6JQPqphdeGr33iHrz/nR8YcICkogFwXWN3UdO8x20g61BzHtdKfwARg==",
    "prescription": {
        "id": 2,
        "presciptor": {
            "id": 1,
            "name": "Videa Maria",
            "stencil_nr": "982263",
            "medical_facility": "Cabinet Medicina de Familie Dr. Videa",
            "adress": "Timisoara, str.Aida nr.72",
            "cui": "6859662",
            "phone_nr": "0778988756",
            "email": "videa.maria@gmail.com",
            "insurance_house": "CJAS Timis",
            "insurance_house_code": "10052001",
            "public_key": "-----BEGIN PUBLIC KEY-----\\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMoBRTelYsoKvt/jyzLz18pLG5JzwCuG\\noo1GPVm8W04QKZokrcr9toqntwpitPcDZqg5em3TOBcNobZeOqhp31kCAwEAAQ==\\n-----END PUBLIC KEY-----\\n"
        },
        "patient": {
            "id": 1,
            "first_name": "Marian",
            "last_name": "Radute",
            "patient_type": "000000100000000000",
            "card_nr": "1005678",
            "cnp": "123445669182",
            "cid": "5677745",
            "birth_date": "1988-11-07",
            "nationality": "RO",
            "insurance_house_code": null
        },
        "prescription_items": [
            {
                "id": 3,
                "nr": 1,
                "drug_code": "N05CF02",
                "concentration": "10 mg",
                "pharmaceutical_form": "COMPR.",
                "disease_code": "321",
                "diagnostic_type": "Act.",
                "quantity": 60.0,
                "dose": "1-0-1/zi",
                "copayment_list_type": "G15",
                "copayment_list_percent": 100,
                "prescription": 2
            },
            {
                "id": 4,
                "nr": 2,
                "drug_code": "N06AB03",
                "concentration": "20 mg",
                "pharmaceutical_form": "CAPS.",
                "disease_code": "321",
                "diagnostic_type": "Act.",
                "quantity": 60.0,
                "dose": "1-0-1/zi",
                "copayment_list_type": "G15",
                "copayment_list_percent": 100,
                "prescription": 2
            }
        ],
        "source": 0,
        "series": "AASTDD",
        "nr": "028999",
        "created_at": "2023-12-23",
        "provider_contract_nr": null,
        "insurance_house_code": null,
        "state": 1,
        "patient_signature": "a",
        "prescriptor_signature": "a",
        "treatment_days": 29
    }
}''', 'utf-8')

base64_compressed = base64.b64encode(compress(content)).decode('utf-8')
print(base64_compressed)
encode_to_qr(base64_compressed)
decode_qr()

#decode_barcode('datamatrix_barcode.png')
#print(f"DataMatrix barcode with compressed text saved to")
#print(decode_barcode('dmtx.png'))
