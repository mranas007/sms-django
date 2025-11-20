from django.contrib import admin
from apps.activity_log.utils import log_activity
from .models import Subject, Class, Assignment


# Register your models here.
class ClassAdmin(admin.ModelAdmin):
    list_display = ('name', 'get_subjects', 'get_teachers', 'academic_year', 'schedule')
    list_filter = ('subjects', 'teachers', 'academic_year')
    filter_horizontal = ('subjects', 'teachers')

    def get_subjects(self, obj):
        return ", ".join([s.name for s in obj.subjects.all()])
    get_subjects.short_description = 'Subjects'

    def get_teachers(self, obj):
        return ", ".join([t.username for t in obj.teachers.all()])
    get_teachers.short_description = 'Teachers'

    def save_model(self, request, obj, form, change):
        if change: # Object is being changed
            message = f"Class '{obj.name}' was updated."
            action_type = 'updated'
        else: # Object is being added
            message = f"Class '{obj.name}' was created."
            action_type = 'created'
        super().save_model(request, obj, form, change)
        log_activity(request.user, action_type, message, obj)

admin.site.register(Class, ClassAdmin)


class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    search_fields = ('name', 'code')
    ordering = ('name',)

    def save_model(self, request, obj, form, change):
        if change:
            message = f"Subject '{obj.name}' was updated."
            action_type = 'updated'
        else:
            message = f"Subject '{obj.name}' was created."
            action_type = 'created'
        super().save_model(request, obj, form, change)
        log_activity(request.user, action_type, message, obj)

admin.site.register(Subject, SubjectAdmin)


admin.site.register(Assignment)