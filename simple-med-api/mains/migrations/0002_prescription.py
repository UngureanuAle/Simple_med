# Generated by Django 5.0 on 2024-01-22 23:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mains', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Prescription',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('series', models.CharField(max_length=20)),
                ('nr', models.CharField(max_length=20)),
                ('created_at', models.DateField(auto_now_add=True)),
                ('stencil_nr', models.CharField(max_length=20)),
                ('dummy', models.CharField(default='dummy', max_length=20)),
            ],
        ),
    ]
