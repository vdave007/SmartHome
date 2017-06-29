/**
  Energy
  Flow
  Observing
  Smart
  Equipment
  
  E.F.O.S.E
**/

//Set this to true if you want to download the configuration page and (optional) ID from the backend
#define FIRST_RUN false

#define REWRITE_CONFIG_PAGE false

//Set this to true ONLY if you want a new CID for the device
#define CHANGE_CID false

#include <Arduino.h>
#include <vector>
#include "eeprom.h"
#include "internalEeprom.h"
#include "acs712.h"
#include "networkController.h"
#include "constants.h"
#include "configStore.h"
#include <memory>
#include "utils.h"

bool startInConfigMode = false;

std::vector<std::unique_ptr<Acs712>> acsSensors;
std::unique_ptr<ConfigStore> configStore(new ConfigStore(new Eeprom(0x50)));
std::unique_ptr<NetworkController> netController(new NetworkController(configStore.get()));

void setup()
{
  Serial.begin(115200);

  acsSensors.push_back(std::unique_ptr<Acs712>(new Acs712(0)));
  acsSensors.push_back(std::unique_ptr<Acs712>(new Acs712(1)));
  acsSensors.push_back(std::unique_ptr<Acs712>(new Acs712(2)));
  acsSensors.push_back(std::unique_ptr<Acs712>(new Acs712(3)));

  pinMode(FIRST_MUX_PIN,OUTPUT);
  pinMode(SECOND_MUX_PIN,OUTPUT);
  pinMode(THIRD_MUX_PIN,OUTPUT);
  pinMode(CONFIGURATION_MODE_PIN,INPUT);
  pinMode(RED_LED_PIN,OUTPUT);
  pinMode(GREEN_LED_PIN,OUTPUT);
  delay(100);

  digitalWrite(RED_LED_PIN,HIGH);

  if(digitalRead(CONFIGURATION_MODE_PIN))
  {
    Serial.println("Starting configuration mode!");
    startInConfigMode = true;
    netController->createAccessPoint(CONFIG_WIFI_SSID,CONFIG_WIFI_PASSWORD);
  }
  else
  {
    Serial.println("Starting normal mode!");
    netController->connect(configStore->get(MAPID::WIFI_SSID),configStore->get(MAPID::WIFI_PASS));;
    digitalWrite(RED_LED_PIN,LOW);
    digitalWrite(GREEN_LED_PIN,HIGH);

    if(FIRST_RUN)
    {
      if(CHANGE_CID)
      {
        std::string configCid = netController->get("/device/getUniqueIdentifier").c_str();
        configStore->save(MAPID::DEVICE_ID,configCid);
      }

      if(REWRITE_CONFIG_PAGE)
      {
        std::string configurationPage = netController->get("/device/getConfigurationPage").c_str();

        configStore->save(MAPID::CONFIG_PAGE_SIZE,numberToString(configurationPage.length()));
        configStore->save(MAPID::CONFIG_PAGE,configurationPage);
      }
    }
    Serial.println();
  }

  


}

int dataToReport[4];

void normalMode()
{
  digitalWrite(GREEN_LED_PIN,HIGH);
  for(auto&& it = acsSensors.begin(); it != acsSensors.end(); ++it)
  {
    uint8_t num =(*it)->getSensorNumber();
    float acrms = (*it)->getACRMS();
    Serial.print(num);
    Serial.print(" - ");
    Serial.println(acrms);
    dataToReport[num] = acrms * 1000;
    delay(100);
  }
  netController->report(dataToReport,4);
  digitalWrite(GREEN_LED_PIN,LOW);
  delay(1000);
}

void configMode()
{
  netController->handleClient();
}

void loop()
{
  if(startInConfigMode)
  {
    configMode();
  }
  else
  {
    normalMode();
  }
}
