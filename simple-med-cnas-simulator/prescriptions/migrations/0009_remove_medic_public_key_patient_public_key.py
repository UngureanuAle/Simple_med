# Generated by Django 5.0 on 2024-01-18 11:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('prescriptions', '0008_medic_public_key'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='medic',
            name='public_key',
        ),
        migrations.AddField(
            model_name='patient',
            name='public_key',
            field=models.CharField(default='a', max_length=156),
            preserve_default=False,
        ),
    ]
