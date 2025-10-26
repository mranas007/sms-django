from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/',  include('apps.core.urls')),
    path('api/account/',  include('apps.accounts.urls')),
    path('api/student/', include('apps.student.urls')),
    path('api/teacher/', include('apps.teacher.urls')),
]
