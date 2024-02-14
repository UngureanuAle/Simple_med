from django.db import models
from django.contrib.auth.models import User

# Create your models here.
PRODUCT_TYPES = (
    (1, 'Antibiotice'),
    (2, 'Antivirale'),
    (3, 'Antiinflamatoare'),
    (4, 'Antidepresive, anxiolitice și antipsihotice'),
    (5, 'Antineoplazice'),
    (6, 'Antidiabetice'),
    (7, 'Anticoagulante și antiagregante plachetare'),
    (8, 'Antipiretice'),
    (9, 'Analgezice')
)

ADMINISTRATION_TYPE = (
    (1, 'Orală'),
    (2, 'Intravenoasă'),
    (3, 'Topicală'),
    (4, 'Inhalatorie')
)

class Prescription(models.Model):
    id = models.AutoField(primary_key=True)
    series = models.CharField(max_length=20)
    nr = models.CharField(max_length=20)
    created_at = models.DateField()
    stencil_nr = models.CharField(max_length=20)
    dummy = models.CharField(max_length=20, default='dummy')
    prescription_id = models.IntegerField(null=True)

class Product(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(blank=False, null=False, max_length=300)
    cod = models.CharField(blank=False, null=False, unique=True, max_length=14, default='10000')
    is_prescribed = models.BooleanField(default=False)
    manufacturer = models.CharField(blank=False, null=False, max_length=300, default="Bayer")
    med_type = models.IntegerField(choices=PRODUCT_TYPES, null=False)
    adm_type = models.IntegerField(choices=ADMINISTRATION_TYPE, null=False)
    description = models.TextField()
    prospect = models.FileField(null=True, blank=True, upload_to='prospects/')
    price = models.FloatField(default=10)
    sold_per_unit = models.BooleanField(default=False)
    units_per_box = models.IntegerField(default=1)
    price_per_unit = models.FloatField(default=1)
    

class Batch(models.Model):
    id = models.AutoField(primary_key=True)
    batch_nr = models.CharField(blank=False, null=False, unique=True, max_length=5, default='10000')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    created_on = models.DateField(auto_now_add=True)
    initial_pieces = models.IntegerField()
    current_pieces = models.IntegerField(default=100)
    provider = models.CharField(default='PharmaBiz S.R.L', max_length=100)
    paid_price_per_unit = models.FloatField(default=1)

class Client(models.Model):
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(blank=False, null=False, max_length=100)
    last_name = models.CharField(blank=False, null=False, max_length=100)
    cnp = models.CharField(blank=False, null=False, max_length=14, unique=True)
    phone_nr = models.CharField(blank=False, null=True, max_length=100, default=None)
    created_on = models.DateTimeField(auto_now_add=True)

class Sale(models.Model):
    id = models.AutoField(primary_key=True)
    created_on = models.DateTimeField(auto_now_add=True)
    operator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, default=None)
    client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True)
    prescription = models.ForeignKey(Prescription, on_delete=models.SET_NULL, null=True)

class SaleItem(models.Model):
    id = models.AutoField(primary_key=True)
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, null=True, on_delete=models.SET_NULL, default=None)
    quantity = models.IntegerField(default=1)
    sold_per_unit = models.BooleanField(default=False)

class Configs(models.Model):
    id = models.AutoField(primary_key=True)
    pharmacy_name = models.CharField(null=True, blank=True, max_length=200)
    pharmacy_cod = models.CharField(null=True, blank=True, max_length=200)
    pharmacy_location = models.CharField(null=True, blank=True, max_length=300)
    insurance_house = models.CharField(null=True, blank=True, max_length=300)
    insurance_contract_no = models.CharField(null=True, blank=True, max_length=300)