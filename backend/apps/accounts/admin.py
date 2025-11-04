from django.contrib import admin
from apps.activity_log.utils import log_activity
from .models import User

# Register your models here.
admin.site.site_header = "School Management System Admin"
admin.site.site_title = "School Management System Admin Portal"
admin.site.index_title = "Welcome to School Management System Admin Portal"

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'full_name', 'email', 'phone_number', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active')
    search_fields = ('username', 'full_name', 'email', 'phone_number')
    ordering = ('username',)

    def save_model(self, request, obj, form, change):
        if change:
            message = f"User '{obj.username}' was updated."
            action_type = 'updated'
        else:
            message = f"User '{obj.username}' was created."
            action_type = 'created'
        super().save_model(request, obj, form, change)
        log_activity(request.user, action_type, message, obj)

admin.site.register(User, UserAdmin)