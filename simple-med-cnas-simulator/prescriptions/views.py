from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from urllib.parse import unquote
from .models import Reciever
import datetime
import json
from .serializers import *
from .signature import *
from .validate import validate_given_med


SIGNATURE_MESSAGE = 'SIMPLEMED'.encode('utf-8')


def find_first_difference_index(str1, str2):
    min_len = min(len(str1), len(str2))

    for i in range(min_len):
        if str1[i] != str2[i]:
            return i

    # If all common characters are the same, return the length of the shorter string
    return min_len

# Create your views here.
@api_view(['GET'])
def get_prescription(request):
    if request.GET.get('series') and request.GET.get('nr') and request.GET.get('stencil_nr') and request.GET.get('prescription_date'):
        series = request.GET.get('series')
        nr = request.GET.get('nr')
        stencil_nr = request.GET.get('stencil_nr')
        prescription_date = datetime.datetime.strptime(request.GET.get('prescription_date'), '%d/%m/%Y').date()
        prescriptor_signature = request.GET.get('prescriptor_signature')

        presciption = Prescription.objects.filter(series=series, nr=nr, presciptor__stencil_nr=stencil_nr)
        print(presciption)
        
        #verify authenticity
        prescriptor = Medic.objects.filter(stencil_nr=stencil_nr)
        if prescriptor.count() > 0:
            prescriptor = prescriptor.first()
            prescriptor_public_key = prescriptor.public_key.replace('\\n', '\n')            
            if not verify_signature(prescriptor_public_key, SIGNATURE_MESSAGE, base64.b64decode(prescriptor_signature.encode('utf-8')) ):
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


        #verify if prescription is online or offline
        if presciption.count() > 0:
            presciption = presciption.first()

            serializer = PrescriptionSerializer(presciption)
            return Response(data={
                'online': True,
                'prescription': serializer.data
            })
        else:
            return Response(data={
                'online': False
            })
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


def get_drug_name(input_code):
    for code, value in PrescriptionItem.DRUG_CODE_CHOICES:
        if code == input_code:
            return value
            break
        

@api_view(['POST'])
def validate_online_prescription(request):
    data = request.data
    errors = []

    prescription = Prescription.objects.get(series=data['prescription_info']['series'], nr=data['prescription_info']['nr'])
    
    given_meds = data['given_items_for_prescribed']

    for given_med in given_meds:
        if not validate_given_med(given_med):
            errors.append('Produsul {} NU este compatibil cu medicamentul prescris la nr. {} al retetei ({})'.format(given_med['name'], given_med['nr'], get_drug_name(given_med['drug_code'])))

    if(len(errors) > 0):
        return Response(errors)
    
    for given_med in given_meds:
        prescription_item = PrescriptionItem.objects.get(prescription=prescription, nr=given_med['nr'])
        prescription_item.is_released = True
        prescription_item.released_product_code = given_med['cod']
        prescription_item.released_sold_per_unit = given_med['sold_per_unit']
        prescription_item.released_quantity = int(given_med['quantity'])

        prescription_item.save()

    prescription.state = 2
    if data['reciever_info']['tip'] == 'I':
        reciever = Reciever()
        reciever.first_name = data['reciever_info']['first_name']
        reciever.last_name = data['reciever_info']['last_name']
        reciever.cnp = data['reciever_info']['cnp']
        reciever.save()
        prescription.reciever = reciever

    prescription.save()
    
    return Response(errors)


@api_view(['POST'])
def validate_ofline_prescription(request):
    data = request.data
    errors = []

    given_meds = data['given_items_for_prescribed']

    for given_med in given_meds:
        if not validate_given_med(given_med):
            errors.append('Produsul {} NU este compatibil cu medicamentul prescris la nr. {} al retetei ({})'.format(given_med['name'], given_med['nr'], get_drug_name(given_med['drug_code'])))

    if(len(errors) > 0):
        return Response(errors)
    
    prescription = Prescription()
    prescription.series = data['prescription_info']['series']
    prescription.nr = data['prescription_info']['nr']
    prescription.created_at = data['prescription_info']['created_at']
    prescription.source = data['prescription_info']['source']
    prescription.state = data['prescription_info']['state']
    prescription.patient_signature = data['prescription_info']['patient_signature']
    prescription.prescriptor_signature = data['prescription_info']['prescriptor_signature']
    prescription.treatment_days = data['prescription_info']['treatment_days']

    medic = Medic.objects.filter(stencil_nr=data['prescription_info']['presciptor']['stencil_nr'])
    if medic.count() > 0:
        medic = medic.first()
    else:
        medic = Medic()
        medic.stencil_nr = data['prescription_info']['presciptor']['stencil_nr']
        medic.name = data['prescription_info']['presciptor']['name']
        medic.medical_facility = data['prescription_info']['presciptor']['medical_facility']
        medic.adress = data['prescription_info']['presciptor']['adress']
        medic.cui = data['prescription_info']['presciptor']['cui']
        medic.phone_nr = data['prescription_info']['presciptor']['phone_nr']
        medic.email = data['prescription_info']['presciptor']['email']
        medic.insurance_house = data['prescription_info']['presciptor']['insurance_house']
        medic.insurance_house_code = data['prescription_info']['presciptor']['insurance_house_code']
        medic.public_key = data['prescription_info']['presciptor']['public_key']
        medic.save()
    
    prescription.presciptor = medic

    patient = Patient.objects.filter(cnp=data['prescription_info']['patient']['cnp'])
    if patient.count() > 0:
        patient = patient.first()
    else:
        patient = Patient()
        patient.first_name = data['prescription_info']['patient']['first_name']
        patient.last_name = data['prescription_info']['patient']['last_name']
        patient.patient_type = data['prescription_info']['patient']['patient_type']
        patient.sex = data['prescription_info']['patient']['sex']
        patient.card_nr = data['prescription_info']['patient']['card_nr']
        patient.cnp = data['prescription_info']['patient']['cnp']
        patient.cid = data['prescription_info']['patient']['cid']
        patient.birth_date = data['prescription_info']['patient']['birth_date']
        patient.nationality = data['prescription_info']['patient']['nationality']
        patient.insurance_house_code = data['prescription_info']['patient']['insurance_house_code']
        patient.save()

    prescription.patient = patient

    if data['reciever_info']['tip'] == 'I':
        reciever = Reciever.objects.filter(cnp=data['reciever_info']['cnp'])
        if reciever.count() > 0:
            reciever = reciever.first()
        else:
            reciever = Reciever()
            reciever.first_name = data['reciever_info']['first_name']
            reciever.last_name = data['reciever_info']['last_name']
            reciever.cnp = data['reciever_info']['cnp']
            reciever.save()

        prescription.reciever = reciever

    prescription.state = 2
    prescription.save()

    for prescription_item in data['prescription_info']['prescription_items']:
        print(prescription_item)
        new_prescription_item = PrescriptionItem()
        new_prescription_item.prescription = prescription
        new_prescription_item.nr = prescription_item['nr']
        new_prescription_item.drug_code = prescription_item['drug_code']
        new_prescription_item.pharmaceutical_form = prescription_item['pharmaceutical_form']
        new_prescription_item.concentration = prescription_item['concentration']
        new_prescription_item.disease_code = prescription_item['disease_code']
        new_prescription_item.diagnostic_type = prescription_item['diagnostic_type']
        new_prescription_item.quantity = prescription_item['quantity']
        new_prescription_item.dose = prescription_item['dose']
        new_prescription_item.copayment_list_type = prescription_item['copayment_list_type']
        new_prescription_item.copayment_list_percent = prescription_item['copayment_list_percent']
        new_prescription_item.is_released = False
        new_prescription_item.save()


    given_meds = data['given_items_for_prescribed']
    for given_med in given_meds:
        prescription_item = PrescriptionItem.objects.get(prescription=prescription, nr=given_med['nr'])
        prescription_item.is_released = True
        prescription_item.released_product_code = given_med['cod']
        prescription_item.released_sold_per_unit = given_med['sold_per_unit']
        prescription_item.released_quantity = int(given_med['quantity'])


        prescription_item.save()

    return Response(errors)

@api_view(['GET'])
def get_prescriptions_list(request):
    print(request.GET)

    prescriptions = Prescription.objects.all()
    
    if request.GET.get('series'):
        prescriptions = prescriptions.filter(series__contains=request.GET.get('series'))

    if request.GET.get('nr'):
        prescriptions = prescriptions.filter(nr__contains=request.GET.get('nr'))

    if request.GET.get('stencil_nr'):
        prescriptions = prescriptions.filter(presciptor__stencil_nr__contains=request.GET.get('stencil_nr'))

    if request.GET.get('cnp'):
        prescriptions = prescriptions.filter(patient__cnp__contains=request.GET.get('cnp'))

    prescriptions = prescriptions.filter(state=2)
    prescriptions.order_by('-id')

    ret = []
    for prescription in prescriptions:
        curr = {
            'id': prescription.id,
            'series': prescription.series,
            'nr': prescription.nr,
            'stencil_nr': prescription.presciptor.stencil_nr,
            'cnp': None
        }

        if prescription.patient:
            curr['cnp'] = prescription.patient.cnp
        ret.append(curr)
    #serializer = PrescriptionSerializer(prescriptions, many=True)

    return Response(ret)

@api_view(['GET'])
def get_prescription_by_id(request, id):
    prescription =get_object_or_404(Prescription, id=id)

    serializer = PrescriptionSerializer(prescription)

    return Response(serializer.data)

@api_view(['GET'])
def get_prescription_id_by_sn(request, series, nr):
    prescription = get_object_or_404(Prescription, series=series, nr=nr)
    
    return Response({
        'prescription_id': prescription.id
    })