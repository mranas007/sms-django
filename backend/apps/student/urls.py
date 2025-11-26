from django.urls import path
from apps.student.views import (
    dashboard,
    assignments,
    classes,
    assignment_submission,
    grades,
)


app_name = "student"

urlpatterns = [
    path("dashboard/", dashboard.StudentDashboard.as_view(), name="dashboard"),
    path("class/", classes.ClassDetail.as_view(), name="student_classes"),
    
    path(
        "assignments/grades/",
        grades.GradesView.as_view(),
        name="student_grades",
    ),

    path(
        "assignments/<str:pk>/",
        assignments.AssignmentDetailView.as_view(),
        name="assignments_detail",
    ),
    path("assignments/", assignments.AssignmentListView.as_view(), name="assignments"),

    path(
        "submissions/",
        assignment_submission.AssignmentSubmissionListCreateView.as_view(),
        name="assignment_submissions",
    ),
]
