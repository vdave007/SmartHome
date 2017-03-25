#ifndef IEEPROM_H
#define IEEPROM_H

#include <stdint.h>

class IEeprom
{
public:
  virtual uint8_t read(uint16_t address) = 0;
  virtual void write(uint16_t address, const uint8_t data) = 0;
  virtual void write(uint16_t address, const uint8_t* data, uint8_t dataSize) = 0;

};

#endif
