# Generated by Django 5.0 on 2024-01-22 13:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('prescriptions', '0015_patient_sex'),
    ]

    operations = [
        migrations.AddField(
            model_name='prescriptionitem',
            name='is_released',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='prescriptionitem',
            name='released_product_code',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
        migrations.AddField(
            model_name='prescriptionitem',
            name='released_quantity',
            field=models.FloatField(null=True),
        ),
        migrations.AddField(
            model_name='prescriptionitem',
            name='released_sold_per_unit',
            field=models.BooleanField(null=True),
        ),
        migrations.AlterField(
            model_name='prescriptionitem',
            name='disease_code',
            field=models.CharField(choices=[('320', 'Tulburare afectiva bipolara'), ('321', 'Episod depresiv'), ('377', 'Tulburari de somn'), ('504', 'Gripa cu virus identificat'), ('232', 'Sarcoidoza'), ('241', 'Diabetul zaharat insulino-dependent'), ('271', 'Carenta in zinc')], max_length=20),
        ),
        migrations.AlterField(
            model_name='prescriptionitem',
            name='drug_code',
            field=models.CharField(choices=[('N05CF02', 'ZOLPIDEMUM'), ('N06AB03', 'FLUOXETINUM'), ('N06AB06', 'SERTRALINUM'), ('N06AB08', 'FLUVOXAMINUM'), ('N06AX21', 'DULOXETINUM')], max_length=150),
        ),
    ]
