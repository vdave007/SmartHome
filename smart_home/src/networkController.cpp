#include "networkController.h"
#include "constants.h"
#include <Arduino.h>
#include <ESP8266WiFi.h>

NetworkController::NetworkController()
{
  _postApi = const_cast<char*>(BACKEND_POST_API);
  _host = const_cast<char*>(BACKEND_SERVER_IP);
  _hostPort = BACKEND_SERVER_PORT;
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

  WiFiClient client;
  if(client.connect(_host,_hostPort))
  {
      Serial.println("connected to server");

      client.print("GET "); //REWRITE TO POST!!!
      client.print(_postApi);
      client.print(1337); // ID HERE

      for(uint8_t i=1; i<=numberOfData; ++i) // printing the datas
      {
        client.print("&v");
        client.print(i);
        client.print("=");
        Serial.print(*data);
        client.print(*data);
        ++data;
      }

      client.println(" HTTP/1.1");
      client.print("Host: ");
      client.print(_host);
      client.print(":");
      client.println(_hostPort);
      client.println("Connection: close");
      client.println();

      client.stop();
  }

  Serial.println("Reporting complete");


}
