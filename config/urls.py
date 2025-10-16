from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('apps.core.urls')),
    path('student/', include('apps.student.urls')),
    path('teacher/', include('apps.teacher.urls')),
]
