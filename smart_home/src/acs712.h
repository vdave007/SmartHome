#ifndef ACS712_H
#define ACS712_H


#include <Arduino.h>

class Acs712
{
public:
  Acs712(uint8_t sensorNumber);
  uint16_t getValue();
  uint8_t getSensorNumber();

private:
  void selectSensor();

private:
  uint8_t _sensorNumber;
};

#endif
