#ifndef EEPROM_H
#define EEPROM_H

#include "IEeprom.h"

class Eeprom : public IEeprom
{
public:
  Eeprom(uint8_t deviceAddress);
  uint8_t read(uint16_t address) override;
  void read(uint16_t address,uint8_t* data, uint8_t dataSize) override;
  void write(uint16_t address, const uint8_t data) override;
  void write(uint16_t address, const uint8_t* data, uint8_t dataSize) override;
private:
  uint8_t _deviceAddress;
};

#endif
