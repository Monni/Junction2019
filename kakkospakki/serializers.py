from django.contrib.auth.models import User
from rest_framework import serializers

from kakkospakki.models import Job, Event, Image, HousingManager


class JobSerializer(serializers.HyperlinkedModelSerializer):
    events = serializers.HyperlinkedRelatedField(many=True, read_only=True, view_name='event-detail')
    images = serializers.HyperlinkedRelatedField(many=True, view_name='image-detail', queryset=Image.objects)

    class Meta:
        model = Job
        fields = '__all__'


class ImageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'


class EventSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'


class UserSerializer(serializers.HyperlinkedModelSerializer):
    housing_managers = serializers.HyperlinkedRelatedField(many=True, view_name='housingmanager-detail',
                                                           queryset=HousingManager.objects)

    class Meta:
        model = User
        fields = ('pk', 'username', 'housing_managers',)


class HousingManagerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = HousingManager
        fields = '__all__'
