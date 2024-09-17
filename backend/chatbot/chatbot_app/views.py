from rest_framework.views import APIView
from rest_framework.response import Response
from .models import ChatSession, Message
from .serializers import ChatSessionSerializer, MessageSerializer

# Create your views here.
class ChatSessionsView(APIView):
    def get(self, request):
        try:
            chat_sessions = ChatSession.objects.all()
            serializer = ChatSessionSerializer(chat_sessions, many=True)
            print(serializer.data)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class SingleSessionView(APIView):
    # getting a single session with an id
    def get(self, request, session_id):
        try:
            messages = Message.objects.filter(session__session_id = session_id)
            serializer = MessageSerializer(messages, many=True)
            print(serializer.data)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)