from rest_framework import serializers
from .models import Product, PRODUCT_TYPES, ADMINISTRATION_TYPE, Client, Configs

class ProductSerializer(serializers.ModelSerializer):
    med_type_display = serializers.ChoiceField(choices=PRODUCT_TYPES, source='get_med_type_display', read_only=True)
    adm_type_display = serializers.ChoiceField(choices=ADMINISTRATION_TYPE, source='get_adm_type_display', read_only=True)
    class Meta(object):
        model = Product
        fields = ['id', 'name', 'cod', 'med_type_display', 'adm_type_display', 'med_type', 'adm_type', 'description', 'prospect', 'is_prescribed', 'manufacturer', 'price', 'sold_per_unit', 'price_per_unit', 'units_per_box']


class ClientSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Client
        fields = ['id','first_name', 'last_name', 'cnp', 'phone_nr']

class ConfigSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Configs
        fields = ['pharmacy_name', 'pharmacy_cod', 'pharmacy_location', 'insurance_house', 'insurance_contract_no']