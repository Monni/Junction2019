from django.contrib.auth.models import User

from django.db import models
from django.db.models import signals

from kakkospakki.signal import notify_event, notify_job, notify_feedback

HIGH = 2
NORMAL = 1
LOW = 0

JOB_PRIORITY_CHOICES = (
    (HIGH, "high"),
    (NORMAL, "normal"),
    (LOW, "low"),
)


FOREMAN = 'foreman'
PROJECT_MANAGER = 'project_manager'
WORKER = 'worker'
EMPLOYEE_ROLE_CHOICES = (
    (FOREMAN, 'foreman'),
    (PROJECT_MANAGER, 'project_manager'),
    (WORKER, 'worker'),
)


class Employee(models.Model):
    role = models.CharField(max_length=64, choices=EMPLOYEE_ROLE_CHOICES)
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=64, default='+358505330252')

    def __str__(self):
        return f"{self.role} {self.name} {self.phone_number}"


class HousingManager(models.Model):
    user = models.ForeignKey(User, related_name='housing_managers', on_delete=models.CASCADE, null=True)
    detail = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.detail}"


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
    housing_manager = models.ForeignKey(HousingManager, related_name='jobs', on_delete=models.PROTECT, null=True)
    employees = models.ManyToManyField(Employee, related_name='jobs', null=True, blank=True)

    @property
    def foreman(self):
        try:
            return self.employees.get(role=FOREMAN)
        except Employee.DoesNotExist:
            return None

    @property
    def project_manager(self):
        try:
            return self.employees.get(role=PROJECT_MANAGER)
        except Employee.DoesNotExist:
            return None

    @property
    def workers(self):
        return self.employees.filter(role=WORKER)

    @property
    def status(self):
        """
        Get current job status. Status is based on last event.
        If no events exist, status is 'received'
        """
        if not self.events.exists():
            return 'received'
        return self.events.last().status

    def __str__(self):
        return f"{self.address}. {self.user}, {JOB_PRIORITY_CHOICES[self.priority]} priority"


class Image(models.Model):
    """
    Image(s) attached to a job.
    """
    job = models.ForeignKey(Job, related_name='images', on_delete=models.CASCADE)
    file = models.ImageField(upload_to='images')


MAIN = 0
SUB = 1
EVENT_TYPE_CHOICES = (
    (MAIN, 'main'),
    (SUB, 'sub'),
)

APPROVED = 'approved'
IN_PROGRESS = 'in_progress'
ON_HOLD = 'on_hold'
FINISHED = 'finished'
EVENT_STATUS_CHOICES = (
    (APPROVED, 'approved'),
    (IN_PROGRESS, 'in progress'),
    (ON_HOLD, 'on hold'),
    (FINISHED, 'finished')
)


class Event(models.Model):
    """
    Events that happen on a job.
    """
    job = models.ForeignKey(Job, related_name='events', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    actor = models.CharField(max_length=64, null=True, blank=True)
    status = models.CharField(max_length=64, choices=EVENT_STATUS_CHOICES)
    type = models.IntegerField(choices=EVENT_TYPE_CHOICES, default=MAIN)


class Feedback(models.Model):
    job = models.OneToOneField(Job, related_name='feedback', on_delete=models.CASCADE)
    score = models.IntegerField()
    detail = models.TextField(null=True, blank=True)


signals.post_save.connect(receiver=notify_event, sender=Event)
signals.post_save.connect(receiver=notify_job, sender=Job)
signals.post_save.connect(receiver=notify_feedback, sender=Feedback)
