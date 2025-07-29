from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Extended User model with profile information."""
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    successful_trades_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.username

    @property
    def reliability_score(self):
        """Calculate reliability score based on successful trades."""
        if self.successful_trades_count == 0:
            return "New User"
        elif self.successful_trades_count < 5:
            return "Reliable"
        elif self.successful_trades_count < 10:
            return "Very Reliable"
        else:
            return "Highly Reliable" 