from django.contrib import admin
from .models import Product, Batch, Sale, SaleItem, Client, Prescription

# Register your models here.
admin.site.register(Product)
admin.site.register(Batch)
admin.site.register(Client)
admin.site.register(Sale)
admin.site.register(SaleItem)
admin.site.register(Prescription)