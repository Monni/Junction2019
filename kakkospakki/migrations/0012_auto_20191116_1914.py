# Generated by Django 2.2.7 on 2019-11-16 19:14

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('kakkospakki', '0011_auto_20191116_1845'),
    ]

    operations = [
        migrations.AlterField(
            model_name='housingmanager',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='housing_managers', to=settings.AUTH_USER_MODEL),
        ),
    ]
