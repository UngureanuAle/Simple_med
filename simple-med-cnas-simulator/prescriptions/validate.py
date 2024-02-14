
import json

with open('./prescriptions/validator.json', 'r') as file:
    VALIDATOR = json.load(file)

def validate_given_med(given_med):
    drug_code = given_med['drug_code']
    product_code = given_med['cod']
    print(drug_code, product_code)

    if product_code not in VALIDATOR[drug_code]:
        return False
    else:
        return True