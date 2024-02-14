# Generated by Django 5.0 on 2024-01-19 15:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('prescriptions', '0012_prescription_prescriptor_signature_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='medic',
            name='public_key',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='patient',
            name='public_key',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='prescription',
            name='patient_signature',
            field=models.TextField(default='a'),
        ),
        migrations.AlterField(
            model_name='prescription',
            name='prescriptor_signature',
            field=models.TextField(default='a'),
        ),
    ]
