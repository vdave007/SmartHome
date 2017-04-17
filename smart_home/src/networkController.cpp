#include "networkController.h"
#include "constants.h"
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include "configStore.h"

NetworkController::NetworkController(ConfigStore* configStore)
{
  _postApi = const_cast<char*>(BACKEND_POST_API);
  _host = const_cast<char*>(BACKEND_SERVER_IP);
  _hostPort = BACKEND_SERVER_PORT;

  std::string address("http://");
  address += BACKEND_SERVER_IP;
  address += ":";
  address += String(BACKEND_SERVER_PORT).c_str();
  address += BACKEND_POST_API;

  _reportAddress = address;

  _configStore = configStore;
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

bool NetworkController::report(int* data, uint8_t numberOfData)
{
  Serial.println("Starting report");
  HTTPClient http;
  std::string postString("cid=");

  // Serial.println(address.c_str());
  http.begin(_reportAddress.c_str()); //HTTP
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  postString += _configStore->get(MAPID::DEVICE_ID);
  for(uint8_t i=1; i<=numberOfData; ++i) // printing the datas
  {
    postString += "&v";
    postString += String(i).c_str();
    postString += "=";
    postString += String(*data).c_str();
    ++data;
  }
  http.POST(postString.c_str());
  http.end();

  Serial.println("Reporting complete");
}

std::string NetworkController::get(const std::string getAddress)
{
  std::string address("http://");
  address += BACKEND_SERVER_IP;
  address += ":";
  address += String(BACKEND_SERVER_PORT).c_str();
  address += getAddress;
  HTTPClient http;
  String payload;
  http.begin(address.c_str()); //HTTP
  int httpCode = http.GET();
   if(httpCode > 0)
   {
     if(httpCode == HTTP_CODE_OK)
     {
         payload = http.getString();
     }
   }
   else
   {
     payload = "GET FAILED!";
   }
   http.end();
   return std::string(payload.c_str());
}
