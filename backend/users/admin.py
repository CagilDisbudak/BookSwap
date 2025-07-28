from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active', 'created_at')
    list_filter = ('is_staff', 'is_active', 'created_at')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-created_at',)
    
    fieldsets = UserAdmin.fieldsets + (
        ('Profile', {'fields': ('bio', 'location', 'avatar')}),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Profile', {'fields': ('bio', 'location', 'avatar')}),
    ) 