import requests

SIUI_BASE_URL = 'http://127.0.0.1:8080'

def validate_online_prescription(prescription_data):
    url = '{}/presciptions/validate-online'.format(SIUI_BASE_URL)

    response = requests.post(url, json=prescription_data)

    if response.status_code == 200:
        return {
            'errors': response.json(),
        }

    return {
        'errors': [
            'Eroare la serverul SIUI'
        ]
    }


def validate_offline_prescription(prescription_data):
    url = '{}/presciptions/validate-offline'.format(SIUI_BASE_URL)

    response = requests.post(url, json=prescription_data)

    if response.status_code == 200:
        return {
            'errors': response.json(),
        }

    return {
        'errors': [
            'Eroare la serverul SIUI'
        ]
    }
