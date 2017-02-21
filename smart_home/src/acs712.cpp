#include "acs712.h"
#include "constants.h"
#include "Arduino.h"

Acs712::Acs712(uint8_t sensorNumber)
{
  _sensorNumber = sensorNumber;
  _defaultNull = 512;
  _samplingCount = 0;
  _samplingSum = 0;
}

void Acs712::setDefaultNull(uint16_t value)
{
  _defaultNull = value;
}

uint16_t Acs712::getValue()
{
  selectSensor();
  uint16_t readValue = analogRead(ANALOG_IN);
  return readValue;

}

uint8_t Acs712::getSensorNumber()
{
  return _sensorNumber;
}

float Acs712::getACRMS()
{
  selectSensor();
  _samplingCount = 0;
  _samplingSum = 0;
  uint16_t readValue;
  uint32_t start_time = millis();
  while((millis()-start_time) < SAMPLING_TIME)
  {
    readValue = analogRead(ANALOG_IN) - _defaultNull;
    _samplingSum += readValue * readValue;
    ++_samplingCount;
  }
  return (5.0 * sqrt(_samplingSum/_samplingCount) / 1024);
}

void Acs712::selectSensor()
{
  switch(_sensorNumber){
    case 0:
    {
      //OFF all
      digitalWrite(FIRST_MUX_PIN,0);
      digitalWrite(SECOND_MUX_PIN,0);
      digitalWrite(THIRD_MUX_PIN,0);
      break;
    }
    case 1:
    {
      //OFF
      digitalWrite(FIRST_MUX_PIN,0);
      digitalWrite(SECOND_MUX_PIN,0);
      digitalWrite(THIRD_MUX_PIN,1);
      break;
    }
    case 2:
    {
      //OFF all
      digitalWrite(FIRST_MUX_PIN,0);
      digitalWrite(SECOND_MUX_PIN,1);
      digitalWrite(THIRD_MUX_PIN,0);
      break;
    }
    case 3:
    {
      //OFF all
      digitalWrite(FIRST_MUX_PIN,0);
      digitalWrite(SECOND_MUX_PIN,1);
      digitalWrite(THIRD_MUX_PIN,1);
      break;
    }
    case 4:
    {
      //OFF all
      digitalWrite(FIRST_MUX_PIN,1);
      digitalWrite(SECOND_MUX_PIN,0);
      digitalWrite(THIRD_MUX_PIN,0);
      break;
    }
    case 5:
    {
      //OFF all
      digitalWrite(FIRST_MUX_PIN,1);
      digitalWrite(SECOND_MUX_PIN,0);
      digitalWrite(THIRD_MUX_PIN,1);
      break;
    }
    case 6:
    {
      //OFF all
      digitalWrite(FIRST_MUX_PIN,1);
      digitalWrite(SECOND_MUX_PIN,1);
      digitalWrite(THIRD_MUX_PIN,0);
      break;
    }
    case 7:
    {
      //OFF all
      digitalWrite(FIRST_MUX_PIN,1);
      digitalWrite(SECOND_MUX_PIN,1);
      digitalWrite(THIRD_MUX_PIN,1);
      break;
    }
    default:
    {
      Serial.println("ERROR");
      break;
    }
  }
}
