#include "acs712.h"
#include "constants.h"
#include "Arduino.h"

Acs712::Acs712(uint8_t sensorNumber)
{
  _sensorNumber = sensorNumber;
  _defaultNull = 506;
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

double Acs712::getACRMS()
{
  selectSensor();
  _samplingCount = 0;
  _samplingSum = 0;
  _samplingSum2 = 0;
  uint32_t readValue;
  uint32_t start_time = millis();
  Serial.println(analogRead(ANALOG_IN));
  // while((millis()-start_time) < SAMPLING_TIME)
  while(_samplingCount<2000)
  {
    readValue = abs(analogRead(ANALOG_IN));
    _samplingSum += readValue;
    _samplingSum2 += readValue * readValue;
    ++_samplingCount;
    // delay(1);
    delayMicroseconds(100);
  }
  Serial.print(_samplingCount);
  Serial.print(" -- ");
  Serial.println(int(_samplingSum/_samplingCount));

  return (30.0 * sqrt((_samplingSum2 - _samplingSum*_samplingSum/_samplingCount)/_samplingCount) / 512.0);
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
