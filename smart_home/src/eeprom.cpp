#include "eeprom.h"
#include <Wire.h>
#include "constants.h"

Eeprom::Eeprom(uint8_t deviceAddress):
  _deviceAddress(deviceAddress)
{
    Wire.begin(D2,D1);
    Serial.begin(115200);

}

uint8_t Eeprom::read(uint16_t address)
{
    uint8_t rdata = 0;
    Wire.beginTransmission(_deviceAddress);
    Wire.write((int)(address >> 8)); // MSB
    Wire.write((int)(address & 0xFF)); // LSB
    Wire.endTransmission();
    Wire.requestFrom((int)_deviceAddress,1);
    if (Wire.available()) rdata = Wire.read();
    return rdata;
}

void Eeprom::read(uint16_t address,uint8_t* data, uint8_t dataSize)
{
  Serial.print("EEPROM Read from - ");
  Serial.print(_deviceAddress);
  Serial.print(" - ");
  Serial.print(dataSize);
  Serial.print("amount of data");
  Serial.print("- :");
  uint8_t i = 0;
  Wire.beginTransmission(_deviceAddress);
  Wire.write((int)(address >> 8)); // MSB
  Wire.write((int)(address & 0xFF)); // LSB
  Wire.endTransmission();
  Wire.requestFrom(_deviceAddress,dataSize);

  while (Wire.available())
  {
    data[i] = Wire.read();
    Serial.print(".");
    ++i;
  }
  Serial.println(":EEPROM-READ-STOP!");
}

void Eeprom::write(uint16_t address, const uint8_t* data, uint8_t dataSize)
{
  Serial.println("WRITING TO EEPROM!");
    Wire.beginTransmission(_deviceAddress);
    Wire.write((int)(address >> 8)); // MSB
    Wire.write((int)(address & 0xFF)); // LSB
    for(uint8_t i = 0; (i < dataSize) && (i < I2C_MAX_LENGTH); ++i)
    {
      Wire.write(data[i]);
    }
    Wire.endTransmission();
}

void Eeprom::write(uint16_t address, const uint8_t data)
{
  Serial.println("WRITING TO EEPROM!");
    Wire.beginTransmission(_deviceAddress);
    Wire.write((int)(address >> 8)); // MSB
    Wire.write((int)(address & 0xFF)); // LSB
    Wire.write(data);
    Wire.endTransmission();
}
