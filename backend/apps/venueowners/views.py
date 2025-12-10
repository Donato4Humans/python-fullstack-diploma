
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

        if hasattr(user, 'venue_owners'):
            raise ValidationError("You are already a owner!")

        seller = serializer.save(user=user)

        # if not hasattr(seller, 'base_account'):
        #     BaseAccountModel.objects.create(seller=seller)

        send_owner_create_email_task.delay(user.email, user.profile.name)



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
        seller = self.get_object()
        email = seller.user.email
        name = seller.user.profile.name

        send_owner_deleted_email_task.delay(email, name)

        self.perform_destroy(seller)
        return Response(status=status.HTTP_204_NO_CONTENT)



# class PremiumAccountPurchaseApiView(GenericAPIView):
#     """
#         post:
#             buy premium account as seller
#     """
#     permission_classes = [IsAuthenticated]
#     def get_serializer(self):
#         return None
#
#     def post(self, request, *args, **kwargs):
#         seller = SellersModel.objects.filter(user=request.user).first()
#
#         if not seller:
#             return Response({'error': 'You are not a seller'}, status=status.HTTP_400_BAD_REQUEST)
#         if hasattr(seller, 'premium_account'):
#             return Response({'error': 'You already have premium account'}, status=status.HTTP_400_BAD_REQUEST)
#
#         premium_account = PremiumAccountModel.objects.create(seller=seller)
#         send_premium_activate_email_task(seller.user.email, seller.user.profile.name)
#
#         seller.base_account.delete()
#         seller.premium_account = premium_account
#         seller.save()
#
#         return Response({'message': 'Premium account activated successfully'}, status=status.HTTP_200_OK)