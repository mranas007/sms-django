from django.urls import path

from apps.teacher.views import assignments, dashboard, students, assignment_submission


app_name = 'teacher'

urlpatterns = [
    
    path('dashboard/', dashboard.TeacherDashboard.as_view(), name='dashboard'),

    # Assignment APIs
    path('assignments/', assignments.AssignmentView.as_view(), name='assignments'),
    path('assignments/<uuid:assignment_id>/', assignments.AssignmentDetailView.as_view(), name='assignment_detail'),
    path('assignments/classes-subjects/', assignments.ClassesSubjectsView.as_view(), name='my_classes_subjects'),
    
    # Submited Assignments APIs
    path('assignments/submissions/', assignment_submission.StudentAssignments.as_view(), name='assignment_submissions'),
    path('assignments/submissions/<str:pk>/', assignment_submission.StudentAssignmentDetail.as_view(), name='assignment_submission_detail'),
  
    # Student APIs
    path('students/', students.StudentView.as_view(), name='student_list'),
]