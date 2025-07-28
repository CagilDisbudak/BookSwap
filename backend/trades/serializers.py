from rest_framework import serializers
from .models import Trade, TradeMessage
from books.serializers import BookSerializer
from users.serializers import UserProfileSerializer
from django.contrib.auth import get_user_model
from books.models import Book

User = get_user_model()


class TradeMessageSerializer(serializers.ModelSerializer):
    """Serializer for trade messages."""
    sender = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = TradeMessage
        fields = ['id', 'sender', 'message', 'created_at']
        read_only_fields = ['id', 'sender', 'created_at']


class TradeSerializer(serializers.ModelSerializer):
    """Serializer for Trade model."""
    requester = UserProfileSerializer(read_only=True)
    recipient = UserProfileSerializer(read_only=True)
    requested_book = BookSerializer(read_only=True)
    offered_book = BookSerializer(read_only=True)
    recipient_offered_book = BookSerializer(read_only=True)
    messages = TradeMessageSerializer(many=True, read_only=True)
    is_completed = serializers.ReadOnlyField()
    can_be_completed = serializers.ReadOnlyField()

    class Meta:
        model = Trade
        fields = [
            'id', 'requester', 'recipient', 'requested_book', 'offered_book',
            'recipient_offered_book', 'message', 'status', 'trade_type',
            'requester_confirmed', 'recipient_confirmed', 'is_completed',
            'can_be_completed', 'messages', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'requester', 'created_at', 'updated_at']


class TradeCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new trade."""
    recipient = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    requested_book = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all())
    offered_book = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all(), required=False, allow_null=True)
    
    class Meta:
        model = Trade
        fields = ['recipient', 'requested_book', 'offered_book', 'message']

    def validate(self, attrs):
        user = self.context['request'].user
        
        # Check if requested book belongs to recipient
        if attrs['requested_book'].owner != attrs['recipient']:
            raise serializers.ValidationError(
                "Requested book must belong to the recipient."
            )
        
        # Check if offered book belongs to requester (if provided)
        if attrs.get('offered_book') and attrs['offered_book'].owner != user:
            raise serializers.ValidationError(
                "Offered book must belong to you."
            )
        
        # Check if user is not trading with themselves
        if attrs['recipient'] == user:
            raise serializers.ValidationError(
                "Cannot trade with yourself."
            )
        
        return attrs

    def create(self, validated_data):
        validated_data['requester'] = self.context['request'].user
        return super().create(validated_data)


class TradeUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating trade status."""
    class Meta:
        model = Trade
        fields = ['status', 'recipient_offered_book', 'trade_type']

    def validate_status(self, value):
        """Validate status changes."""
        trade = self.instance
        user = self.context['request'].user
        
        # Only recipient can accept/reject
        if value in ['accepted', 'rejected'] and trade.recipient != user:
            raise serializers.ValidationError(
                "Only the recipient can accept or reject trades."
            )
        
        # Only requester can cancel
        if value == 'cancelled' and trade.requester != user:
            raise serializers.ValidationError(
                "Only the requester can cancel trades."
            )
        
        return value

    def validate_recipient_offered_book(self, value):
        """Validate recipient offered book."""
        trade = self.instance
        user = self.context['request'].user
        
        if value and value.owner != user:
            raise serializers.ValidationError(
                "You can only offer your own books."
            )
        
        return value

    def validate_trade_type(self, value):
        """Validate trade type."""
        trade = self.instance
        user = self.context['request'].user
        
        # Only recipient can set trade type
        if trade.recipient != user:
            raise serializers.ValidationError(
                "Only the recipient can set the trade type."
            )
        
        return value


class TradeAcceptanceSerializer(serializers.ModelSerializer):
    """Serializer for accepting trades with offered book or donation."""
    recipient_offered_book = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.none(),  # Will be set dynamically
        required=False, 
        allow_null=True
    )
    trade_type = serializers.ChoiceField(choices=Trade.TRADE_TYPE_CHOICES)

    class Meta:
        model = Trade
        fields = ['recipient_offered_book', 'trade_type']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Set the queryset to only include user's available books
        if 'request' in self.context:
            user = self.context['request'].user
            self.fields['recipient_offered_book'].queryset = Book.objects.filter(
                owner=user, 
                is_available=True
            )

    def validate_recipient_offered_book(self, value):
        """Validate recipient offered book."""
        if value is None:
            return value
            
        user = self.context['request'].user
        
        # Validate the book belongs to the user and is available
        if value.owner != user or not value.is_available:
            raise serializers.ValidationError(
                "You can only offer your own available books."
            )
        
        return value

    def validate(self, attrs):
        trade = self.instance
        user = self.context['request'].user
        
        if trade.recipient != user:
            raise serializers.ValidationError(
                "Only the recipient can accept trades."
            )
        
        if trade.status != 'pending':
            raise serializers.ValidationError(
                "Can only accept pending trades."
            )
        
        # Validate trade type and offered book
        trade_type = attrs.get('trade_type')
        offered_book = attrs.get('recipient_offered_book')
        
        if trade_type == 'swap' and not offered_book:
            raise serializers.ValidationError(
                "You must select a book to offer for a swap."
            )
        
        if trade_type == 'donation' and offered_book:
            raise serializers.ValidationError(
                "Cannot offer a book for a donation."
            )
        
        return attrs

    def update(self, instance, validated_data):
        instance.status = 'accepted'
        instance.trade_type = validated_data.get('trade_type', 'swap')
        instance.recipient_offered_book = validated_data.get('recipient_offered_book')
        
        # Mark books as unavailable
        instance.requested_book.is_available = False
        instance.requested_book.save()
        
        if instance.offered_book:
            instance.offered_book.is_available = False
            instance.offered_book.save()
        
        if instance.recipient_offered_book:
            instance.recipient_offered_book.is_available = False
            instance.recipient_offered_book.save()
        
        instance.save()
        return instance


class TradeConfirmationSerializer(serializers.ModelSerializer):
    """Serializer for confirming trade completion."""
    confirm_received = serializers.BooleanField(write_only=True)

    class Meta:
        model = Trade
        fields = ['confirm_received']

    def validate_confirm_received(self, value):
        if not value:
            raise serializers.ValidationError(
                "You must confirm that you received the book."
            )
        return value

    def update(self, instance, validated_data):
        user = self.context['request'].user
        
        # For donations, only the recipient can confirm
        if instance.trade_type == 'donation':
            if user != instance.recipient:
                raise serializers.ValidationError(
                    "Only the recipient can confirm donations."
                )
            instance.recipient_confirmed = True
        else:
            # For swaps, both parties can confirm
            if user == instance.requester:
                instance.requester_confirmed = True
            elif user == instance.recipient:
                instance.recipient_confirmed = True
            else:
                raise serializers.ValidationError(
                    "You can only confirm trades you are involved in."
                )
        
        instance.save()
        return instance


class TradeMessageCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating trade messages."""
    class Meta:
        model = TradeMessage
        fields = ['message']

    def validate_message(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "Message cannot be empty."
            )
        return value.strip()

    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        validated_data['trade'] = self.context['trade']
        return super().create(validated_data) 