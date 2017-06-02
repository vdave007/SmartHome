#ifndef EEPROM_H
#define EEPROM_H

#include "IEeprom.h"

/**
 * The Eeprom class
 */
class Eeprom : public IEeprom
{
public:

   /**
   * Constructor
   * @param deviceAddress - address of the eeprom device
   */
  Eeprom(uint8_t deviceAddress);

public:
  /**
   * From IEeprom class
   */
  uint8_t read(uint16_t address) override;

  /**
   * From IEeprom class
   */
  void read(uint16_t address,uint8_t* data, uint8_t dataSize) override;

  /**
   * From IEeprom class
   */
  void write(uint16_t address, const uint8_t data) override;

  /**
   * From IEeprom class
   */
  void write(uint16_t address, const uint8_t* data, uint8_t dataSize) override;

private:
  /**
   * _deviceAddress - contains the eeprom address
   */
  uint8_t _deviceAddress;
};

#endif
