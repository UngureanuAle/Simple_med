import cv2
import base64
from pyzbar.pyzbar import decode
import gzip
import numpy

def decompress(content):
    return gzip.decompress(content)

def decode_qr(memory_file):
    img = cv2.imdecode(numpy.fromstring(memory_file.read(), numpy.uint8), cv2.IMREAD_UNCHANGED)
    barcodes = decode(img)
    scanned_data = barcodes[0].data.decode('utf-8')
    decoded_bytes = base64.b64decode(scanned_data)
    return decompress(decoded_bytes).decode('utf-8')


    
