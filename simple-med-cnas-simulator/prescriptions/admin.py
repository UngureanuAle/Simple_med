from django.contrib import admin
from .models import Medic, Patient, Prescription, PrescriptionItem

# Register your models here.
admin.site.register(Medic)
admin.site.register(Patient)

admin.site.register(PrescriptionItem)

class ItemInline(admin.TabularInline):
    model = PrescriptionItem

class PrescriptionAdmin(admin.ModelAdmin):
    readonly_fields = ['created_at']
    inlines = [ItemInline]

admin.site.register(Prescription, PrescriptionAdmin)