import json
import requests
from paho.mqtt import publish
from paho.mqtt.client import MQTTv311
from twilio.rest import Client


class MQTTClient(object):
    MQTT_ADDRESS = 'broker.mqttdashboard.com'
    MQTT_PORT = 8000
    MQTT_TOPIC = 'muspellsheimr'

    def update(self):
        payload = 'update'
        publish.single(
            self.MQTT_TOPIC,
            payload=payload,
            qos=0,
            retain=False,
            hostname=self.MQTT_ADDRESS,
            port=self.MQTT_PORT,
            client_id="",
            keepalive=60,
            will=None,
            auth=None,
            tls=None,
            protocol=MQTTv311,
            transport='websockets'
        )


class TwilightClient(object):
    ACCOUNT_ID = 'pass'
    AUTH_TOKEN = 'Pass'
    SENDER = 'pass'

    def __init__(self):
        self.client = Client(self.ACCOUNT_ID, self.AUTH_TOKEN)

    def send(self, recipient, msg):
        self.client.messages.create(
            to=f"whatsapp:{recipient}",
            from_=f"whatsapp:{self.SENDER}",
            body=msg,
        )

    @staticmethod
    def send_feedback(recipient, job_id):
        headers = {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate',
            'Authorization': 'PASS',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Content-Length': '433',
            'Content-Type': 'application/x-www-form-urlencoded; boundary=--------------------------891385497753299850279213',
            'Host': 'studio.twilio.com',
            'Postman-Token': '1e10b1ec-1bcb-49f3-b03d-17869e2eda4c,fb937d36-dfe8-4c25-972f-d857807e106f',
            'User-Agent': 'PostmanRuntime/7.19.0',
            'cache-control': 'no-cache',
            'content-type': 'application/x-www-form-urlencoded; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
        }

        job_param = {"job": f"/api/jobs/{job_id}"}
        files = {
            'To': f'whatsapp:{recipient}',
            'From': 'whatsapp:+pass',
            'Parameters': json.dumps(job_param),
        }

        response = requests.post('https://studio.twilio.com/v1/Flows/FW17a64502646f9ae8569cfb7935a61f6c/Executions',
                                 headers=headers, data=files)
        print(response.content)

    @staticmethod
    def send_new_job(job_id):
        headers = {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate',
            'Authorization': 'Basic PASS==',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Content-Length': '433',
            'Content-Type': 'application/x-www-form-urlencoded; boundary=--------------------------891385497753299850279213',
            'Host': 'studio.twilio.com',
            'Postman-Token': '1e10b1ec-1bcb-49f3-b03d-17869e2eda4c,fb937d36-dfe8-4c25-972f-d857807e106f',
            'User-Agent': 'PostmanRuntime/7.19.0',
            'cache-control': 'no-cache',
            'content-type': 'application/x-www-form-urlencoded; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
        }

        job_param = {"job": f"/api/jobs/{job_id}", "approval": True}
        files = {
            'To': f'whatsapp:+PASS',
            'From': 'whatsapp:+PASS',
            'Parameters': json.dumps(job_param),
        }

        response = requests.post('https://studio.twilio.com/v1/Flows/FW17a64502646f9ae8569cfb7935a61f6c/Executions',
                                 headers=headers, data=files)
        print(response.content)
