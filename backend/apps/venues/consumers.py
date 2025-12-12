from djangochannelsrestframework.decorators import action
from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from djangochannelsrestframework.observer import model_observer

from .models import VenueModel
from .serializers import VenueSerializer


class VenueConsumer(GenericAsyncAPIConsumer):
    def __init__(self, *args, **kwargs):
        self.group_name = 'venues'
        super().__init__(*args, **kwargs)


    async def connect(self):
        if not self.scope['user'].is_authenticated:
            await self.close()
            return

        await self.accept()
        await self.channel_layer.group_add(self.group_name, self.channel_name)

    @model_observer(VenueModel, serializer_class=VenueSerializer)
    async def venue_activity(self, message, action, subscribing_request_ids, **kwargs):
        for request_id in subscribing_request_ids:
            await self.reply(data=message, action=action, request_id=request_id)

    @action()
    async def subscribe_to_venue_model_changes(self, request_id, **kwargs):
        await self.venue_activity.subscribe(request_id=request_id)