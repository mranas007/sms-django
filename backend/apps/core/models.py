from django.db import models
from apps.accounts.models import User
import uuid


class Subject(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

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


class Assignment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assignments_created')
    class_assigned = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='assignments_class')
    assignment_submissions = models.ManyToManyField(User, through='AssignmentSubmission', related_name='assignments_submitted')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='assignments')
    due_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
    

class AssignmentSubmission(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assignment_submissions')
    content = models.TextField()
    file_upload = models.FileField(upload_to='assignments/submissions/', null=True, blank=True)
    feedback = models.TextField(null=True, blank=True)
    grade = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-submitted_at']