from django.contrib import admin
from .models import Trade, TradeMessage


@admin.register(Trade)
class TradeAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'requester', 'recipient', 'requested_book', 
        'offered_book', 'recipient_offered_book', 'status', 
        'trade_type', 'requester_confirmed', 'recipient_confirmed',
        'created_at'
    ]
    list_filter = ['status', 'trade_type', 'created_at']
    search_fields = ['requester__username', 'recipient__username', 'requested_book__title']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Trade Information', {
            'fields': ('requester', 'recipient', 'status', 'trade_type')
        }),
        ('Books', {
            'fields': ('requested_book', 'offered_book', 'recipient_offered_book')
        }),
        ('Confirmation', {
            'fields': ('requester_confirmed', 'recipient_confirmed')
        }),
        ('Communication', {
            'fields': ('message',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(TradeMessage)
class TradeMessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'trade', 'sender', 'message', 'created_at']
    list_filter = ['created_at']
    search_fields = ['sender__username', 'message', 'trade__id']
    readonly_fields = ['created_at'] 