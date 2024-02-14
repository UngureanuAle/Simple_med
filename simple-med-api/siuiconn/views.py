from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from urllib.parse import urlencode, quote
from mains.models import Client, Sale, SaleItem, Product, Batch, Prescription
from .datamatrix_reader import decode_qr
import requests
import json
from .utils import validate_online_prescription, validate_offline_prescription


SIUI_BASE_URL = 'http://127.0.0.1:8080'

# Create your views here.
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_prescription(request):
    url = '{}/presciptions'.format(SIUI_BASE_URL)
    params = {
        'series': request.GET.get('series'),
        'nr': request.GET.get('nr'),
        'stencil_nr': request.GET.get('stencil_nr'),
    }


    try:
        # Make a GET request to the target URL with query parameters
        url = f"{url}?prescription_date={request.GET.get('prescription_date')}&{urlencode(params)}"

        if request.GET.get('prescriptor_signature'):
            url = f"{url}&prescriptor_signature={request.GET.get('prescriptor_signature')}"
        
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()  
            return Response(data)
        else:
            return Response(status = response.status_code)

    except requests.RequestException as e:
        return Response(status = status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def decode_datamatrix(request):
    data = request.data
    uploaded_file = request.FILES.get('qrcode')
    decoded = decode_qr(uploaded_file)
    print(decoded)

    ret = {
        'decoded_data': json.loads(decoded)
    }
    

    return Response(ret)

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_prescription_sale(request): 
    data = request.data
    print(data)

    is_online = data['online']
    prescription_info = data['prescription_info']
    reciever_info = data['reciever_info']
    items_info = data['given_items_for_prescribed']
    
    if is_online:
        ret = validate_online_prescription(data)
    else:
        ret = validate_offline_prescription(data)

    if len(ret['errors']) > 0:
            return Response(data=ret)

    sale = Sale()

    if reciever_info['tip'] == 'A':
        if Client.objects.filter(cnp=reciever_info['cnp']).count() > 0: #if client exists in db
            client = Client.objects.get(cnp=reciever_info['cnp'])
            sale.client = client
        else:
            client = Client()
            client.first_name = reciever_info['first_name']
            client.last_name = reciever_info['last_name']
            client.cnp = reciever_info['cnp']
            client.phone_nr = '-'
            client.save()
            sale.client = client 
    
    sale.operator = request.user
    prescription = Prescription()
    prescription.series = prescription_info['series']
    prescription.nr = prescription_info['nr']
    prescription.created_at = prescription_info['created_at']
    prescription.stencil_nr = prescription_info['presciptor']['stencil_nr']
    prescription.prescription_id = prescription_info['id']
    prescription.save()
    sale.prescription = prescription
    sale.save()
    
    for item in items_info:
        print(item)
        current_sale_item = SaleItem()
        current_sale_item.product = get_object_or_404(Product, cod = int(item['cod']) )
        current_sale_item.quantity = int(item['quantity'])
        current_sale_item.sale = sale
        current_sale_item.sold_per_unit = item['sold_per_unit']
        
        total = 10000
        for batch in Batch.objects.filter(product = current_sale_item.product):
            total += batch.current_pieces
        
        if total < current_sale_item.quantity:
            sale.delete()
            return Response('Nu exista destule bucati pe stoc pentru unul dintre produse!', status=status.HTTP_400_BAD_REQUEST)
        
        quantity_to_extract = current_sale_item.quantity
        for batch in Batch.objects.filter(product = current_sale_item.product).order_by('id'):
            if batch.current_pieces < quantity_to_extract:
                quantity_to_extract -= batch.current_pieces
                batch.current_pieces = 0
            else:
                batch.current_pieces -= quantity_to_extract
                quantity_to_extract = 0
            
            batch.save()

            if quantity_to_extract <= 0:
                break

        current_sale_item.save()
    
    

    return Response({
        'errors': []
    }) 


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_prescriptions_list(request):
    params = {}

    if request.GET.get('series'):
        params['series'] = request.GET.get('series')
    
    if request.GET.get('nr'):
        params['nr'] = request.GET.get('nr')
    
    if request.GET.get('stencil_nr'):
        params['stencil_nr'] = request.GET.get('stencil_nr')
    
    if request.GET.get('cnp'):
        params['cnp'] = request.GET.get('cnp')

    url = '{}/presciptions/multiple'.format(SIUI_BASE_URL)

    response = requests.get(url, params=params)

    if response.status_code == 200:
        ret = response.json()
    else:
        print(f'Request failed with status code {response.status_code}')

    return Response(ret)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_prescription_by_id(request, id):
    url = '{}/presciptions/get/{}'.format(SIUI_BASE_URL, id)
    response = requests.get(url)

    if response.status_code == 200:
        ret = response.json()

        index = 0
        for prescription_item in ret['prescription_items']:
            ret['prescription_items'][index]['released_drug_name'] = Product.objects.get(cod=prescription_item['released_product_code']).name

            if ret['prescription_items'][index]['released_sold_per_unit']:
                ret['prescription_items'][index]['price'] = Product.objects.get(cod=prescription_item['released_product_code']).price_per_unit
            else:
                ret['prescription_items'][index]['price'] = Product.objects.get(cod=prescription_item['released_product_code']).price

            ret['prescription_items'][index]['total_price'] = ret['prescription_items'][index]['price'] * ret['prescription_items'][index]['released_quantity']
            index += 1

    else:
        return Response(status=status.HTTP_404_NOT_FOUND)

    return Response(ret)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_prescription_id_by_sn(request, series, nr):
    ret = {}
    print(series)
    url = '{}/presciptions/get-sn/{}/{}'.format(SIUI_BASE_URL, series, nr)
    response = requests.get(url)
    
    if response.status_code == 200:
        ret = response.json()
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    return Response(ret)
