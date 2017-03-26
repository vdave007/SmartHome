#ifndef CONFIGSTORE_H
#define CONFIGSTORE_H

#include "IEeprom.h"
#include <string>
#include <map>
#include "constants.h"


class ConfigStore
{
public:
  ConfigStore(IEeprom* eeprom);

public:
  std::string get(MAPID mapId);
  void save(MAPID, std::string value);

private:
  void init();
private:
  std::map<MAPID,std::string> _configMap;
  IEeprom* _eeprom;

};

#endif
