# Generated by Django 4.2.7 on 2025-07-28 10:24

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('author', models.CharField(max_length=200)),
                ('isbn', models.CharField(blank=True, max_length=13)),
                ('genre', models.CharField(choices=[('fiction', 'Fiction'), ('non_fiction', 'Non-Fiction'), ('mystery', 'Mystery'), ('romance', 'Romance'), ('sci_fi', 'Science Fiction'), ('fantasy', 'Fantasy'), ('biography', 'Biography'), ('history', 'History'), ('science', 'Science'), ('technology', 'Technology'), ('self_help', 'Self-Help'), ('cookbook', 'Cookbook'), ('travel', 'Travel'), ('poetry', 'Poetry'), ('drama', 'Drama'), ('other', 'Other')], default='other', max_length=20)),
                ('condition', models.CharField(choices=[('excellent', 'Excellent'), ('very_good', 'Very Good'), ('good', 'Good'), ('fair', 'Fair'), ('poor', 'Poor')], default='good', max_length=20)),
                ('description', models.TextField(blank=True)),
                ('cover_image', models.ImageField(blank=True, null=True, upload_to='book_covers/')),
                ('is_available', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'books',
                'ordering': ['-created_at'],
            },
        ),
    ]
