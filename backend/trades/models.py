from django.db import models
from django.contrib.auth import get_user_model
from books.models import Book

User = get_user_model()


class Trade(models.Model):
    """Trade model for book exchange requests."""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
    ]

    requester = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='sent_trades'
    )
    recipient = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='received_trades'
    )
    requested_book = models.ForeignKey(
        Book, 
        on_delete=models.CASCADE, 
        related_name='requested_trades'
    )
    offered_book = models.ForeignKey(
        Book, 
        on_delete=models.CASCADE, 
        related_name='offered_trades',
        null=True,
        blank=True
    )
    message = models.TextField(blank=True)
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'trades'
        ordering = ['-created_at']

    def __str__(self):
        return f"Trade {self.id}: {self.requester.username} → {self.recipient.username}"

    def clean(self):
        """Validate trade data."""
        from django.core.exceptions import ValidationError
        
        if self.requester == self.recipient:
            raise ValidationError("Cannot trade with yourself.")
        
        if self.requested_book.owner != self.recipient:
            raise ValidationError("Requested book must belong to the recipient.")
        
        if self.offered_book and self.offered_book.owner != self.requester:
            raise ValidationError("Offered book must belong to the requester.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs) 