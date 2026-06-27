from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    RegisterSerializer,
    ProfileSerializer,
    ChangePasswordSerializer,
    DeleteAccountSerializer
)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_object(self):
        return self.request.user
    
class ChangePasswordView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def put(self, request):

        serializer = ChangePasswordSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = request.user

        if not user.check_password(
            serializer.validated_data["old_password"]
        ):
            return Response(
                {
                    "error": "Senha atual incorreta."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(
            serializer.validated_data["new_password"]
        )

        user.save()

        return Response(
            {
                "message": "Senha alterada com sucesso."
            }
        )
    
class DeleteAccountView(generics.DestroyAPIView):

    serializer_class = DeleteAccountSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_object(self):
        return self.request.user

    def destroy(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = self.get_object()

        if not user.check_password(
            serializer.validated_data["password"]
        ):
            return Response(
                {
                    "error": "Senha incorreta."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user.delete()

        return Response(
            {
                "message": "Conta excluída com sucesso."
            }
        )