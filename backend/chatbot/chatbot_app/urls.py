from django.urls import path
from .views import ChatSessionsView, SingleSessionView

urlpatterns = [
    path('sessions/', ChatSessionsView.as_view()),
    path('sessions/<str:session_id>/', SingleSessionView.as_view())
]