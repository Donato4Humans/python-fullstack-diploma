from djangochannelsrestframework.decorators import action
from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from djangochannelsrestframework.observer import model_observer

from .models import NewsModel
from .serializers import NewsSerializer


class NewsConsumer(GenericAsyncAPIConsumer):
    def __init__(self, *args, **kwargs):
        self.group_name = 'news'
        super().__init__(*args, **kwargs)

    async def connect(self):
        # if not self.scope['user'].is_authenticated:
        #     await self.close()
        #     return
        await self.accept()
        await self.channel_layer.group_add(self.group_name, self.channel_name)

    @model_observer(NewsModel, serializer_class=NewsSerializer)
    async def news_activity(self, message, action, subscribing_request_ids, **kwargs):
        for request_id in subscribing_request_ids:
            await self.reply(data=message, action=action, request_id=request_id)

    @action()
    async def subscribe_to_news_model_changes(self, request_id, **kwargs):
        await self.news_activity.subscribe(request_id=request_id)