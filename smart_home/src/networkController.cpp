#include "networkController.h"
#include <Arduino.h>
#include <ESP8266WiFi.h>

NetworkController::NetworkController()
{
    
}

void NetworkController::connect(const std::string ssid, const std::string password)
{
    Serial.print("Connecting to ");
    Serial.println(ssid.c_str());
    WiFi.begin(ssid.c_str(),password.c_str());
    while (WiFi.status() != WL_CONNECTED) {
       delay(500);
       Serial.print(".");
    }
    Serial.println("");
    Serial.println("WiFi connected");
}