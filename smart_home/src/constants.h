#ifndef CONSTANTS_H
#define CONSTANTS_H

#include <Arduino.h>
#include <string>

const uint8_t FIRST_MUX_PIN = 16;//GPIO16
const uint8_t SECOND_MUX_PIN = 5;//GPIO5
const uint8_t THIRD_MUX_PIN = 4;//GPIO4
const uint8_t INHIBIT_PIN = 0;

const char BACKEND_SERVER_IP[] = "192.168.1.210";
const char BACKEND_POST_API[] = "/saveRawData?cid=";
const uint32_t BACKEND_SERVER_PORT = 8081;

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

#endif
