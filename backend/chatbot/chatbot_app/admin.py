from django.contrib import admin

# Register your models here.
from .models import ChatSession, Message

admin.site.register(ChatSession)
admin.site.register(Message)