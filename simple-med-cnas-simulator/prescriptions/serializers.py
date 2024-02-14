from rest_framework import serializers
from .models import Medic, Patient, Prescription, PrescriptionItem

class MedicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medic
        fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        exclude = ['public_key']

class PrescriptionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescriptionItem
        fields = '__all__'

class PrescriptionSerializer(serializers.ModelSerializer):
    presciptor = MedicSerializer()
    patient = PatientSerializer()
    prescription_items = serializers.SerializerMethodField()

    class Meta:
        model = Prescription
        fields = '__all__'

    def get_prescription_items(self, obj):
        prescription_items = PrescriptionItem.objects.filter(prescription=obj)
        return PrescriptionItemSerializer(prescription_items, many=True).data