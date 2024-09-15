from rest_framework import serializers
from .models import *

class ChatSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatSession
        field = ['session_id','session_title','created_at']


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        field = ['text','is_bot','m_created_at']
                