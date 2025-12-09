from django.urls import path

from apps.forbiddenwords.views import ForbiddenWordsCreateApiView, ForbiddenWordsUpdateRetrieveDestroyApiView

urlpatterns = [
    path('', ForbiddenWordsCreateApiView.as_view(), name='forbidden_word_create'),
    path('/<int:pk>', ForbiddenWordsUpdateRetrieveDestroyApiView.as_view(), name='forbidden_word_retrieve'),
]