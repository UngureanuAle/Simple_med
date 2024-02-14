from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

# Create your views here.

@api_view(['POST'])
def login_view(request):
    user = get_object_or_404(User, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)

    return Response({'token': token.key, 'user': serializer.data, 'first_name': user.first_name, 'last_name': user.last_name, 'is_admin': user.is_staff})

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_auth_view(request):
    return Response({'passed': True})


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_users(request):
    if not request.user.is_staff:
        return Response('Only admins can acces stats/reports.', status=status.HTTP_403_FORBIDDEN)

    username = request.query_params.get('username', None)
    first_name = request.query_params.get('first_name', None)
    last_name = request.query_params.get('last_name', None)
    is_admin = request.query_params.get('is_admin', None)

    # Initial queryset
    queryset = User.objects.all()

    # Apply filters based on query parameters
    if username:
        queryset = queryset.filter(username__contains=username)

    if first_name:
        queryset = queryset.filter(first_name__contains=first_name)

    if last_name:
        queryset = queryset.filter(last_name__contains=last_name)

    if is_admin is not None:
        is_admin = is_admin.lower() == 'true'  # Assuming 'true' or 'false' strings
        queryset = queryset.filter(is_staff=is_admin)

    ret = []
    for user in queryset:
        curr = {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_admin': user.is_staff
        }
        ret.append(curr)

    return Response(ret)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user(request):
    if not request.user.is_staff:
        return Response('Only admins can acces stats/reports.', status=status.HTTP_403_FORBIDDEN)
    
    user = get_object_or_404(User, username=request.GET.get('username'))

    return Response({
        'id': user.id,
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'is_admin': user.is_staff
    })

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_user(request):
    if not request.user.is_staff:
        return Response('Only admins can acces stats/reports.', status=status.HTTP_403_FORBIDDEN)
    
    data = request.data
    print(data)
    try:
        user = User()
        user.username = data['username']
        user.first_name = data['first_name']
        user.last_name = data['last_name']
        if data['is_admin'] == 'true':
            user.is_staff = True
        else:
            user.is_staff = False
        user.set_password(data['password'])
        user.save()
    except:
        return Response('Date gresite sau utilizatorul exista deja', status=status.HTTP_400_BAD_REQUEST)

    return Response({
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'is_admin': user.is_staff,
    })

@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_user(request, id):
    if not request.user.is_staff:
        return Response('Only admins can acces stats/reports.', status=status.HTTP_403_FORBIDDEN)
    
    user = get_object_or_404(User, id=id)
    if user.is_superuser:
        return Response('Userul admin nu poate fi sters', status=status.HTTP_403_FORBIDDEN)
    
    user.delete()
    return Response('User sters cu succes')


@api_view(['PUT', 'UPDATE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_user(request, id):
    if not request.user.is_staff:
        return Response('Only admins can acces stats/reports.', status=status.HTTP_403_FORBIDDEN)
    
    data = request.data
    user = get_object_or_404(User, id=id)
    try:
        user.username = data['username']
        user.first_name = data['first_name']
        user.last_name = data['last_name']
        if data['is_admin'] == 'true':
            user.is_staff = True
        else:
            user.is_staff = False
        user.set_password(data['password'])
        user.save()
    except:
        return Response('Date gresite!', status=status.HTTP_400_BAD_REQUEST)

    return Response({
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'is_admin': user.is_staff,
    })