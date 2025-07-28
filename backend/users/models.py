from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Extended User model with profile information."""
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.username 