#ifndef CONFIGSTORE_H
#define CONFIGSTORE_H

#include "IEeprom.h"
#include <string>
#include <map>
#include "constants.h"

/**
 * The ConfigStore class
 */
class ConfigStore
{
public:

  /**
   * The ConfigStore constructor
   * @param eeprom - A pointer to the eeprom interface
   */
  ConfigStore(IEeprom* eeprom);

public:

  /**
   * Gets the MAPID named value from the map or the eeprom
   * @param mapId - key of the value
   * @return std::string value
   */
  std::string get(MAPID mapId);

  /**
   * Saves the MAPID key - value combination
   * @param mapId - key of the value
   * @param value - the value
   */
  void save(MAPID mapId, std::string value);

private:
  /**
   * Initializes the configStore
   * Reads the needed values from the eeprom and sets the Map
   */
  void init();

private:

  /**
   * _configMap - A map that contains the Key-Value combinations of the configuration parameters
   */
  std::map<MAPID,std::string> _configMap;

  /**
   * _eeprom - pointer to eeprom
   */
  IEeprom* _eeprom;

  /**
   * _buffer - Buffer for reading from eeprom
   */
  uint8_t _buffer[64];

};

#endif
