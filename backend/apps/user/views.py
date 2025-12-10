from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator

from rest_framework import status
from rest_framework.generics import CreateAPIView, GenericAPIView, ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from core.tasks.send_create_critic_task import send_create_critic_task
from core.tasks.send_user_blocked_email_task import send_user_blocked_email_task
from core.tasks.send_user_delete_email_task import send_user_delete_email_task
from core.tasks.send_user_unblocked_email_task import send_user_unblocked_email_task
from drf_yasg.utils import swagger_auto_schema

from .filter import UserFilter
from .permissions import HasAdminOrSuperuserAccess, HasSuperuserAccess, IsOwnerOrAdmin
from .serializers import UserSerializer

UserModel = get_user_model()


class UserListView(ListAPIView):
    """
        get:
            get all users list
    """

    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    filterset_class = UserFilter
    permission_classes = [HasAdminOrSuperuserAccess]


@method_decorator(name='post',decorator=swagger_auto_schema(security=[]))
class UserCreateView(CreateAPIView):
    """
        post:
            create new user
    """

    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UserRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    """
        get:
            get user details by id
        put:
            update user details by id
        delete:
            delete user by id
    """

    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsOwnerOrAdmin]
    http_method_names = ['get', 'put', 'delete']

    def delete(self, request, *args, **kwargs):
        user = self.get_object()
        email = user.email
        name = user.profile.name
        send_user_delete_email_task.delay(email, name)
        self.perform_destroy(user)
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserBlockUnblockView(GenericAPIView):
    """
        patch:
            block or unblock user by id
    """
    permission_classes = [HasAdminOrSuperuserAccess]
    def get_serializer(self):
        return None

    def get_queryset(self):
        return UserModel.objects.all()

    def patch(self, request, pk):
        user = get_object_or_404(UserModel, pk=pk)
        action = request.data.get('action')

        if action not in ['block', 'unblock']:
            return Response({'error': 'Invalid action. Try "block" or "unblock".'}, status=400)

        if action == 'block' and request.user == user and  user.is_superuser:
            return Response({'error': 'Superuser can`t block themself.'}, status=403)


        user.is_active = action == 'unblock'
        user.status = 'active' if action == 'unblock' else 'blocked'
        user.save()

        #

        email = user.email
        name = user.profile.name
        if action == 'block':
            send_user_blocked_email_task.delay(email, name)
        else:
            send_user_unblocked_email_task.delay(email, name)

        return Response({'message': f'User {user.profile.name} was - {action}ed successfully', 'status': user.status})


class UserToCriticView(GenericAPIView):
    """
        patch:
            upgrade user to critic by id
    """

    permission_classes = [HasSuperuserAccess]
    serializer_class = UserSerializer

    def get_queryset(self):
        return UserModel.objects.all()

    def patch(self, request, pk):
        user = get_object_or_404(UserModel, pk=pk)

        if user.is_critic:
            return Response({'detail': 'User is already critic.'}, status=status.HTTP_400_BAD_REQUEST)

        user.is_critic = True
        user.save()

        email = user.email
        name = user.profile.name
        send_create_critic_task.delay(email, name)

        serializer = self.get_serializer(user)
        return Response({'message': f'User {user.profile.name} upgraded to critic.',
                         'user': serializer.data},
                        status=status.HTTP_200_OK)