# Generated by Django 2.1.2 on 2019-03-25 19:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('miniwebs', '0006_auto_20190325_1940'),
    ]

    operations = [
        migrations.AlterField(
            model_name='website',
            name='business_name',
            field=models.CharField(max_length=16),
        ),
    ]
