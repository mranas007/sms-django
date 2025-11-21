from django.urls import path

from apps.teacher.views import assignments, dashboard, students


app_name = 'teacher'
urlpatterns = [
    
    path('dashboard/', dashboard.TeacherDashboard.as_view(), name='dashboard'),

    path('assignments/', assignments.AssignmentView.as_view(), name='assignments'),
    path('assignments/<uuid:assignment_id>/', assignments.AssignmentDetailView.as_view(), name='assignment_detail'),
    path('assignments/classes-subjects/', assignments.ClassesSubjectsView.as_view(), name='my_classes'),

    path('students/', students.StudentView.as_view(), name='student_list'),
]