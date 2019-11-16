from django.contrib.auth.models import User
from rest_framework import viewsets, renderers
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer

from kakkospakki.models import Job, Event, Image, HousingManager
from kakkospakki.serializers import JobSerializer, EventSerializer, ImageSerializer, HousingManagerSerializer, \
    UserSerializer


class JPEGRenderer(renderers.BaseRenderer):
    media_type = 'image/jpeg'
    format = 'jpg'
    charset = None
    render_style = 'binary'

    def render(self, data, media_type=None, renderer_context=None):
        return data


class JobView(viewsets.ModelViewSet):
    lookup_field = 'pk'
    serializer_class = JobSerializer
    queryset = Job.objects.all()


class ImageView(viewsets.ModelViewSet):
    renderer_classes = [JSONRenderer, BrowsableAPIRenderer, JPEGRenderer]
    lookup_field = 'pk'
    serializer_class = ImageSerializer
    queryset = Image.objects.all()


class EventView(viewsets.ModelViewSet):
    lookup_field = 'pk'
    serializer_class = EventSerializer
    queryset = Event.objects.all()


class UserView(viewsets.ModelViewSet):
    lookup_field = 'pk'
    serializer_class = UserSerializer
    queryset = User.objects.all()


class HousingManagerView(viewsets.ModelViewSet):
    lookup_field = 'pk'
    serializer_class = HousingManagerSerializer
    queryset = HousingManager.objects.all()
