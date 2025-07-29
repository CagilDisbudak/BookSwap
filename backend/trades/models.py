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
        ('completed', 'Completed'),
    ]

    TRADE_TYPE_CHOICES = [
        ('swap', 'Book Swap'),
        ('donation', 'Donation'),
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
    # New field for recipient's offered book
    recipient_offered_book = models.ForeignKey(
        Book,
        on_delete=models.CASCADE,
        related_name='recipient_offered_trades',
        null=True,
        blank=True
    )
    message = models.TextField(blank=True)
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pending'
    )
    trade_type = models.CharField(
        max_length=20,
        choices=TRADE_TYPE_CHOICES,
        default='swap'
    )
    # Confirmation fields
    requester_confirmed = models.BooleanField(default=False)
    recipient_confirmed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'trades'
        ordering = ['-created_at']

    def __str__(self):
        if self.trade_type == 'donation':
            return f"Donation {self.id}: {self.requester.username} → {self.recipient.username}"
        return f"Trade {self.id}: {self.requester.username} ↔ {self.recipient.username}"

    @property
    def is_completed(self):
        """Check if trade is completed based on type."""
        if self.trade_type == 'donation':
            # For donations, only recipient needs to confirm
            return self.recipient_confirmed
        else:
            # For swaps, both parties need to confirm
            return self.requester_confirmed and self.recipient_confirmed

    @property
    def can_be_completed(self):
        """Check if trade can be marked as completed."""
        return self.status == 'accepted' and self.is_completed

    def clean(self):
        """Validate trade data."""
        from django.core.exceptions import ValidationError
        
        if self.requester == self.recipient:
            raise ValidationError("Cannot trade with yourself.")
        
        if self.requested_book.owner != self.recipient:
            raise ValidationError("Requested book must belong to the recipient.")
        
        if self.offered_book and self.offered_book.owner != self.requester:
            raise ValidationError("Offered book must belong to the requester.")
        
        if self.recipient_offered_book and self.recipient_offered_book.owner != self.recipient:
            raise ValidationError("Recipient offered book must belong to the recipient.")

    def save(self, *args, **kwargs):
        self.clean()
        
        # Auto-complete trade when both parties confirm
        if self.is_completed and self.status == 'accepted':
            self.status = 'completed'

            # --- Ownership transfer logic ---
            # Swap
            if self.trade_type == 'swap':
                # Requested book goes to requester
                self.requested_book.owner = self.requester
                self.requested_book.is_available = True
                self.requested_book.save()
                # If recipient offered a book back, it goes to the requester
                if self.recipient_offered_book:
                    self.recipient_offered_book.owner = self.requester
                    self.recipient_offered_book.is_available = True
                    self.recipient_offered_book.save()
                # If requester offered a book, it goes to the recipient
                if self.offered_book:
                    self.offered_book.owner = self.recipient
                    self.offered_book.is_available = True
                    self.offered_book.save()
            # Donation
            elif self.trade_type == 'donation':
                self.requested_book.owner = self.requester
                self.requested_book.is_available = True
                self.requested_book.save()
            
            # --- Increment successful trades count for both users ---
            from django.db.models import F
            self.requester.successful_trades_count = F('successful_trades_count') + 1
            self.requester.save()
            self.requester.refresh_from_db()
            
            self.recipient.successful_trades_count = F('successful_trades_count') + 1
            self.recipient.save()
            self.recipient.refresh_from_db()
        
        super().save(*args, **kwargs)


class TradeMessage(models.Model):
    """Model for trade chat messages."""
    trade = models.ForeignKey(
        Trade,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='trade_messages'
    )
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'trade_messages'
        ordering = ['created_at']

    def __str__(self):
        return f"Message {self.id} in Trade {self.trade.id}" 