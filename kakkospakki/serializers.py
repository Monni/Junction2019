from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import serializers

from kakkospakki.models import Job, Event, Image, HousingManager, Feedback, Employee


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


class HousingManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = HousingManager
        fields = ('pk', 'user', 'detail')


class EmployeeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'


class FeedbackSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'


class JobSerializer(serializers.HyperlinkedModelSerializer):
    pk = serializers.CharField(read_only=True)
    events = EventSerializer(many=True, read_only=True)
    images = ImageUrlField(many=True, read_only=True)
    feedback = FeedbackSerializer(read_only=True)
    status = serializers.ReadOnlyField()
    housing_manager = serializers.HyperlinkedRelatedField(many=False, view_name='housingmanager-detail', queryset=HousingManager.objects)
    employees = EmployeeSerializer(many=True, read_only=True, required=False)
    user_first_name = serializers.CharField(source='user.first_name', read_only=True)
    user_last_name = serializers.CharField(source='user.last_name', read_only=True)

    class Meta:
        model = Job
        fields = '__all__'


class ImageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'


class UserSerializer(serializers.HyperlinkedModelSerializer):
    housing_managers = HousingManagerSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('pk', 'username', 'housing_managers', 'first_name', 'last_name')
