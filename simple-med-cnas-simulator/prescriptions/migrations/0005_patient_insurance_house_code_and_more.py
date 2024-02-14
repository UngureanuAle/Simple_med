# Generated by Django 5.0 on 2024-01-18 10:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('prescriptions', '0004_remove_prescription_patientinsurancehouse'),
    ]

    operations = [
        migrations.AddField(
            model_name='patient',
            name='insurance_house_code',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='prescription',
            name='insurance_house_code',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
    ]