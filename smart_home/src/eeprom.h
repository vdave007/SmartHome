#ifndef EEPROM_H
#define EEPROM_H

#include <stdint.h>

class Eeprom
{
public:
  Eeprom(uint8_t deviceAddress);
  uint8_t read(uint16_t address);
  void write(uint16_t address, const uint8_t data);
  void write(uint16_t address, const uint8_t* data, uint8_t dataSize);
  
private:
  uint8_t _deviceAddress;
};

#endif