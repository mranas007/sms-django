from django.urls import path

from apps.teacher.views import assignments, dashboard


app_name = 'teacher'
urlpatterns = [
    
    path('dashboard/', dashboard.TeacherDashboard.as_view(), name='dashboard'),

    path('assignments/', assignments.AssignmentView.as_view(), name='assignments'),
    path('assignments/classes-subjects/', assignments.ClassesSubjectsView.as_view(), name='my_classes'),
]