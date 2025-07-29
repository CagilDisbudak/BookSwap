from rest_framework import serializers
from .models import Book
from users.serializers import UserProfileSerializer


class BookSerializer(serializers.ModelSerializer):
    """Serializer for Book model."""
    owner = UserProfileSerializer(read_only=True)
    owner_name = serializers.CharField(read_only=True)

    class Meta:
        model = Book
        fields = [
            'id', 'owner', 'owner_name', 'title', 'author', 'isbn', 'publication', 'genre',
            'condition', 'description', 'cover_image', 'is_available',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']


class BookCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new book."""
    class Meta:
        model = Book
        fields = [
            'title', 'author', 'isbn', 'publication', 'genre', 'condition',
            'description', 'cover_image', 'is_available'
        ]

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)


class BookUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating a book."""
    class Meta:
        model = Book
        fields = [
            'title', 'author', 'isbn', 'publication', 'genre', 'condition',
            'description', 'cover_image', 'is_available'
        ] 