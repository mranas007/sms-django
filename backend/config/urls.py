from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('api/',  include('apps.core.urls')),
    path('api/admin/', include('apps.admin_panel.urls')),
    path('api/account/',  include('apps.accounts.urls')),
    path('api/student/', include('apps.student.urls')),
    path('api/teacher/', include('apps.teacher.urls')),
    path('api/activity-log/', include('apps.activity_log.urls')),
    path('api/chat/', include('apps.chat.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)