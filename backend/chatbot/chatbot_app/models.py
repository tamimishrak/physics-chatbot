from django.db import models

# Create your models here.
class ChatSession(models.Model):
    session_id = models.CharField(max_length=255, unique=True)
    session_title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
  
class Message(models.Model):
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name="messages")
    text = models.TextField()
    is_bot = models.BooleanField(default=False)
    m_created_at = models.DateTimeField(auto_now_add=True)
    