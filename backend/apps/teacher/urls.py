from django.urls import path
from .views.dashboard import TeacherDashboard

app_name = 'teacher'
urlpatterns = [
    
    path('dashboard/', TeacherDashboard.as_view(), name='dashboard'),
]