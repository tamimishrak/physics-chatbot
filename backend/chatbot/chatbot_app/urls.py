from django.urls import path
from .views import ChatSessionsView

urlpatterns = [
    path('sessions/', ChatSessionsView.as_view())
]