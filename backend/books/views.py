from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Book
from .serializers import BookSerializer, BookCreateSerializer, BookUpdateSerializer


class BookViewSet(viewsets.ModelViewSet):
    """ViewSet for Book model."""
    queryset = Book.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['genre', 'condition', 'is_available', 'owner']
    search_fields = ['title', 'author', 'description']
    ordering_fields = ['created_at', 'title', 'author']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return BookCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return BookUpdateSerializer
        return BookSerializer

    def get_queryset(self):
        """Filter books based on user preferences."""
        queryset = super().get_queryset()
        
        # Filter by availability
        available_only = self.request.query_params.get('available', None)
        if available_only == 'true':
            queryset = queryset.filter(is_available=True)
        
        # Filter by owner (exclude user's own books if requested)
        exclude_own = self.request.query_params.get('exclude_own', None)
        if exclude_own == 'true':
            queryset = queryset.exclude(owner=self.request.user)
        
        return queryset

    def perform_create(self, serializer):
        """Set the owner to the current user when creating a book."""
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        """Ensure only the owner can update the book."""
        book = self.get_object()
        if book.owner != self.request.user:
            return Response(
                {'error': 'You can only update your own books.'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save()

    def perform_destroy(self, instance):
        """Ensure only the owner can delete the book."""
        if instance.owner != self.request.user:
            return Response(
                {'error': 'You can only delete your own books.'},
                status=status.HTTP_403_FORBIDDEN
            )
        instance.delete()

    @action(detail=False, methods=['get'])
    def my_books(self, request):
        """Get current user's books."""
        books = self.get_queryset().filter(owner=request.user)
        serializer = self.get_serializer(books, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def available_books(self, request):
        """Get all available books (excluding user's own)."""
        books = self.get_queryset().filter(
            is_available=True
        ).exclude(owner=request.user)
        serializer = self.get_serializer(books, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['delete'])
    def delete_image(self, request, pk=None):
        """Delete the cover image of a book."""
        book = self.get_object()
        
        # Check if user owns the book
        if book.owner != request.user:
            return Response(
                {'error': 'You can only delete images from your own books.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Delete the image file
        if book.cover_image:
            book.cover_image.delete(save=False)
            book.cover_image = None
            book.save()
            return Response({'message': 'Image deleted successfully'})
        else:
            return Response(
                {'error': 'No image to delete.'},
                status=status.HTTP_404_NOT_FOUND
            ) 