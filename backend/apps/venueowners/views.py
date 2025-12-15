
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import GenericAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.tasks.send_owner_create_email_task import send_owner_create_email_task
from core.tasks.send_owner_deleted_email_task import send_owner_deleted_email_task

from .filter import OwnerFilter
from .models import VenueOwnerModel
from .permissions import IsAdminOrSuperuser, IsOwnerOrAdmin
from .serializers import OwnerSerializer


class OwnersListCreateView(ListCreateAPIView):
    """
        get:
            get all owners list
        post:
            create new owner
    """
    queryset = VenueOwnerModel.objects.filter(is_active=True)
    serializer_class = OwnerSerializer
    filterset_class = OwnerFilter
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [IsAdminOrSuperuser()]

    def perform_create(self, serializer):
        user = self.request.user

        # if hasattr(user, 'venue_owners'):
        #     raise ValidationError("You are already a owner!")
        #
        # owner = serializer.save(user=user)

        if user.is_superuser:
            # Superuser can create owner without user field
            serializer.save()  # ← no user needed
        else:
            if hasattr(user, 'venue_owners'):
                raise ValidationError("You are already a venue owner!")
            serializer.save(user=user)
            send_owner_create_email_task.delay(user.email, user.profile.name)

        # if not hasattr(owner, 'base_account'):
        #     BaseAccountModel.objects.create(owner=owner)





class OwnersRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    """
        get:
            get owner details by id
        delete:
            delete owner by id
    """

    queryset = VenueOwnerModel.objects.all()
    serializer_class = OwnerSerializer
    permission_classes = [IsOwnerOrAdmin]
    http_method_names = ['get', 'delete']

    def delete(self, request, *args, **kwargs):
        owner = self.get_object()

        admin_name = owner.user.email.split('@')[0]

        send_owner_deleted_email_task.delay(owner.user.email, owner.user.profile.name if not owner.user.is_superuser else admin_name)

        self.perform_destroy(owner)
        return Response(status=status.HTTP_204_NO_CONTENT)
