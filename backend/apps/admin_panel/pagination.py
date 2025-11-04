from rest_framework.pagination import PageNumberPagination

class UserPagination(PageNumberPagination):
    page_size = 10  # Default items per page
    page_size_query_param = 'page_size'  # Allow frontend to override (optional)
    max_page_size = 100  # Limit maximum per page
