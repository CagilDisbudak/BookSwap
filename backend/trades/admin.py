from django.contrib import admin
from .models import Trade


@admin.register(Trade)
class TradeAdmin(admin.ModelAdmin):
    list_display = ('id', 'requester', 'recipient', 'requested_book', 'offered_book', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('requester__username', 'recipient__username', 'requested_book__title', 'offered_book__title')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Trade Information', {
            'fields': ('requester', 'recipient', 'requested_book', 'offered_book', 'message', 'status')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    ) 