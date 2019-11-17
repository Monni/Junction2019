from random import randint

import requests
from django.db.models import Count

from kakkospakki.client import MQTTClient, TwilightClient


def notify_feedback(sender, instance, **kwargs):
    MQTTClient().update()


def notify_job(sender, instance, created, **kwargs):
    if created:
        TwilightClient.send_new_job(job_id=instance.pk)
        if not instance.user:
            from django.contrib.auth.models import User
            instance.user = User.objects.first()
            instance.save()

    if not created:
        if instance.status == 'approved':
            if instance.foreman:
                TwilightClient().send(instance.foreman.phone_number, f"Job {instance.pk} assigned to you. Your role is foreman.")
            for employee in instance.workers:
                TwilightClient().send(employee.phone_number, f"Job {instance.pk} assigned to you. Your role is worker.")
        #TwilightClient().send(instance.contact_phone, "Job got updated. I'm a placeholder.")
    MQTTClient().update()


def random_employee(role):
    from kakkospakki.models import Employee
    count = Employee.objects.filter(role=role).aggregate(count=Count('pk'))['count']
    random_index = randint(0, count - 1)
    return Employee.objects.filter(role=role)[random_index]


def notify_event(sender, instance, **kwargs):
    MQTTClient().update()
    msg = f"Job {instance.job.pk}: {instance.description}"
    TwilightClient().send(instance.job.contact_phone, msg)

    if instance.type == 0: # Main event
        if instance.status == 'approved':
            instance.job.employees.add(random_employee('foreman'))
            instance.job.employees.add(random_employee('worker'))
            instance.job.save()
        elif instance.status == 'finished':
            TwilightClient.send_feedback(recipient=instance.job.contact_phone, job_id=instance.job.pk)
