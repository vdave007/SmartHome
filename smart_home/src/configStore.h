#ifndef CONFIGSTORE_H
#define CONFIGSTORE_H

#include "IEeprom.h"
#include <string>
#include <map>

enum class MAPID
{
  DEVICE_ID = 0,
  WIFI_SSID = 1,
  WIFI_PASS = 2
};

class ConfigStore
{
public:
  ConfigStore(IEeprom* eeprom);

private:
  void init();
  std::string get(MAPID mapId);
  void save(MAPID, std::string value);

private:
  std::map<MAPID,std::string> _configMap;

};

#endif
