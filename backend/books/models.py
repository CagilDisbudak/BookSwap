from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Book(models.Model):
    """Book model for the BookSwap application."""
    CONDITION_CHOICES = [
        ('excellent', 'Excellent'),
        ('very_good', 'Very Good'),
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('poor', 'Poor'),
    ]

    GENRE_CHOICES = [
        ('fiction', 'Fiction'),
        ('non_fiction', 'Non-Fiction'),
        ('mystery', 'Mystery'),
        ('romance', 'Romance'),
        ('sci_fi', 'Science Fiction'),
        ('fantasy', 'Fantasy'),
        ('biography', 'Biography'),
        ('history', 'History'),
        ('science', 'Science'),
        ('technology', 'Technology'),
        ('self_help', 'Self-Help'),
        ('cookbook', 'Cookbook'),
        ('travel', 'Travel'),
        ('poetry', 'Poetry'),
        ('drama', 'Drama'),
        ('other', 'Other'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='books')
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    isbn = models.CharField(max_length=13, blank=True)
    publication = models.CharField(max_length=200, blank=True, help_text="Publisher name (optional)")
    genre = models.CharField(max_length=20, choices=GENRE_CHOICES, default='other')
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='good')
    description = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to='book_covers/', blank=True, null=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'books'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} by {self.author}"

    @property
    def owner_name(self):
        return f"{self.owner.first_name} {self.owner.last_name}" 