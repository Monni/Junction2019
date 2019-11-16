from paho.mqtt import publish
from paho.mqtt.client import MQTTv311, Client


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
