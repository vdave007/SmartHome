#ifndef CONSTANTS_H
#define CONSTANTS_H

#include <Arduino.h>
#include <string>
#include <utility>

const uint8_t FIRST_MUX_PIN = 16;//GPIO16 D1
const uint8_t SECOND_MUX_PIN = 0;//GPIO5 D3
const uint8_t THIRD_MUX_PIN = 2;//GPIO4 D4

// const char BACKEND_SERVER_IP[] = "allamvizsga-akoszsebe.c9users.io";
const char BACKEND_SERVER_IP[] = "192.168.1.210";
const char BACKEND_POST_API[] = "/saveRawData";
const uint32_t BACKEND_SERVER_PORT = 8080;

const std::string WIFI_SSID = "Big_Cats";
const std::string WIFI_PASSWORD = "big cats gatekeeper";

const uint8_t NUMBER_OF_SENSORS = 4;
const uint32_t SAMPLING_TIME = 500;
const uint32_t SAMPLING_TIME_UNIT = 800;
const float RMS_VPP = 0.3535534;
const float RMS_VP  = 0.7071068;
const uint16_t M_V_PER_AMP = 66;

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
const std::pair<uint16_t,uint8_t> EEPROM_DEVICE_ID(0,16);
const std::pair<uint16_t,uint8_t> EEPROM_WIFI_SSID(16,32);
const std::pair<uint16_t,uint8_t> EEPROM_WIFI_PASSWORD(48,32);


#endif
