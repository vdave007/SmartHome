#include "configStore.h"

ConfigStore::ConfigStore(IEeprom* eeprom):
 _eeprom(eeprom)
{
 init();
}

void ConfigStore::init()
{
  memset(_buffer,0,32);

  _eeprom->read(EEPROM_DEVICE_ID.first,_buffer,EEPROM_DEVICE_ID.second);
  std::string tempString((char*)_buffer);
  if (tempString.empty())
  {
    tempString = "DEVICEHASNOIDYET";
    save(MAPID::DEVICE_ID,tempString);
  }
  _configMap[MAPID::DEVICE_ID] = tempString;
}

std::string ConfigStore::get(MAPID mapId)
{
  return _configMap[mapId];
}


void ConfigStore::save(MAPID mapId, std::string value)
{
  memset(_buffer,0,32);
  _configMap[mapId] = value;
  uint16_t address;
  uint8_t length;
  switch(mapId)
  {
    case MAPID::DEVICE_ID:
    {
      address = EEPROM_DEVICE_ID.first;
      length = EEPROM_DEVICE_ID.second;
      break;
    }

    case MAPID::WIFI_SSID:
    {
      address = EEPROM_WIFI_SSID.first;
      length = EEPROM_WIFI_SSID.second;
      break;
    }

    case MAPID::WIFI_PASS:
    {
      address = EEPROM_WIFI_PASSWORD.first;
      length = EEPROM_WIFI_PASSWORD.second;
      break;
    }
  }
  value = value.substr(0,length);
  strcpy((char*)_buffer,value.c_str());
  _eeprom->write(address, _buffer, length);
  delay(100);

}
