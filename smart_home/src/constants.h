#ifndef CONSTANTS_H
#define CONSTANTS_H

#include <Arduino.h>
#include <string>
#include <utility>

//GPIO PINS
const uint8_t FIRST_MUX_PIN = D0;//GPIO16 D0
const uint8_t SECOND_MUX_PIN = D3;//GPIO5 D3
const uint8_t THIRD_MUX_PIN = D4;//GPIO4 D4

const uint8_t SPI_CLK_PIN = D1;
const uint8_t SPI_SDL_PIN = D2;

const uint8_t CONFIGURATION_MODE_PIN = D5;

const uint8_t RED_LED_PIN = D6;
const uint8_t GREEN_LED_PIN = D7;


// const char BACKEND_SERVER_IP[] = "allamvizsga-akoszsebe.c9users.io";
const char BACKEND_SERVER_IP[] = "192.168.0.12";
const char BACKEND_POST_API[] = "/device/saveRawData";
const uint32_t BACKEND_SERVER_PORT = 8080;

// const std::string WIFI_SSID = "Big_Cats";
// const std::string WIFI_PASSWORD = "big cats gatekeeper";
const std::string WIFI_SSID = "UPC6252419";
const std::string WIFI_PASSWORD = "NUQMGGGB";


//Parameters for configuration mode
const std::string CONFIG_WIFI_SSID = "EFOSE_Configuration";
const std::string CONFIG_WIFI_PASSWORD = "efoseconfig";;

const uint8_t NUMBER_OF_SENSORS = 4;
const uint32_t SAMPLING_TIME = 500;
const uint32_t SAMPLING_TIME_UNIT = 800;

const int ANALOG_IN = A0;

const uint8_t I2C_MAX_LENGTH = 32;

/////////////////////////////////
/// CONFIG VALUES AND POSITIONS//
/////////////////////////////////

enum class MAPID
{
  DEVICE_ID = 0,
  WIFI_SSID = 1,
  WIFI_PASS = 2,
  BACKEND_IP = 3,
  BACKEND_PORT = 4,
  BACKEND_POST_API =5,
  CONFIG_PAGE_SIZE =6,
  CONFIG_PAGE = 7
};

//Address,length
const std::pair<uint16_t,uint8_t> EEPROM_DEVICE_ID(0x00,16);
const std::pair<uint16_t,uint8_t> EEPROM_WIFI_SSID(0x10,32);
const std::pair<uint16_t,uint8_t> EEPROM_WIFI_PASSWORD(0x30,32);
const std::pair<uint16_t,uint8_t> EEPROM_BACKEND_IP(0x50,60);
const std::pair<uint16_t,uint8_t> EEPROM_BACKEND_PORT(0x8C,4);
const std::pair<uint16_t,uint8_t> EEPROM_BACKEND_POST_API(0x90,32);

const std::pair<uint16_t,uint8_t> EEPROM_CONFIG_PAGE_SIZE(0x190,32);
const std::pair<uint16_t,uint8_t> EEPROM_CONFIG_PAGE(0x200,0);

#endif
