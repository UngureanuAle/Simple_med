from django.db import models

# Create your models here.
class Reciever(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    cnp = models.CharField(max_length=20)

class Medic(models.Model):
    name = models.CharField(max_length=100)
    stencil_nr = models.CharField(max_length=20)
    medical_facility = models.CharField(max_length=200)
    adress = models.CharField(max_length=300)
    cui = models.CharField(max_length=20)
    phone_nr = models.CharField(max_length=20)
    email = models.CharField(max_length=50)
    insurance_house = models.CharField(max_length=50)
    insurance_house_code = models.CharField(max_length=50)
    public_key = models.CharField(max_length=1000)

class Patient(models.Model):
    SEX_CHOICES = (
        ('M', 'M'),
        ('F', 'F')
    )

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    patient_type = models.CharField(max_length=20)
    sex = models.CharField(max_length=2, choices = SEX_CHOICES, default='M')
    card_nr = models.CharField(max_length=20)
    cnp = models.CharField(max_length=20, null=True, blank=True, default=None)
    cid = models.CharField(max_length=20)
    birth_date = models.DateField()
    nationality = models.CharField(max_length=2)
    insurance_house_code = models.CharField(max_length=20, null=True, blank=True)
    public_key = models.CharField(max_length=1000)


class Prescription(models.Model):
    SOURCE_CHOICES = [
        (0, 'Medic de familie'),
        (1, 'Ambulatoriu'),
        (2, 'Spital'),
        (3, 'Ambulanta'),
        (4, 'Altele'),
        (5, 'MF - MM')
    ]

    STATE_CHOICES = [
        (1, 'Prescris/Activ'),
        (2, 'Eliberat')
    ]

    id = models.AutoField(primary_key=True)
    presciptor = models.ForeignKey(Medic, null=True, on_delete=models.SET_NULL, default=None)
    patient = models.ForeignKey(Patient, null=True, on_delete=models.SET_NULL, default=None)
    reciever = models.ForeignKey(Reciever, null=True, on_delete=models.SET_NULL, default=None)
    source = models.IntegerField(max_length=1, choices = SOURCE_CHOICES )
    series = models.CharField(max_length=20)
    nr = models.CharField(max_length=20)
    
    created_at = models.DateField(auto_now_add=True)
    provider_contract_nr = models.CharField(max_length=20, null=True, blank=True)
    insurance_house_code = models.CharField(max_length=20, null=True, blank=True)
    state = models.IntegerField(choices=STATE_CHOICES, default=1)
    patient_signature = models.CharField(max_length=1000)
    prescriptor_signature = models.CharField(max_length=1000)
    treatment_days = models.IntegerField()


class PrescriptionItem(models.Model):
    DRUG_CODE_CHOICES = [
        ('N05CF02', 'ZOLPIDEMUM'),
        ('N06AB03', 'FLUOXETINUM'),
        ('N06AB06', 'SERTRALINUM'),
        ('N06AB08', 'FLUVOXAMINUM'),
        ('N06AX21', 'DULOXETINUM')
    ]

    PHARMACEUTICAL_FORM_CHOICES = [
        ('COMPR.', 'COMPRIMATE'),
        ('CAPS.', 'CAPSULE'),
        ('INJ.', 'INJECTII'),
        ('SOLUT.', 'SOLUTII')
    ]

    DISEASE_CODE_CHOICES = [
        ('320', 'Tulburare afectiva bipolara'),
        ('321', 'Episod depresiv'),
        ('377', 'Tulburari de somn'),
        ('504', 'Gripa cu virus identificat'),
        ('232', 'Sarcoidoza'),
        ('241', 'Diabetul zaharat insulino-dependent'),
        ('271', 'Carenta in zinc')
    ]
    DIAGNOSTIC_TYPE_CHOICES = [
        ('Cr.', 'Cronic'),
        ('SAct.', 'Subacut'),
        ('Act.', 'Acut')
    ]

    id = models.AutoField(primary_key=True)
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE)
    nr = models.IntegerField()
    drug_code = models.CharField(max_length=150, choices=DRUG_CODE_CHOICES)
    concentration = models.CharField(max_length=30, default='10 mg')
    pharmaceutical_form = models.CharField(max_length=100, choices=PHARMACEUTICAL_FORM_CHOICES)
    disease_code = models.CharField(max_length=20, choices=DISEASE_CODE_CHOICES)
    diagnostic_type = models.CharField(max_length=20, choices=DIAGNOSTIC_TYPE_CHOICES)
    quantity = models.FloatField()
    dose = models.CharField(max_length=20, default='1-0-1/zi')
    copayment_list_type = models.CharField(max_length=20, default='G15', help_text='Codul listei de bolii, ex.G15 - BOLI PSIHICE')
    copayment_list_percent = models.IntegerField(default=100)

    is_released = models.BooleanField(default=False)
    released_product_code = models.CharField(max_length=30, null=True, blank=True)
    released_sold_per_unit = models.BooleanField(null=True)
    released_quantity = models.FloatField(null=True, blank=True)






    
