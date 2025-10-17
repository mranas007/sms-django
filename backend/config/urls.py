from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

routers = routers.DefaultRouter()

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('apps.accounts.api.urls')),
    path('api/students/', include('apps.student.api.urls')),
    path('api/teachers/', include('apps.teacher.api.urls')),
]
