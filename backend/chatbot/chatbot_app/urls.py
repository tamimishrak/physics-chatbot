from django.urls import path, include
from .views import ChatSessionsView, SingleSessionView, CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('sessions/', ChatSessionsView.as_view(), name='chat_sessions'),
    path('sessions/<str:session_id>/', SingleSessionView.as_view(), name='single_session'),
    path('user/register/', CreateUserView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('api-auth/', include('rest_framework.urls')) 
]