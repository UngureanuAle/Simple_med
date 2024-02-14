# Generated by Django 5.0 on 2024-01-22 23:32

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('cnp', models.CharField(max_length=14, unique=True)),
                ('phone_nr', models.CharField(default=None, max_length=100, null=True)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Configs',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('pharmacy_name', models.CharField(blank=True, max_length=200, null=True)),
                ('pharmacy_cod', models.CharField(blank=True, max_length=200, null=True)),
                ('pharmacy_location', models.CharField(blank=True, max_length=300, null=True)),
                ('insurance_house', models.CharField(blank=True, max_length=300, null=True)),
                ('insurance_contract_no', models.CharField(blank=True, max_length=300, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=300)),
                ('cod', models.CharField(default='10000', max_length=14, unique=True)),
                ('is_prescribed', models.BooleanField(default=False)),
                ('manufacturer', models.CharField(default='Bayer', max_length=300)),
                ('med_type', models.IntegerField(choices=[(1, 'Antibiotice'), (2, 'Antivirale'), (3, 'Antiinflamatoare'), (4, 'Antidepresive, anxiolitice și antipsihotice'), (5, 'Antineoplazice'), (6, 'Antidiabetice'), (7, 'Anticoagulante și antiagregante plachetare'), (8, 'Antipiretice'), (9, 'Analgezice')])),
                ('adm_type', models.IntegerField(choices=[(1, 'Orală'), (2, 'Intravenoasă'), (3, 'Topicală'), (4, 'Inhalatorie')])),
                ('description', models.TextField()),
                ('prospect', models.FileField(blank=True, null=True, upload_to='prospects/')),
                ('price', models.FloatField(default=10)),
                ('sold_per_unit', models.BooleanField(default=False)),
                ('units_per_box', models.IntegerField(default=1)),
                ('price_per_unit', models.FloatField(default=1)),
            ],
        ),
        migrations.CreateModel(
            name='Batch',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('batch_nr', models.CharField(default='10000', max_length=5, unique=True)),
                ('created_on', models.DateField(auto_now_add=True)),
                ('initial_pieces', models.IntegerField()),
                ('current_pieces', models.IntegerField(default=100)),
                ('provider', models.CharField(default='PharmaBiz S.R.L', max_length=100)),
                ('paid_price_per_unit', models.FloatField(default=1)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='mains.product')),
            ],
        ),
        migrations.CreateModel(
            name='Sale',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('client', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='mains.client')),
                ('operator', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='SaleItem',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('quantity', models.IntegerField(default=1)),
                ('sold_per_unit', models.BooleanField(default=False)),
                ('product', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='mains.product')),
                ('sale', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='mains.sale')),
            ],
        ),
    ]