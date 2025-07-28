from django.contrib import admin
from .models import Book


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'owner', 'genre', 'condition', 'is_available', 'created_at')
    list_filter = ('genre', 'condition', 'is_available', 'created_at')
    search_fields = ('title', 'author', 'owner__username', 'owner__first_name', 'owner__last_name')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Book Information', {
            'fields': ('title', 'author', 'isbn', 'genre', 'condition', 'description')
        }),
        ('Media', {
            'fields': ('cover_image',)
        }),
        ('Availability', {
            'fields': ('is_available',)
        }),
        ('Owner', {
            'fields': ('owner',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    ) 