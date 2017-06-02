#include "networkController.h"
#include "constants.h"
#include "utils.h"
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

#include "configStore.h"

NetworkController::NetworkController(ConfigStore* configStore):
  _configStore(configStore),
  _webServer(new ESP8266WebServer(80))
{
  _postApi = const_cast<char*>(_configStore->get(MAPID::BACKEND_POST_API).c_str());
  _host = const_cast<char*>(_configStore->get(MAPID::BACKEND_IP).c_str());
  _hostPort = stringToNumber(_configStore->get(MAPID::BACKEND_PORT));

  std::string address("http://");
  address += BACKEND_SERVER_IP;
  address += ":";
  address += String(BACKEND_SERVER_PORT).c_str();
  address += BACKEND_POST_API;

  _reportAddress = address;
}

void NetworkController::connect(const std::string ssid, const std::string password)
{
    WiFi.softAPdisconnect(true);
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


void NetworkController::createAccessPoint(const std::string ssid, const std::string password)
{
  Serial.println("Configuring wireless access point");
  Serial.print("SSID = ");Serial.println(ssid.c_str());
  Serial.print("Password = ");Serial.println(password.c_str());
  WiFi.softAP(ssid.c_str(), password.c_str());
  IPAddress myIP = WiFi.softAPIP();
  Serial.print("AP IP address: ");Serial.println(myIP);
  _webServer->on("/",[&](){
    handleConfigurationPage();
  });

  _webServer->on("/config/setWifi",[&](){
    handleSetWifiConfiguration();
  });

  _webServer->on("/config/setBackend",[&](){
    handleSetBackendConfiguration();
  });

  _webServer->onNotFound([&](){
    _webServer->send(404,"text/html","NOT FOUND!");
  });

  _webServer->begin();
  Serial.println("Configuration server started!");
}

void NetworkController::handleClient()
{
  _webServer->handleClient();
}

void NetworkController::handleConfigurationPage()
{
  Serial.println("New request!");
  _webServer->send(200,"text/html", _configStore->get(MAPID::CONFIG_PAGE).c_str());
}

void NetworkController::handleSetWifiConfiguration()
{
  String message = "";

    if (_webServer->arg("wifissid")== "" || _webServer->arg("wifipassword") == "")
    {
      message += "Wifi SSID or password not set!";
      _webServer->send(404,"text/html",message);
    }
    else
    {
      Serial.print("Saving wifi SSID:");Serial.println(_webServer->arg("wifissid"));
      Serial.print("Saving wifi PASS:");Serial.println(_webServer->arg("wifipassword"));
      _configStore->save(MAPID::WIFI_SSID,_webServer->arg("wifissid").c_str());
      _configStore->save(MAPID::WIFI_PASS,_webServer->arg("wifipassword").c_str());
      _webServer->send(200,"text/html","<h1>Successfully set Wifi. \
      The change will take effect on the next reboot in normal mode \
      </h1> <a href=\"/\"><button>Back to config page</button></a>");
    }
}

void NetworkController::handleSetBackendConfiguration()
{
  String message = "";
  
  if (_webServer->arg("backendaddress")== "" || _webServer->arg("backendport") == "")
  {    
      message += "Backend adress or port not set!";
      _webServer->send(404,"text/html",message);
  }
  else
    {
      Serial.print("Saving Backend address:");Serial.println(_webServer->arg("backendaddress"));
      Serial.print("Saving Backend port:");Serial.println(_webServer->arg("backendport"));
      _configStore->save(MAPID::BACKEND_IP,_webServer->arg("backendaddress").c_str());
      _configStore->save(MAPID::BACKEND_PORT,_webServer->arg("backendport").c_str());
      _webServer->send(200,"text/html","<h1>Successfully set Backend. \
      The change will take effect on the next reboot in normal mode \
      </h1> <a href=\"/\"><button>Back to config page</button></a>");
    }
}