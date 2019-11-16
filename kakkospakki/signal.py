import requests

from django.db.models.signals import post_save
from django.dispatch import receiver


def update_notify_job_update(sender, instance, **kwargs):
    # TODO notify only during update.
    pass


def notify_event(sender, instance, **kwargs):
    #Moose().notify_event(recipient=instance.job.contact_phone, instance=instance)
    pass


class Moose(object):

    def _send(self, recipient, msg):
        requests.post(
            'https://api.46elks.com/a1/sms',
            auth=('user', 'pass'),
            data={
                'from': 'Stara',
                'to': recipient,
                'message': msg,
            }
        )

    def notify_event(self, recipient, instance):
        msg = f"Työ {instance.job.pk}: {instance.description}"
        self._send(recipient, msg)
