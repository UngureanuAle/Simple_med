# Generated by Django 5.0 on 2024-01-18 11:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('prescriptions', '0007_remove_prescription_presciptor_signature'),
    ]

    operations = [
        migrations.AddField(
            model_name='medic',
            name='public_key',
            field=models.CharField(default='a', max_length=156),
            preserve_default=False,
        ),
    ]
