from django.urls import path
from .views import get_prescription,get_prescription_id_by_sn,  get_prescriptions_list, get_prescription_by_id, validate_online_prescription, validate_ofline_prescription

urlpatterns = [
    path('', get_prescription, name='get-products'),
    path('validate-online', validate_online_prescription, name='validate-online-prescription'),
    path('validate-offline', validate_ofline_prescription, name='validate-offline-prescription'),
    path('multiple', get_prescriptions_list, name='get-prescriptions-list'),
    path('get/<int:id>', get_prescription_by_id, name='get-prescriptions-by-id'),
    path('get-sn/<str:series>/<str:nr>', get_prescription_id_by_sn, name='get-prescription-id-by-sn')
]