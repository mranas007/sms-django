from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.accounts.models import User
from apps.core.models import Assignment, AssignmentSubmission, Subject, Class
from django.utils import timezone
import datetime

class GradesViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='student', password='password', is_student=True)
        self.other_user = User.objects.create_user(username='other', password='password', is_student=True)
        self.teacher = User.objects.create_user(username='teacher', password='password', is_teacher=True)
        
        self.subject = Subject.objects.create(name="Math", code="MATH101")
        self.class_obj = Class.objects.create(name="Class 1", academic_year="2024", schedule="Mon")
        
        self.assignment = Assignment.objects.create(
            title="Algebra HW",
            description="Solve equations",
            teacher=self.teacher,
            class_assigned=self.class_obj,
            subject=self.subject,
            due_date=timezone.now() + datetime.timedelta(days=1)
        )
        
        # Graded submission for the user
        self.submission = AssignmentSubmission.objects.create(
            assignment=self.assignment,
            student=self.user,
            content="My solution",
            grade=95.00
        )
        
        # Ungraded submission for the user
        self.ungraded_submission = AssignmentSubmission.objects.create(
            assignment=self.assignment,
            student=self.user,
            content="Pending solution"
        )
        # Manually clear grade for ungraded submission as create might default if model changed, 
        # but here we just didn't pass it.
        
        # Submission for another user
        self.other_submission = AssignmentSubmission.objects.create(
            assignment=self.assignment,
            student=self.other_user,
            content="Other solution",
            grade=80.00
        )

        self.url = reverse('student:student_grades')

    def test_get_grades_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1) # Should only see graded submission
        self.assertEqual(response.data[0]['id'], str(self.submission.id))
        self.assertEqual(response.data[0]['assignment_title'], "Algebra HW")
        self.assertEqual(response.data[0]['subject_name'], "Math")
        self.assertEqual(response.data[0]['subject_code'], "MATH101")

    def test_get_grades_unauthenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_grades_filtering(self):
        """Ensure only graded assignments are returned"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['grade'], '95.00')

    def test_get_grades_own_data(self):
        """Ensure user cannot see other students' grades"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        # Check that none of the returned IDs match the other user's submission
        submission_ids = [item['id'] for item in response.data]
        self.assertNotIn(str(self.other_submission.id), submission_ids)
