# Generated by Django 5.0 on 2024-01-19 11:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('prescriptions', '0010_alter_prescription_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='medic',
            name='public_key',
            field=models.CharField(default='-', max_length=300),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='patient',
            name='public_key',
            field=models.CharField(max_length=300),
        ),
    ]
