from django.db import models
from apps.accounts.models import User
import uuid


class Subject(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return self.name
    
    
class Class(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100)
    subjects = models.ManyToManyField(Subject, blank=True, related_name='classes')
    teachers = models.ManyToManyField(User, blank=True, related_name='classes_as_teacher')
    students = models.ManyToManyField(User, blank=True, related_name='classes_as_student')
    academic_year = models.CharField(max_length=9)  # e.g., "2024-2025"
    schedule = models.CharField(max_length=100)  # e.g., "Mon/Wed 10:00-11:00"
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']