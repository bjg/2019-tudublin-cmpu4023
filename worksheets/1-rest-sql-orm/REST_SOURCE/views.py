from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Users, Products
from .serializers import UsersSerializer, ProductsSerializer




# new views 

class UsersView(viewsets.ModelViewSet):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer

    def get(self,request):
        return Response(serializer_class.data)

class ProductsView(viewsets.ModelViewSet):
    queryset = Products.objects.all()
    serializer_class = ProductsSerializer
    
    def get(self,request):
        return Response(serializer_class.data)
    
