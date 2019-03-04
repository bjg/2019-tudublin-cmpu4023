from rest_framework import serializers
from .models import Users, Products


class UsersSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Users
        fields = ('id', 'email', 'password', 'details', 'created_at', 'deleted_at')

class ProductsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Products
        fields = ('id', 'title', 'price', 'created_at','deleted_at')