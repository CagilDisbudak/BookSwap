from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/profile/', views.profile, name='profile'),
    path('auth/profile/update/', views.update_profile, name='update_profile'),
] 