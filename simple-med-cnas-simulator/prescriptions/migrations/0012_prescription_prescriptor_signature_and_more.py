# Generated by Django 5.0 on 2024-01-19 12:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('prescriptions', '0011_medic_public_key_alter_patient_public_key'),
    ]

    operations = [
        migrations.AddField(
            model_name='prescription',
            name='prescriptor_signature',
            field=models.CharField(default='a', max_length=650),
        ),
        migrations.AlterField(
            model_name='medic',
            name='public_key',
            field=models.CharField(max_length=600),
        ),
        migrations.AlterField(
            model_name='patient',
            name='public_key',
            field=models.CharField(max_length=600),
        ),
        migrations.AlterField(
            model_name='prescription',
            name='patient_signature',
            field=models.CharField(default='a', max_length=650),
        ),
    ]
