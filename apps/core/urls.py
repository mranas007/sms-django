from django.urls import path
from .views import index


app_name = 'core'

urlpatterns = [
    path('', index, name='index'),

    path('login', index, name='login'),
    path('register', index, name='register'),
    path('logout', index, name='logout'),
]