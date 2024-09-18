from django.urls import path
from .views import ChatSessionsView, SingleSessionView

urlpatterns = [
    path('sessions/', ChatSessionsView.as_view(), name='chat_sessions'),
    path('sessions/<str:session_id>/', SingleSessionView.as_view(), name='single_session')
]