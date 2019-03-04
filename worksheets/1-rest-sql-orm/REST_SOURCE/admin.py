from django.contrib import admin
from .models import Users, Products
# Register your models here.


@admin.register(Users)
class UsersAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'password', 'details', 'created_at', 'deleted_at')

@admin.register(Products)
class UsersAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'price', 'created_at', 'deleted_at')

