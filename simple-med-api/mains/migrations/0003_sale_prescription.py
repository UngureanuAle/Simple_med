# Generated by Django 5.0 on 2024-01-22 23:33

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mains', '0002_prescription'),
    ]

    operations = [
        migrations.AddField(
            model_name='sale',
            name='prescription',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='mains.prescription'),
        ),
    ]