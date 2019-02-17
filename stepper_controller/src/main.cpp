/**
 * Blink
 *
 * Turns on an LED on for one second,
 * then off for one second, repeatedly.
 */
#include "Arduino.h"
#include <ESP8266WiFi.h>
#include <MQTT.h>
#include "ArduinoJson.h"

#include <AccelStepper.h>

#define MQTT_USER "iain"
#define MQTT_PASS "iain"
#define MQTT_HOST "iain.in"
#define SSID_NAME "ethdenverbotz"
#define SSID_PASSWORD "hackhackhack"

#define SPEED_MAX 1900
/*
#define ENA_L 7
#define ENA_R 10
#define DIR_L 8
#define DIR_R 5
#define STEP_L 9
#define STEP_R 6
*/
#define ENA_L 4 // PHYS: D2
#define ENA_R 5 // PHYS: D1
#define DIR_L 12 // PHYS: D6
#define DIR_R 13 // PHYS: D7
#define STEP_L 14 // PHYS: D5
#define STEP_R 16 // PHYS : D0
#define FAN_PIN 15 // PHYS: D8

//circumference of spool
#define spoolCirc 94.2

//steps per full rotation (number from https://github.com/robjampar/Stepper , never bothered to calculate it propery myself)
#define stepsPerRotation 400

//number of steps for each full rotation
#define stepsPerMM (stepsPerRotation/spoolCirc)



WiFiClient net;
MQTTClient client;

unsigned long lastMillis = 0;


// PinSTep, PinDiretion
AccelStepper s1(AccelStepper::DRIVER, STEP_L, DIR_L);
AccelStepper s2(AccelStepper::DRIVER, STEP_R, DIR_R);

void moveTo(float x, float y) {
  Serial.print("has coords: ");
  Serial.print(x*stepsPerMM);
  Serial.print(", ");
  Serial.print(y*stepsPerMM);
  Serial.println("");
  s1.move(x*stepsPerMM);
  s2.move(y*stepsPerMM);
  s1.setSpeed(SPEED_MAX);
  s2.setSpeed(SPEED_MAX);
}


void connect() {
  Serial.println("checking wifi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println("\nconnecting mqtt");
  while (!client.connect("arduino", MQTT_USER, MQTT_PASS)) {
    Serial.print("-");
    delay(1000);
  }
  Serial.println("\nconnected!");
  client.subscribe("/move");
  client.subscribe("/fan/on");
  client.subscribe("/fan/off");
  digitalWrite(LED_BUILTIN, HIGH);
}

void messageReceived(String &topic, String &payload) {
  Serial.println("Topic, Payload");
  Serial.println(topic);
  Serial.println(payload);
  if (topic.equals("/fan/on")) {
    digitalWrite(FAN_PIN, true);
  }
  if (topic.equals("/fan/off")) {
    digitalWrite(FAN_PIN, false);
  }
  if (topic.equals("/move")) {
    // TODO(iain): get reasonable size
    DynamicJsonBuffer jsonBuffer(500);
    JsonObject &root = jsonBuffer.parseObject(payload);
    moveTo(root["x"], root["y"]);
  }
}

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(FAN_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("INITIZ");
  WiFi.begin(SSID_NAME, SSID_PASSWORD);
  client.begin(MQTT_HOST, net);
  client.onMessage(messageReceived);
  connect(); 

  // initialize LED digital pin as an output.
  pinMode(LED_BUILTIN, OUTPUT);

  pinMode(ENA_L, OUTPUT);
  digitalWrite(ENA_L, LOW);
  pinMode(ENA_R, OUTPUT);
  digitalWrite(ENA_R, LOW);
  s1.setMaxSpeed(SPEED_MAX);
  s2.setMaxSpeed(SPEED_MAX);
}

bool isMoving = false;
void loop() {
  client.loop();
  if (s1.distanceToGo() != 0 || s2.distanceToGo() != 0) {
    isMoving = true;
  } else if (isMoving) {
    client.publish("/moving", "done");
    isMoving = false;
  }
  s1.runSpeedToPosition();
  s2.runSpeedToPosition();
  if (millis() - lastMillis > 1000) {
    if (!client.connected()) {
      digitalWrite(LED_BUILTIN, LOW);
      connect();
    }
    Serial.println("PING");
    lastMillis = millis();
    if (s1.isRunning()) {
      client.publish("/ping", "s1 running");
    } else {
      client.publish("/ping", "s1 not running");
    }
  }
}

