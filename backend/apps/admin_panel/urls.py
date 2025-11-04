from django.urls import path
from .views import CreateUserView,GetAllUsers, Dashboard

app_name = "admin_panel"
urlpatterns = [
    path("register/", CreateUserView.as_view(), name="register"),
    path('dashboard-stats/', Dashboard.as_view(), name='dashboard_stats'),
    path('getallusers/', GetAllUsers.as_view(), name='get_users'),
]