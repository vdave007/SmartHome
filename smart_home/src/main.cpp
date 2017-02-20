#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <acs712.h>
#include <vector>
#include "constants.h"

std::vector<Acs712*> acsSensors;

void setup()
{
  Serial.begin(115200);


  acsSensors.push_back(new Acs712(0));
  acsSensors.push_back(new Acs712(1));
  acsSensors.push_back(new Acs712(2));
  acsSensors.push_back(new Acs712(3));

  pinMode(FIRST_MUX_PIN,OUTPUT);
  pinMode(SECOND_MUX_PIN,OUTPUT);
  pinMode(THIRD_MUX_PIN,OUTPUT);
  pinMode(INHIBIT_PIN,OUTPUT);
  delay(100);

  Serial.print("Connecting to ");
  Serial.println(WIFI_SSID.c_str());
  WiFi.begin(WIFI_SSID.c_str(), WIFI_PASSWORD.c_str());
  while (WiFi.status() != WL_CONNECTED) {
   delay(500);
   Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
}

void loop()
{
  for(std::vector<Acs712*>::iterator it = acsSensors.begin(); it != acsSensors.end(); ++it)
  {
    Acs712* current = *it;
    Serial.print(current->getSensorNumber());
    Serial.print(" - ");
    Serial.println(current->getValue());
    delay(100);
  }
}
