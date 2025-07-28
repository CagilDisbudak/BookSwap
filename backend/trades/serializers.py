from rest_framework import serializers
from .models import Trade
from books.serializers import BookSerializer
from users.serializers import UserProfileSerializer


class TradeSerializer(serializers.ModelSerializer):
    """Serializer for Trade model."""
    requester = UserProfileSerializer(read_only=True)
    recipient = UserProfileSerializer(read_only=True)
    requested_book = BookSerializer(read_only=True)
    offered_book = BookSerializer(read_only=True)

    class Meta:
        model = Trade
        fields = [
            'id', 'requester', 'recipient', 'requested_book', 'offered_book',
            'message', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'requester', 'created_at', 'updated_at']


class TradeCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new trade."""
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
        fields = ['status']

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