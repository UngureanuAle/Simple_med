from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Product, Batch, Client, Sale, SaleItem, Configs
import datetime
import json
from .serializers import ProductSerializer, ClientSerializer, ConfigSerializer
from django.contrib.auth.models import User
from .utils import dateExistsInDictArr

# Create your views here.
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_products(request):
    products = Product.objects.all()

    print(request.GET)
    if request.GET.get('name'):
        products = products.filter(name__contains=request.GET.get('name'))
    
    if request.GET.get('cod'):
        products = products.filter(cod__contains=request.GET.get('cod'))

    if request.GET.get('med_type'):
        products = products.filter(med_type=request.GET.get('med_type'))

    if request.GET.get('adm_type'):
        products = products.filter(adm_type=request.GET.get('adm_type'))

    if request.GET.get('manufacturer'):
        products = products.filter(manufacturer__contains=request.GET.get('manufacturer'))

    if request.GET.get('is_prescribed'):
        toBool = {"true": True, "false": False}
        formated_is_prescribed = toBool[request.GET.get('is_prescribed')]
        print(formated_is_prescribed)
        products = products.filter(is_prescribed=formated_is_prescribed)

    serializer = ProductSerializer(products, many=True)
    return Response( serializer.data )


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_product(request, product_id):
    product = get_object_or_404( Product, id=product_id )
    serializer = ProductSerializer( product )
    return Response( serializer.data )

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_product_by_cod(request, cod):
    product = get_object_or_404( Product, cod=cod )
    serializer = ProductSerializer( product )
    return Response( serializer.data )


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_product(request): 
    #print("Request Headers:", request.headers)
    #print("Request Data:", request.data)
    #print("Request Files:", request.FILES)
    data = request.data
    print(data)

    serializer = ProductSerializer(data=data)
    print(data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        if serializer.errors['cod'][0] == 'product with this cod already exists.':
            return Response('Exista deja un produs cu acest cod!', status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response('Datele introduse nu sunt valide!', status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_product(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    product.delete()
    return Response('Produs sters cu succes.')


@api_view(['PUT'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_product(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    data = request.data
    print(data)
    serializer = ProductSerializer(product, data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    print(serializer.errors)
    if serializer.errors['cod'][0] == 'product with this cod already exists.':
        return Response('Exista deja un produs cu acest cod!', status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response('Datele introduse nu sunt valide!', status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_batches(request):
    products = Product.objects.all()
    if request.GET.get('name'):
        products = products.filter(name__contains=request.GET.get('name'))
    
    if request.GET.get('cod'):
        products = products.filter(cod__contains=request.GET.get('cod'))

    ret = []
    for product in products:
        current = {
            'product': {
                'id': product.id,
                'cod': product.cod,
                'name': product.name
            },
            'batches': [],
            'opened_box': False,
            'left_in_box': '-'
        }

        total_initial = 0
        total_current = 0
        batches = Batch.objects.filter(product=product).order_by('id')

        for batch in batches:
            cur_batch = {
                'id': batch.id,
                'batch_nr': batch.batch_nr,
                'created_on': batch.created_on,
                'initial_pieces': batch.initial_pieces,
                'current_pieces': batch.current_pieces,
                'provider': batch.provider,
                'paid_price_per_unit': batch.paid_price_per_unit
            }
            current['batches'].append(cur_batch)
            total_initial += batch.initial_pieces
            

        current['total_initial'] = total_initial
        total_current = current['total_initial'] 

        units_per_box_init = product.units_per_box
        opened_box = False
        for sale_item in SaleItem.objects.filter(product = product).order_by('id'):
            if not sale_item.sold_per_unit:
                total_current -= sale_item.quantity
            else:
                if sale_item.quantity < units_per_box_init:
                    if not opened_box:
                        opened_box = True
                        total_current -= 1

                    units_per_box_init -= sale_item.quantity

                elif sale_item.quantity == units_per_box_init:
                    units_per_box_init = product.units_per_box
                    if not opened_box:
                        total_current -= 1
                    else:
                        opened_box = False
                    
                    units_per_box_init = product.units_per_box

                elif sale_item.quantity > units_per_box_init:
                    qty_left = sale_item.quantity
                    while qty_left > 0:
                        if qty_left >= units_per_box_init:
                            qty_left -= units_per_box_init
                            units_per_box_init = product.units_per_box
                            opened_box = False
                        else:
                            units_per_box_init -= qty_left
                            qty_left = 0
                            opened_box = True
                            total_current -= 1
            
        current['total_current'] = total_current
        current['opened_box'] = opened_box

        if opened_box:
            current['left_in_box'] = units_per_box_init
        else:
            current['left_in_box'] = '-'
                

        ret.append(current)

    return Response(ret)
        
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_batch(request, product_id):
    data = request.data
    print(request.data)
    try:
        product = Product.objects.get(id=product_id)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    batch = Batch()
    batch.product = product
    batch.batch_nr = data['batch_nr']
    #batch.current_pieces = data['current_pieces']
    batch.initial_pieces = data['initial_pieces']
    batch.provider = data['provider']
    batch.paid_price_per_unit = data['paid_price_per_unit']
    #batch.expiring_date = datetime.datetime.strptime(data['expiring_date'], "%m/%d/%Y, %I:%M:%S %p")
    batch.save()
    return Response('Lot inserat cu succes')

@api_view(['PUT'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_batch(request, batch_id):
    data = request.data
    print(data)
    batch = get_object_or_404(Batch, id=batch_id)
    try: 
        batch.batch_nr = data['batch_nr']
        #batch.current_pieces = data['current_pieces']
        batch.initial_pieces = data['initial_pieces']
        batch.provider = data['provider']
        batch.paid_price_per_unit = data['paid_price_per_unit']
        #batch.expiring_date = datetime.datetime.strptime(data['expiring_date'], "%m/%d/%Y, %I:%M:%S %p")
        batch.save()

        return Response('Lot modificat cu succes')
    except:
        return Response('Date Invalide', status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_batch(request, batch_id):
    batch = get_object_or_404(Batch, id=batch_id)
    batch.delete()
    return Response('Lot sters cu succes')

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_product_stock(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    batches = Batch.objects.filter(product=product)
    ret = {
        'id': product.id,
        'total_initial': 0,
        'total_current': 0,
        'left_units': 0,
    }

    if batches.count() < 1:
        return Response(ret)
    
    for batch in batches:
        ret['total_initial'] += batch.initial_pieces
        ret['total_current'] += batch.current_pieces

    return Response(ret)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_clients(request):
    clients = Client.objects.all()

    if(request.GET.get('first_name')):
        clients = clients.filter(first_name__contains=request.GET.get('first_name'))

    if(request.GET.get('last_name')):
        clients = clients.filter(last_name__contains=request.GET.get('last_name'))

    if(request.GET.get('cnp')):
        clients = clients.filter(cnp__contains=request.GET.get('cnp'))

    serializer = ClientSerializer(clients, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_client(request, cnp):
    client = get_object_or_404(Client, cnp=cnp)
    serializer = ClientSerializer(client)

    return Response(serializer.data)


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_client(request):
    data = request.data
    print(request.data)
    
    serializer = ClientSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_client(request, client_id):
    data = request.data
    client = get_object_or_404(Client, id=client_id)
    try: 
        client.cnp = data['cnp']
        client.first_name = data['first_name']
        client.last_name = data['last_name']
        client.phone_nr = data['phone_nr']
        client.save()
        return Response('Client modificat cu succes')
           

    except Exception as e:
        print(e)
        return Response('Date Invalide', status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_client(request, client_id):
    client = get_object_or_404(Client, id=client_id)
    client.delete()
    return Response('Client sters cu succes')


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_sale(request): 
    data = request.data
    sale = Sale()
    if data.get('client_id', None):
        sale.client = get_object_or_404(Client, id = data['client_id'])
    sale.operator = request.user
    sale.save()

    for item in data['items']:
        print(item)
        current_sale_item = SaleItem()
        current_sale_item.product = get_object_or_404(Product, id = int(item['id']) )
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

    return Response('Vanzare creata cu succes') 

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_sales(request):
    user = request.user
    
    if user.is_staff:
        sales = Sale.objects.all().order_by('-created_on')
    else:
        sales = Sale.objects.filter(operator = user).order_by('-created_on')
    
    if request.GET.get('start_date'):
        start_date = datetime.datetime.strptime(request.GET.get('start_date'), '%d/%m/%Y')
        sales = sales.filter(created_on__gte=start_date)

    if request.GET.get('end_date'):
        end_date = datetime.datetime.strptime(request.GET.get('end_date'), '%d/%m/%Y')
        end_date = end_date + datetime.timedelta(hours=23, minutes=59, seconds=58)
        sales = sales.filter(created_on__lte=end_date)

    operator = None
    if request.GET.get('operator') and request.user.is_staff:
        operator = User.objects.filter()

    cnp = None
    if request.GET.get('cnp'):
        client = Client.objects.get(cnp = request.GET.get('cnp'))
        sales = sales.filter(client = client)

    cod_produs = None
    if request.GET.get('cod'):
        cod_produs = request.GET.get('cod')

    ret = []
    for sale in sales:
        curr = {
            'id': sale.id,
            'client_cnp': None,
            'operator': None,
            'prescription': None,
            'created_on': sale.created_on.strftime('%m/%d/%Y, %H:%M'),
            'sale_items': [],
            'total_price': 0,
            
        }

        if sale.operator:
            curr['operator'] = '{} {}'.format(sale.operator.first_name, sale.operator.last_name)

        if sale.client:
            curr['client_cnp'] = sale.client.cnp

        if sale.prescription:
            curr['prescription'] = {
                'series': sale.prescription.series,
                'nr': sale.prescription.nr
            }
                
        

        items = SaleItem.objects.filter(sale=sale)
        if cod_produs:
            product = Product.objects.get(cod = cod_produs)
            
            if items.filter(product = product).count() < 1:
                continue
        
        for item in items:
            curr_item = {
                'id': item.id,
                'product': {
                    'id': item.product.id,
                    'cod': item.product.cod,
                    'name': item.product.name,
                    'is_prescribed': item.product.is_prescribed,
                    'price': item.product.price,
                    'price_per_unit': item.product.price_per_unit
                },
                'sold_per_unit': item.sold_per_unit,
                'quantity': item.quantity,
                
            }

            if curr_item['sold_per_unit']:
                curr_item['total_price'] = item.quantity * item.product.price_per_unit
            else:
                curr_item['total_price'] = item.quantity * item.product.price

            curr['sale_items'].append(curr_item)
            curr['total_price'] += curr_item['total_price']

        ret.append(curr)

    return Response(ret)

@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_sale(request, sale_id):
    sale = get_object_or_404(Sale, id=sale_id)
    
    items = SaleItem.objects.filter(sale=sale)
    for item in items:
        batch = Batch.objects.filter(product = item.product).first()
        batch.current_pieces += item.quantity
        batch.save()

    sale.delete()
    return Response('Vanzare stearsa cu succes.')

@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_sale_item(request, sale_item_id):
    
    sale_item = get_object_or_404(SaleItem, id=sale_item_id)

    batch = Batch.objects.filter(product = sale_item.product).first()
    batch.current_pieces += sale_item.quantity
    batch.save()
    
    delete_sale = False
    items = SaleItem.objects.filter(sale=sale_item.sale)
    if items.count() < 2:
        delete_sale = True
        sale_item.sale.delete()
    else:
        sale_item.delete()

    return Response({'delete_sale': delete_sale})

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_reports(request):
    if not request.user.is_staff:
        return Response('Only admins can acces stats/reports.', status=status.HTTP_403_FORBIDDEN)
    
    start_date = None
    if request.GET.get('start_date'):
        start_date = datetime.datetime.strptime(request.GET.get('start_date'), '%d/%m/%Y')
    
    end_date = None
    if request.GET.get('end_date'):
        end_date = datetime.datetime.strptime(request.GET.get('end_date'), '%d/%m/%Y')
        end_date = end_date + datetime.timedelta(hours=23, minutes=59, seconds=58)

    ret = {
        'sales': 0,
        'income': 0,
        'income-chart': [
            {
                'name': 'Venit',
                'series': []
            },
            {
                'name': 'Profit',
                'series': []
            },
            {
                'name': 'Investitii',
                'series': []
            },
        ],
        'sales-chart': [
            {
                'name': 'Vanzari',
                'series': []
            }
        ],
        'client-chart': [
            {
                'name': 'Clienti inregistrati',
                'series': []
            }
        ],
        'receipt-chart': [
            {
                'name': 'Nr. Retete',
                'series': []
            },
        ]
    }

    sales = Sale.objects.all()
    new_clients = Client.objects.all()
    batches = Batch.objects.all()
    if start_date:
        sales = sales.filter(created_on__gte=start_date)
        new_clients = new_clients.filter(created_on__gte=start_date)
        batches = batches.filter(created_on__gte=start_date)
    if end_date:
        sales = sales.filter(created_on__lte=end_date)
        new_clients = new_clients.filter(created_on__lte=end_date)
        batches = batches.filter(created_on__lte=end_date)

    ret['sales'] = sales.count()


    client_count = 0
    for client in new_clients:
        client_count += 1
        index = dateExistsInDictArr(ret['client-chart'][0]['series'], client.created_on.strftime('%Y-%m-%d'))
        if index >= 0:
            ret['client-chart'][0]['series'][index]['value'] = client_count
        else:
            ret['client-chart'][0]['series'].append({
                'name': client.created_on.strftime('%Y-%m-%d'),
                'value': client_count
            })

    ret['new_clients'] = new_clients.count()

    investments = 0
    for batch in batches.order_by('created_on'):
        investments += batch.paid_price_per_unit * batch.initial_pieces
        index = dateExistsInDictArr(ret['income-chart'][2]['series'], batch.created_on.strftime('%Y-%m-%d'))
        if index >= 0:
            ret['income-chart'][2]['series'][index]['value'] = investments
        else:
            ret['income-chart'][2]['series'].append({
                'name': batch.created_on.strftime('%Y-%m-%d'),
                'value': investments
            })
    ret['investments'] = investments

    income = 0
    profit = 0
    count_sales = 1
    count_prescriptions = 0
    paid_price_median = {}
    for sale in sales:
        compensations = 0
        if sale.prescription:
            pass

        for sale_item in SaleItem.objects.filter(sale=sale):
            if not paid_price_median.get(sale_item.product.cod):
                paid_price_median[sale_item.product.cod] = {
                    'per_box': 0,
                    'per_unit': 0
                }

                batches = Batch.objects.filter(product=sale_item.product)
                media = 0
                ponderi = 0
                for batch in batches:
                    media += batch.paid_price_per_unit * batch.initial_pieces
                    ponderi += batch.initial_pieces

                paid_price_median[sale_item.product.cod]['per_box'] = media/ponderi
                paid_price_median[sale_item.product.cod]['per_unit'] = (media/ponderi) / sale_item.product.units_per_box

            if sale_item.sold_per_unit:
                income += sale_item.product.price_per_unit * sale_item.quantity
                profit += (sale_item.product.price_per_unit - paid_price_median[sale_item.product.cod]['per_unit']) * sale_item.quantity
            else:
                income += sale_item.product.price * sale_item.quantity
                profit += (sale_item.product.price - paid_price_median[sale_item.product.cod]['per_box']) * sale_item.quantity

            
        
        if sale.prescription:
            count_prescriptions += 1
            index = dateExistsInDictArr(ret['receipt-chart'][0]['series'], sale.created_on.strftime('%Y-%m-%d'))
            if index >= 0:
                ret['receipt-chart'][0]['series'][index]['value'] += 1
            else:
                ret['receipt-chart'][0]['series'].append({
                    'name': sale.created_on.strftime('%Y-%m-%d'),
                    'value': 1
                })

        index = dateExistsInDictArr(ret['income-chart'][0]['series'], sale.created_on.strftime('%Y-%m-%d'))
        if index >= 0:
            ret['income-chart'][0]['series'][index]['value'] = income
        else:
            ret['income-chart'][0]['series'].append({
                'name': sale.created_on.strftime('%Y-%m-%d'),
                'value': income
            })

        index = dateExistsInDictArr(ret['income-chart'][1]['series'], sale.created_on.strftime('%Y-%m-%d'))
        if index >= 0:
            ret['income-chart'][1]['series'][index]['value'] = profit
        else:
            ret['income-chart'][1]['series'].append({
                'name': sale.created_on.strftime('%Y-%m-%d'),
                'value': profit
            })

        index = dateExistsInDictArr(ret['sales-chart'][0]['series'], sale.created_on.strftime('%Y-%m-%d'))
        if index >= 0:
            ret['sales-chart'][0]['series'][index]['value'] = count_sales
        else:
            ret['sales-chart'][0]['series'].append({
                'name': sale.created_on.strftime('%Y-%m-%d'),
                'value': count_sales
            })
        count_sales += 1

        
    ret['income'] = round(income, 1)
    ret['profit'] = round(profit, 1)
    ret['prescriptions'] = count_prescriptions
    if income:
        ret['profit_margin'] = round((profit/income * 100), 1)
    else:
        ret['profit_margin'] = '-'

    return Response(ret)



@api_view(['PUT'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_configs(request):
    data = request.data
    print(data)

    if Configs.objects.count() < 1:
        configs = Configs()
        print('HERE1')
    else:
        configs = Configs.objects.first()
        print('HERE2')

    try:
        configs.pharmacy_name = data['pharmacy_name']
        configs.pharmacy_cod = data['pharmacy_cod']
        configs.pharmacy_location = data['pharmacy_location']
        configs.insurance_house = data['insurance_house']
        configs.insurance_contract_no = data['insurance_contract_no']
        configs.save()

        return Response('Configurarile actualizate cu succes')
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_configs(request):
    if Configs.objects.count() < 1:
        config = Configs()
    else:
        config = Configs.objects.first()

    serializer = ConfigSerializer(config)
    return Response(serializer.data)