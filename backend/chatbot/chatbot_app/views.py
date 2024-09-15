from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.
class ChatSessionsView(APIView):
    def get(self, request):
        return Response({"message": "list of all the sessions"}, status=200)
            