#include "internalEeprom.h"
#include "EEPROM.h"

InternalEeprom::InternalEeprom()
{
  EEPROM.begin(512);
}

uint8_t InternalEeprom::read(uint16_t address)
{
  return EEPROM.read(address);
}

void InternalEeprom::read(uint16_t address,uint8_t* data, uint8_t dataSize)
{
  for(uint8_t i = 0; i < dataSize; ++i)
  {
    data[i] = read(address + i);
  }
}

void InternalEeprom::write(uint16_t address, const uint8_t data)
{
  EEPROM.put(address,data);
}

void InternalEeprom::write(uint16_t address, const uint8_t* data, uint8_t dataSize)
{
  for(int i=0;i<dataSize;++i)
  {
    EEPROM.put(address+i,data[i]);
  }
}
