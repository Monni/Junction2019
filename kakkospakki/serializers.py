from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import serializers

from kakkospakki.models import Job, Event, Image, HousingManager, Feedback


class ImageUrlField(serializers.RelatedField):
    def to_representation(self, instance):
        url = settings.MEDIA_URL + str(instance.file)
        request = self.context.get('request', None)
        if request is not None:
            return request.build_absolute_uri(url)
        return url


class EventSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'


class JobSerializer(serializers.HyperlinkedModelSerializer):
    events = EventSerializer(many=True, read_only=True)
    images = ImageUrlField(many=True, read_only=True)
    feedback = serializers.HyperlinkedRelatedField(many=False, view_name='feedback-detail', read_only=True)
    status = serializers.ReadOnlyField()

    class Meta:
        model = Job
        fields = '__all__'


class ImageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Image
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


class FeedbackSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'
