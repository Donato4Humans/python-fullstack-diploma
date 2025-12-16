
from django.db import transaction

from celery import shared_task

from apps.piyachok.models import MatchModel, PiyachokRequestModel


@shared_task
def find_matches_task():
    """
        Periodic task — finds compatible requests and creates matches
    """
    pending_requests = PiyachokRequestModel.objects.filter(status='pending').select_related('requester__profile')

    for req1 in pending_requests:
        # Find compatible requests
        compatible = pending_requests.exclude(requester=req1.requester).filter(
            # Gender match
            gender_preference__in=['A', req1.requester.profile.gender],
            # Budget ±30%
            budget__gte=req1.budget * 0.7,
            budget__lte=req1.budget * 1.3,
            # Who pays compatible
            who_pays__in=['split', req1.who_pays] if req1.who_pays != 'split' else ['me', 'them', 'split']
        )

        for req2 in compatible:
            # Avoid duplicate matches
            if MatchModel.objects.filter(
                request1__in=[req1, req2],
                request2__in=[req1, req2]
            ).exists():
                continue

            with transaction.atomic():
                match = MatchModel.objects.create(
                    request1=req1,
                    request2=req2,
                    suggested_venue=req1.preferred_venue or req2.preferred_venue
                )

                # Update both requests atomically
                PiyachokRequestModel.objects.filter(id__in=[req1.id, req2.id]).update(status='matched')

                # Optional: send notification/email