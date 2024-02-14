from django.urls import path
from auth.views import login_view, test_auth_view, get_users, get_user, create_user, delete_user, update_user

urlpatterns = [
    path('login', login_view, name='login'),
    path('test', test_auth_view, name='test'),
    path('users', get_users, name='get-users'),
    path('user', get_user, name='get-user'),
    path('user/create', create_user, name='create-user'),
    path('user/delete/<int:id>', delete_user, name='delete-user'),
    path('user/update/<int:id>', update_user, name='update-user'),
]