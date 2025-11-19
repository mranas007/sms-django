from django.urls import path
from apps.student.views.dashboard import StudentDashboard


app_name = 'student'

urlpatterns = [
    path('dashboard/', StudentDashboard.as_view(), name='dashboard'),
]