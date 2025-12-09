from rest_framework import status
from rest_framework.generics import GenericAPIView, get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from core.services.email_service import EmailService
from core.services.jwt_service import ActivateToken, JWTService, RecoveryToken, SocketToken

from apps.auth.serializers import EmailSerializer, PasswordSerializer, UserRoleSerializer


class ActivateUserView(GenericAPIView):
    """
        patch:
            activate user with token
    """
    permission_classes = (AllowAny,)
    def get_serializer(self):
        return None

    def patch(self, *args, **kwargs):
        token = kwargs['token']
        user = JWTService.verify_token(token, ActivateToken)
        user.is_active = True
        user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data, status.HTTP_200_OK)

class RecoveryRequestView(GenericAPIView):
    """
        post:
            recovery request
    """
    permission_classes = (IsAuthenticated,)
    def get_serializer(self):
        return None

    def post(self, *args, **kwargs):
        data = self.request.data
        serializer = EmailSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = get_object_or_404(UserModel, email=serializer.data['email'])
        EmailService.recovery(user)
        return Response({'Details': 'Link was sent to email'}, status.HTTP_200_OK)

class RecoveryPasswordView(GenericAPIView):
    """
        post:
            recovery password and get token
    """
    permission_classes = (IsAuthenticated,)
    def get_serializer(self):
        return None

    def post(self, *args, **kwargs):
        data = self.request.data
        serializer = PasswordSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        token = kwargs['token']
        user = JWTService.verify_token(token, RecoveryToken)
        user.set_password(serializer.data['password'])
        user.save()
        # serializer = UserSerializer(user)
        return Response({'details': 'Password was changed successfully'}, status.HTTP_200_OK)

class SocketTokenView(GenericAPIView):
    """
        get:
            get socket token
    """
    permission_classes = (IsAuthenticated,)
    def get_serializer(self):
        return None

    def get(self, *args, **kwargs):
        token = JWTService.create_token(user=self.request.user, token_class=SocketToken)
        return Response({'token': str(token)}, status.HTTP_200_OK)

class UserRoleView(GenericAPIView):
    """
        get:
            returns user roles for frontend routing
    """
    permission_classes = [IsAuthenticated]
    def get_serializer(self):
        return None

    def get(self, request):
        user = request.user
        is_venue_owner = VenuesModel.objects.filter(user=user).exists()

        data = {
            'is_venue_owner': is_venue_owner,
            'is_staff': user.is_superuser,
            'is_user': user.is_active,
            'is_critic': user.is_critic
        }

        serializer = UserRoleSerializer(instance=data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)

