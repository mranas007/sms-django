from django.urls import path

from apps.teacher.views import assignments, classes, students, assignment_submission, chat_groups


app_name = 'teacher'

# APIs
urlpatterns = [
    # get all classes
    path('classes/', classes.TeacherClasses.as_view(), name='classes'),

    # Assignment 
    path('assignments/', assignments.AssignmentView.as_view(), name='assignments'),
    path('assignments/<uuid:assignment_id>/', assignments.AssignmentDetailView.as_view(), name='assignment_detail'),
    path('assignments/classes-subjects/', assignments.ClassesSubjectsView.as_view(), name='my_classes_subjects'),
    
    # Submited Assignments 
    path('assignments/submissions/', assignment_submission.StudentAssignments.as_view(), name='assignment_submissions'),
    path('assignments/submissions/<str:pk>/', assignment_submission.StudentAssignmentDetail.as_view(), name='assignment_submission_detail'),
  
    # Student 
    path('students/', students.StudentView.as_view(), name='student_list'),

    # Chat
    # path('chat-groups/', chat_groups.Groups.as_view(), name='chat_groups'),
    path('groups/', chat_groups.GroupListCreateView.as_view(), name='group-list-create'),
    path('groups/<int:pk>/', chat_groups.GroupRetrieveUpdateDestroyView.as_view(), name='group-retrieve-update-destroy'),
]