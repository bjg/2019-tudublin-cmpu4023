from django.contrib.postgres.fields import HStoreField
from django.db import models

# Create your models here.
'''
class Maps(models.Model):
    name = models.CharField(max_length=50)
    address = models.CharField(max_length=200)
    location = models.PointField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
'''

class Users(models.Model):
    id = models.AutoField(primary_key=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    password = models.CharField(max_length=255, blank=True, null=True)
    details = HStoreField()
    created_at = models.DateTimeField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'users'


    def __str__(self):
        field_values = []
        for field in self.meta.get_all_field_names():
            field_values.append(getattr(self,field, ''))
        return ''.join(field_values)


class Products(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    price = models.DecimalField(max_digits=65535, decimal_places=6, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    tags = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'products'


    def __str__(self):
        field_values = []
        for field in self.meta.get_all_field_names():
            field_values.append(getattr(self,field, ''))
        return ''.join(field_values)

'''
    def __str__(self):
        field_values = []
        for feild in self.meta.get
'''