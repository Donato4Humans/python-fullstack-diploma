import uuid

from django.db import models

from rest_framework import status
from rest_framework.generics import GenericAPIView, ListAPIView, ListCreateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.tasks.piyachok_match_task import find_matches_task

from .models import MatchModel, PiyachokRequestModel
from .permissions import IsAdminOrSuperUser
from .serializers import MatchSerializer, PiyachokRequestSerializer


class PiyachokRequestListCreateView(ListCreateAPIView):
    """
        get:
            get all my requests
        post:
            create new request
    """
    serializer_class = PiyachokRequestSerializer
    http_method_names = ['get', 'post']
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PiyachokRequestModel.objects.filter(requester=self.request.user)

    def perform_create(self, serializer):
        serializer.save(requester=self.request.user)


class PiyachokRequestDetailView(RetrieveUpdateAPIView):
    """
        get:
            get my specific request
        put:
            update my request detail if pending
    """
    serializer_class = PiyachokRequestSerializer
    http_method_names = ['get', 'put']
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PiyachokRequestModel.objects.filter(requester=self.request.user)


class MyMatchesListView(ListAPIView):
    """
        get:
            get my matches
    """
    serializer_class = MatchSerializer
    http_method_names = ['get']
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return MatchModel.objects.filter(
            models.Q(request1__requester=user) | models.Q(request2__requester=user)
        ).select_related('request1', 'request2', 'suggested_venue')


class MatchAcceptView(RetrieveUpdateAPIView):
    """
        patch:
            accept match
    """
    serializer_class = MatchSerializer
    http_method_names = ['patch']
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return MatchModel.objects.filter(
            models.Q(request1__requester=user) | models.Q(request2__requester=user),
            is_accepted=False
        )

    def patch(self, request, *args, **kwargs):
        user = self.request.user
        match = self.get_object()
        if match.request1.requester != user and match.request2.requester != user:
            return Response({"detail": "Not your match"}, status=status.HTTP_403_FORBIDDEN)

        match.is_accepted = True

        # CREATE UNIQUE CHAT ROOM
        if not match.chat_room_id:
            match.chat_room_id = f"match_{match.id}_{uuid.uuid4().hex[:8]}"

        match.save()

        return Response({"detail": "Match accepted!", "chat_room": match.chat_room_id}, status=status.HTTP_200_OK)


class ActiveRequestsListView(ListAPIView):
    """
        get:
            get all active (pending) Piyachok requests
    """
    serializer_class = PiyachokRequestSerializer
    http_method_names = ['get']
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PiyachokRequestModel.objects.filter(
            status='pending',
            venue__is_active=True,
            venue__is_moderated=True
        ).select_related('requester__profile', 'preferred_venue')


class VenuePiyachokRequestsView(ListAPIView):
    """
        get:
            get list of all active Piyachok requests for specific venue
    """
    serializer_class = PiyachokRequestSerializer
    http_method_names = ['get']
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        venue_pk = self.kwargs['venue_pk']
        return PiyachokRequestModel.objects.filter(
            status='pending',
            preferred_venue_id=venue_pk,
            preferred_venue__is_active=True,
            preferred_venue__is_moderated=True
        ).select_related('requester__profile')

class JoinRequestView(GenericAPIView):
    """
        post:
            join someone else's request + instant match
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        user = request.user

        # Get the original request
        try:
            original_request = PiyachokRequestModel.objects.get(
                pk=pk,
                status='pending'
            )
        except PiyachokRequestModel.DoesNotExist:
            return Response(
                {"detail": "Request not found or no longer active"},
                status=status.HTTP_404_NOT_FOUND
            )

        if original_request.requester == user:
            return Response(
                {"detail": "You cannot join your own request"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create match
        match = MatchModel.objects.create(
            request1=original_request,
            request2=None,
            suggested_venue=original_request.preferred_venue,
            is_accepted=True
        )

        # Generate chat room
        import uuid
        match.chat_room_id = f"match_{match.id}_{uuid.uuid4().hex[:8]}"
        match.save()

        # mark original as matched
        original_request.status = 'matched'
        original_request.save()

        return Response({
            "detail": "You joined the request! Chat opened.",
            "chat_room": match.chat_room_id,
            "match_id": match.id
        }, status=status.HTTP_201_CREATED)

class RunMatchingView(APIView):
    permission_classes = [IsAdminOrSuperUser]

    def post(self, request):
        find_matches_task.delay()
        return Response({"detail": "Matching started"})