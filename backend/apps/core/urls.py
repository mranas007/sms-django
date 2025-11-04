from django.urls import path
from .views import GreetView

app_name = 'core'

urlpatterns = [
    path('', GreetView.as_view(), name='greet' ),
]