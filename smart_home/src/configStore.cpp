#include "configStore.h"
#include "utils.h"

ConfigStore::ConfigStore(IEeprom* eeprom):
 _eeprom(eeprom)
{
 init();
}

void ConfigStore::init()
{
  //DEVICE ID
  memset(_buffer,0,64);

  _eeprom->read(EEPROM_DEVICE_ID.first,_buffer,EEPROM_DEVICE_ID.second);
  std::string tempString((char*)_buffer);
  if (tempString.empty())
  {
    tempString = "DEVICEHASNOIDYET";
  }
  _configMap[MAPID::DEVICE_ID] = tempString;

  //WIFI SSID
  memset(_buffer,0,64);
  _eeprom->read(EEPROM_WIFI_SSID.first,_buffer,EEPROM_WIFI_SSID.second);
  tempString = (char*)_buffer;
  if(tempString.empty())
  {
    tempString = WIFI_SSID;
  }
  _configMap[MAPID::WIFI_SSID] = tempString;

  //WIFI PASSWORD
  memset(_buffer,0,64);
  _eeprom->read(EEPROM_WIFI_PASSWORD.first,_buffer,EEPROM_WIFI_PASSWORD.second);
  tempString = (char*)_buffer;
  if(tempString.empty())
  {
    tempString = WIFI_PASSWORD;
  }
  _configMap[MAPID::WIFI_PASS] = tempString;

  //BACKEND ADDRESS
  memset(_buffer,0,64);
  _eeprom->read(EEPROM_BACKEND_IP.first,_buffer,EEPROM_BACKEND_IP.second);
  tempString = (char*)_buffer;
  if(tempString.empty())
  {
    tempString = BACKEND_SERVER_IP;
  }
  _configMap[MAPID::BACKEND_IP] = tempString;

  //BACKEND PORT
  memset(_buffer,0,64);
  _eeprom->read(EEPROM_BACKEND_PORT.first,_buffer,EEPROM_BACKEND_PORT.second);
  tempString = (char*)_buffer;
  if(tempString.empty())
  {
    tempString = numberToString(BACKEND_SERVER_PORT);
  }
  _configMap[MAPID::BACKEND_PORT] = tempString;

  //EEPROM_PAGE_SIZE
  memset(_buffer,0,64);
  _eeprom->read(EEPROM_CONFIG_PAGE_SIZE.first,_buffer,EEPROM_CONFIG_PAGE_SIZE.second);
  Serial.print("Config page length = "); Serial.println((char*)_buffer);
  tempString = (char*)_buffer;
  if(tempString.empty())
  {
    tempString="0";
  }
  _configMap[MAPID::CONFIG_PAGE_SIZE] = tempString;
}

std::string ConfigStore::get(MAPID mapId)
{
  if(_configMap.count(mapId))
  {
    return _configMap[mapId];
  }
  memset(_buffer,0,64);
  if(mapId == MAPID::CONFIG_PAGE)
  {
    Serial.print("Config page length = "); Serial.println(_configMap[MAPID::CONFIG_PAGE_SIZE].c_str());
    uint16_t address = EEPROM_CONFIG_PAGE.first;
    uint32_t length = atoi(_configMap[MAPID::CONFIG_PAGE_SIZE].c_str());
      uint32_t firstBit = 0;
      uint32_t lastBit = 32;
      std::string tempValue = "";
      while(firstBit!=lastBit)
      {
      Serial.print("Config page address = "); Serial.println(address + firstBit);
        memset(_buffer,0,64);
        _eeprom->read(address+firstBit,_buffer,lastBit-firstBit);
        tempValue+=(char*)_buffer;
        delay(25);
        firstBit=lastBit;
        lastBit+= ((length-lastBit)/32) ? 32 : (length-lastBit)%32;
      }
      _configMap[mapId] = tempValue;
      return tempValue;
  }
  return std::string("");
}


void ConfigStore::save(MAPID mapId, std::string value)
{
  memset(_buffer,0,32);
  _configMap[mapId] = value;
  uint16_t address;
  uint32_t length;
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
    
    case MAPID::BACKEND_IP:
    {
      address = EEPROM_BACKEND_IP.first;
      
      length = value.length();
      uint32_t firstBit = 0;
      uint32_t lastBit = 16;
      std::string tempValue;
      while(firstBit!=lastBit)
      {
        tempValue = value.substr(firstBit,lastBit-firstBit);
        Serial.print("Length of write = "); Serial.println(lastBit-firstBit);
        Serial.print("Writing value");Serial.println(tempValue.c_str());
        strcpy((char*)_buffer,tempValue.c_str());
        _eeprom->write(address+firstBit, _buffer, lastBit-firstBit);
        delay(15);
        firstBit=lastBit;
        lastBit+= ((length-lastBit)/16) ? 16 : (length-lastBit)%16;
      }
      return;
    }

    case MAPID::BACKEND_PORT:
    {
      address = EEPROM_BACKEND_PORT.first;
      length = EEPROM_BACKEND_PORT.second;
      break;
    }

    case MAPID::BACKEND_POST_API:
    {
      address = EEPROM_BACKEND_POST_API.first;
      length = EEPROM_BACKEND_POST_API.second;
      break;
    }

    case MAPID::CONFIG_PAGE_SIZE:
    {
      address = EEPROM_CONFIG_PAGE_SIZE.first;
      length = EEPROM_CONFIG_PAGE_SIZE.second;
      break;
    }
    case MAPID::CONFIG_PAGE:
    {
      address = EEPROM_CONFIG_PAGE.first;
      length = value.length();
      uint32_t firstBit = 0;
      uint32_t lastBit = 16;
      std::string tempValue;
      while(firstBit!=lastBit)
      {
        tempValue = value.substr(firstBit,lastBit-firstBit);
        Serial.print("Length of write = "); Serial.println(lastBit-firstBit);
        Serial.print("Writing value");Serial.println(tempValue.c_str());
        strcpy((char*)_buffer,tempValue.c_str());
        _eeprom->write(address+firstBit, _buffer, lastBit-firstBit);
        delay(15);
        firstBit=lastBit;
        lastBit+= ((length-lastBit)/16) ? 16 : (length-lastBit)%16;
      }
      return;
    }
  }
  value = value.substr(0,length);
  strcpy((char*)_buffer,value.c_str());
  _eeprom->write(address, _buffer, length);
  delay(100);

}
