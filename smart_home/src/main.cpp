#include <Arduino.h>
#include <vector>
#include "acs712.h"
#include "networkController.h"
#include "constants.h"
#include <memory>


std::vector<std::unique_ptr<Acs712>> acsSensors;
std::unique_ptr<NetworkController> netController(new NetworkController());

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
  pinMode(INHIBIT_PIN,OUTPUT);
  delay(100);

  netController->connect(WIFI_SSID,WIFI_PASSWORD);

}

int dataToReport[4];

void loop()
{

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
}
