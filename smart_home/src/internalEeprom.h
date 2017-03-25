#ifndef INTERNALEEPROM_H
#define INTERNALEEPROM_H

#include "IEeprom.h"

class InternalEeprom : public IEeprom
{
public:
  InternalEeprom();
  uint8_t read(uint16_t address) override;
  void write(uint16_t address, const uint8_t data) override;
  void write(uint16_t address, const uint8_t* data, uint8_t dataSize) override;
};

#endif
