#ifndef ACS712_H
#define ACS712_H


#include <Arduino.h>

/**
 * The ACS712 class
 * This class controlls the reading of the current sensor
 */
class Acs712
{
public:
    /**
   * Constructor
   * @param sensorNumber - The number for the sensor. Must be between 0-7
   */
  Acs712(uint8_t sensorNumber);

  /**
   * Gets the current value on the sensor
   * @return uint16_t - current value
   */
  uint16_t getValue();

  /**
   * Returns the number of the sensor
   */
  uint8_t getSensorNumber();

  /**
   * Samples and calculates the current consumption on the sensor.
   * It takes 2000 sample with 100microsecond delay between eachother
   * @return - double the current consumption in Ampers
   */
  double getACRMS();

private:

  /**
   * Selects the this sensor using the multiplexer
   */
  void selectSensor();

private:
  /**
   * _sensorNumber - This class's number
   */
  uint8_t _sensorNumber;
  /**
   * Values for sampling
   */
  uint64_t _samplingSum;
  uint64_t _samplingSum2;
  uint32_t _samplingCount;
};

#endif
