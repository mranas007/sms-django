from django.contrib import admin
from .models import Subject, Class


# Register your models here.
class ClassAdmin(admin.ModelAdmin):
    list_display = ('name', 'get_subjects', 'get_teachers', 'academic_year', 'schedule')
    list_filter = ('subjects', 'teachers', 'academic_year')

    def get_subjects(self, obj):
        return ", ".join([s.name for s in obj.subjects.all()])
    get_subjects.short_description = 'Subjects'

    def get_teachers(self, obj):
        return ", ".join([t.username for t in obj.teachers.all()])
    get_teachers.short_description = 'Teachers'

admin.site.register(Class, ClassAdmin)

class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    search_fields = ('name', 'code')
    ordering = ('name',)
admin.site.register(Subject, SubjectAdmin)