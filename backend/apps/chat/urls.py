from django.urls import path
from .views import GroupListCreateView, GroupRetrieveUpdateDestroyView

app_name = 'chat'
urlpatterns = [
    # path('groups/', GroupListCreateView.as_view(), name='group-list-create'),
    # path('groups/<int:pk>/', GroupRetrieveUpdateDestroyView.as_view(), name='group-retrieve-update-destroy'),
]