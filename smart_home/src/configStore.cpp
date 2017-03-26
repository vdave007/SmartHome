#include "configStore.h"

ConfigStore::ConfigStore(IEeprom* eeprom):
 _eeprom(eeprom)
{
 init();
}

void ConfigStore::init()
{
  uint8_t* tempData = new uint8_t[32];
  memset(tempData,0,32);

  uint8_t xx[] = "TEST123456789012";
  _eeprom->write(0, xx, 16);

  _eeprom->read(EEPROM_DEVICE_ID.first,tempData,EEPROM_DEVICE_ID.second);
  std::string tempString((char*)tempData);
  _configMap[MAPID::DEVICE_ID] = tempString;
  free(tempData);
}

std::string ConfigStore::get(MAPID mapId)
{
  return _configMap[mapId];
}


void ConfigStore::save(MAPID mapId, std::string value)
{
  _configMap[mapId] = value;
  //Implement saving to EEPROM
}
