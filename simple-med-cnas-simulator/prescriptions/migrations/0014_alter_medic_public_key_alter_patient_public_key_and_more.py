# Generated by Django 5.0 on 2024-01-19 16:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('prescriptions', '0013_alter_medic_public_key_alter_patient_public_key_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='medic',
            name='public_key',
            field=models.CharField(max_length=1000),
        ),
        migrations.AlterField(
            model_name='patient',
            name='public_key',
            field=models.CharField(max_length=1000),
        ),
        migrations.AlterField(
            model_name='prescription',
            name='patient_signature',
            field=models.CharField(max_length=1000),
        ),
        migrations.AlterField(
            model_name='prescription',
            name='prescriptor_signature',
            field=models.CharField(max_length=1000),
        ),
    ]