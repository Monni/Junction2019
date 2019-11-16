from django.contrib.auth.models import User

from django.db import models
from django.db.models import signals

from kakkospakki.signal import notify_event

HIGH = 2
NORMAL = 1
LOW = 0

JOB_PRIORITY_CHOICES = (
    (HIGH, "high"),
    (NORMAL, "normal"),
    (LOW, "low"),
)


class Job(models.Model):
    """
    Ordered Job.
    """
    user = models.ForeignKey(User, related_name='jobs', on_delete=models.PROTECT, null=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    description = models.CharField(max_length=255, null=True, blank=True)
    priority = models.IntegerField(choices=JOB_PRIORITY_CHOICES, default=NORMAL)
    created_at = models.DateTimeField(auto_now_add=True)
    contact_phone = models.CharField(null=True, blank=True, max_length=64)
    building_object_id = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.building_object_id}. {self.user}, {JOB_PRIORITY_CHOICES[self.priority]} priority"


class Image(models.Model):
    """
    Image(s) attached to a job.
    """
    job = models.ForeignKey(Job, related_name='images', on_delete=models.CASCADE)
    file = models.ImageField(upload_to='images')


class Event(models.Model):
    """
    Events that happen on a job.
    """
    job = models.ForeignKey(Job, related_name='events', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    actor = models.CharField(max_length=64, null=True, blank=True)


class HousingManager(models.Model):
    user = models.ForeignKey(User, related_name='housing_managers', on_delete=models.CASCADE)
    detail = models.TextField(null=True, blank=True)

signals.post_save.connect(receiver=notify_event, sender=Event)
