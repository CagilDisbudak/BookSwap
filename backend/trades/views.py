from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Trade, TradeMessage
from .serializers import (
    TradeSerializer, TradeCreateSerializer, TradeUpdateSerializer,
    TradeAcceptanceSerializer, TradeConfirmationSerializer,
    TradeMessageCreateSerializer, TradeMessageSerializer
)
from django.db import models


class TradeViewSet(viewsets.ModelViewSet):
    """ViewSet for Trade model."""
    queryset = Trade.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'requester', 'recipient', 'trade_type']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return TradeCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return TradeUpdateSerializer
        elif self.action == 'accept_trade':
            return TradeAcceptanceSerializer
        elif self.action == 'confirm_trade':
            return TradeConfirmationSerializer
        return TradeSerializer

    def get_queryset(self):
        """Filter trades to show only user's trades."""
        user = self.request.user
        return Trade.objects.filter(
            models.Q(requester=user) | models.Q(recipient=user)
        )

    def perform_create(self, serializer):
        """Set the requester to the current user when creating a trade."""
        serializer.save(requester=self.request.user)

    def perform_update(self, serializer):
        """Handle trade status updates."""
        trade = self.get_object()
        new_status = serializer.validated_data.get('status')
        
        if new_status == 'accepted':
            # Mark books as unavailable
            trade.requested_book.is_available = False
            trade.requested_book.save()
            if trade.offered_book:
                trade.offered_book.is_available = False
                trade.offered_book.save()
        
        serializer.save()

    @action(detail=True, methods=['post'])
    def accept_trade(self, request, pk=None):
        """Accept a trade with offered book or donation."""
        trade = self.get_object()
        serializer = self.get_serializer(trade, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def confirm_trade(self, request, pk=None):
        """Confirm that user received the book."""
        trade = self.get_object()
        serializer = self.get_serializer(trade, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Trade confirmed successfully',
                'is_completed': trade.is_completed,
                'status': trade.status
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        """Get messages for a specific trade."""
        trade = self.get_object()
        messages = trade.messages.all()
        serializer = TradeMessageSerializer(messages, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        """Send a message in a trade."""
        trade = self.get_object()
        serializer = TradeMessageCreateSerializer(
            data=request.data,
            context={'request': request, 'trade': trade}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def sent_trades(self, request):
        """Get trades sent by current user."""
        trades = self.get_queryset().filter(requester=request.user)
        serializer = self.get_serializer(trades, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def received_trades(self, request):
        """Get trades received by current user."""
        trades = self.get_queryset().filter(recipient=request.user)
        serializer = self.get_serializer(trades, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def pending_trades(self, request):
        """Get pending trades for current user."""
        trades = self.get_queryset().filter(
            recipient=request.user,
            status='pending'
        )
        serializer = self.get_serializer(trades, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def completed_trades(self, request):
        """Get completed trades for current user."""
        trades = self.get_queryset().filter(
            models.Q(requester=request.user) | models.Q(recipient=request.user),
            status='completed'
        )
        serializer = self.get_serializer(trades, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def donations(self, request):
        """Get donation trades for current user."""
        trades = self.get_queryset().filter(
            models.Q(requester=request.user) | models.Q(recipient=request.user),
            trade_type='donation'
        )
        serializer = self.get_serializer(trades, many=True)
        return Response(serializer.data) 