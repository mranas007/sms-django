from django.contrib import admin
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
admin.site.register(User, UserAdmin)