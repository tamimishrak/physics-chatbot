from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.
class ChatSessionsView(APIView):
    def get(self, request):
        return Response({"message": "list of all the sessions"}, status=200)

class SingleSessionView(APIView):
    def get(self, request, session_id) :
        session_id = 1123123
        return Response({"message": session_id}, status=200)     