#include "eepromInitializer.h"
#include "IEeprom.h"
#include "networkController.h"


EepromInitializer::EepromInitializer(IEeprom* eeprom, NetworkController* netController)
{

}


void EepromInitializer::initialize()
{
  std::string response = _netController->get("/getConfigurationPage");
  // Serial.println(response.c_str());
  //SAVE TO EEPROM!
  // _eeprom.write();
}
