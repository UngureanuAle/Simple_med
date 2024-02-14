from django.urls import path
from .views import get_prescription, decode_datamatrix, create_prescription_sale, get_prescriptions_list, get_prescription_by_id, get_prescription_id_by_sn

urlpatterns = [
    path('prescription', get_prescription, name='get-prescription'),
    path('datamatrix', decode_datamatrix, name='decode-datamatrix'),
    path('prescription/create', create_prescription_sale, name='create-prescription-sale'),
    path('prescription/multiple', get_prescriptions_list, name='get-prescription-list'),
    path('prescription/<int:id>', get_prescription_by_id, name='get-prescription-by-id'),
    path('prescription-sn/<str:series>/<str:nr>', get_prescription_id_by_sn, name='get-prescription-id-by-sn'),
]