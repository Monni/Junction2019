import requests

from kakkospakki.client import MQTTClient


def notify_job(sender, instance, created, **kwargs):
    if not created:
        # TODO do something
        pass
    MQTTClient().update()


def notify_event(sender, instance, **kwargs):
    #Moose().notify_event(recipient=instance.job.contact_phone, instance=instance)
    MQTTClient().update()


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
