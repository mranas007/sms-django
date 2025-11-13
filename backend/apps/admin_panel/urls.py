from django.urls import path

from .views.dashboard_views import Dashboard
from .views.user_views import UserCR, UserRUD
from .views.subject_views import SubjectCR, SubjectRUD
from .views.class_views import ClassCR, ClassRUD
from .views.user_activities_view import UserActivitiesR



app_name = "admin_panel"
urlpatterns = [
    path('dashboard-stats/', Dashboard.as_view(), name='dashboard_stats'), # Read Stats
    # start from users and dashboard is complated...
    # User
    path('users/', UserCR.as_view(), name='users'),  # Read all, Create | filter: Role, Username
    path('user/<str:pk>/', UserRUD.as_view(), name='user'),  # Read one, Update, Delete

    # Subject
    path('subjects/', SubjectCR.as_view(), name='subjects'),  # Read all, Create | filter: Name
    path('subject/<str:pk>/', SubjectRUD.as_view(), name='subject'),  # Read one, Update, Delete 
    
    # Class
    path('classes/', ClassCR.as_view(), name='classes'),  # Read all, Create | filter: Name
    path('class/<str:pk>/', ClassRUD.as_view(), name='class'),  # Read one, Update, Delete

    path('activities/', UserActivitiesR.as_view(), name='classes'),  # Read all, Create | filter: Name
    # path('activities/<str:pk>/', UserActivitiesView.as_view(), name='class'),  # Read one, Update, Delete

]