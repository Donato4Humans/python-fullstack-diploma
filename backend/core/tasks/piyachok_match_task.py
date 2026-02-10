import logging

from django.db import models, transaction

from celery import shared_task

from apps.piyachok.models import MatchModel, PiyachokRequestModel

logger = logging.getLogger(__name__)

@shared_task
def find_matches_task():
    """
    Periodic task — finds compatible requests and creates matches
    """
    logger.info("Starting find_matches_task")

    # Get all pending requests with related profile
    pending_requests = list(
        PiyachokRequestModel.objects.filter(status='pending')
        .select_related('requester__profile')
        .order_by('id')  # Important for consistent ordering
    )

    if not pending_requests:
        logger.info("No pending requests found")
        return

    matched_request_ids = set()

    for i, req1 in enumerate(pending_requests):
        if req1.id in matched_request_ids:
            continue  # Skip if already matched

        # Build who_pays filter
        if req1.who_pays == 'split':
            who_pays_filter = models.Q(who_pays__in=['me', 'them', 'split'])
        else:
            who_pays_filter = models.Q(who_pays__in=['split', req1.who_pays])

        # Find compatible requests with higher ID (to avoid duplicates)
        compatible = [
            req2 for req2 in pending_requests[i+1:]  # Only later requests
            if req2.id not in matched_request_ids
            and req2.requester != req1.requester
            and req2.gender_preference in ['A', req1.requester.profile.gender]
            and req1.budget * 0.7 <= req2.budget <= req1.budget * 1.3
            and who_pays_filter.filter(who_pays=req2.who_pays).exists()
        ]

        if not compatible:
            continue

        # Take first compatible (or improve logic to find best match)
        req2 = compatible[0]

        with transaction.atomic():
            # Create match (always req1.id < req2.id)
            match = MatchModel.objects.create(
                request1=req1 if req1.id < req2.id else req2,
                request2=req2 if req1.id < req2.id else req1,
                suggested_venue=req1.preferred_venue or req2.preferred_venue
            )

            # Update both requests to matched
            PiyachokRequestModel.objects.filter(
                id__in=[req1.id, req2.id]
            ).update(status='matched')

            matched_request_ids.update([req1.id, req2.id])

            logger.info(f"Created match: {req1} ↔ {req2}")

    logger.info("find_matches_task completed")