#ifndef ACS712_H
#define ACS712_H


#include <Arduino.h>

class Acs712
{
public:
  Acs712(uint8_t sensorNumber);
  void setDefaultNull(uint16_t value);
  uint16_t getValue();
  uint8_t getSensorNumber();
  double getACRMS();

private:
  void selectSensor();

private:
  uint16_t _defaultNull;
  uint8_t _sensorNumber;
  uint64_t _samplingSum;
  uint32_t _samplingCount;
};

#endif
