#ifndef CONSTANTS_H
#define CONSTANTS_H

#include <Arduino.h>
#include <string>
#include <utility>

const uint8_t FIRST_MUX_PIN = 16;//GPIO16 D0
const uint8_t SECOND_MUX_PIN = 0;//GPIO5 D3
const uint8_t THIRD_MUX_PIN = 2;//GPIO4 D4

const char BACKEND_SERVER_IP[] = "allamvizsga-akoszsebe.c9users.io";
// const char BACKEND_SERVER_IP[] = "192.168.0.25";
const char BACKEND_POST_API[] = "/saveRawData";
const uint32_t BACKEND_SERVER_PORT = 8080;

const std::string WIFI_SSID = "Big_Cats";
const std::string WIFI_PASSWORD = "big cats gatekeeper";
// const std::string WIFI_SSID = "UPC6252419";
// const std::string WIFI_PASSWORD = "NUQMGGGB";

const uint8_t NUMBER_OF_SENSORS = 4;
const uint32_t SAMPLING_TIME = 500;
const uint32_t SAMPLING_TIME_UNIT = 800;

const int ANALOG_IN = A0;

const uint8_t I2C_MAX_LENGTH = 30;

/////////////////////////////////
/// CONFIG VALUES AND POSITIONS//
/////////////////////////////////

enum class MAPID
{
  DEVICE_ID = 0,
  WIFI_SSID = 1,
  WIFI_PASS = 2
};

//Address,length
const std::pair<uint16_t,uint8_t> EEPROM_DEVICE_ID(0x00,16);
const std::pair<uint16_t,uint8_t> EEPROM_WIFI_SSID(0x10,32);
const std::pair<uint16_t,uint8_t> EEPROM_WIFI_PASSWORD(0x30,32);
const std::pair<uint16_t,uint8_t> EEPROM_BACKEND_IP(0x50,60);
const std::pair<uint16_t,uint8_t> EEPROM_BACKEND_PORT(0x8C,4);
const std::pair<uint16_t,uint8_t> EEPROM_BACKEND_POST_API(0x90,32);

const std::pair<uint16_t,uint8_t> EEPROM_CONFIG_PAGE_SIZE(0x200,32);


#endif
