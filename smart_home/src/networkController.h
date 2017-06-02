#ifndef NETWORKCONTROLLER_H
#define NETWORKCONTROLLER_H

#include <string>
#include <ESP8266WebServer.h>

class ConfigStore;

/**
 * The NetworkController class
 */
class NetworkController
{
public:
  /**
   * Constructor
   * @param configStore - pointer to the configurationstore
   */
  NetworkController(ConfigStore* configStore);

  /**
   * Connects to the Wireless network
   * @param ssid - Name of the WiFi
   * @param password - Password of the WiFi
   */
  void connect(const std::string ssid, const std::string password);

  /**
   * Sends a report of the measured currents to the server
   * @param data - pointer to the array containing the measured data
   * @param numberOfData - length of the array
   * @return true if report ok / false if not
   */
  bool report(int* data, uint8_t numberOfData);

  /**
   * A Get request to the given addres(api) to the host server
   * Used to get configurations from the backend
   * @param getAddress - the api for the request
   * @return std::string - containing the repply
   */
  std::string get(const std::string getAddress);

  /**
   * Creates an access point if started in configuration mode
   * @param ssid - name of the access point
   * @param password - password of the access point
   */
  void createAccessPoint(const std::string ssid, const std::string password);

  /**
   * Handles the clients
   */
  void handleClient();

private:

  /**
   * Handles a request at the "/"
   * Returns configuration page
   */
  void handleConfigurationPage();

  /**
   * Handles a request at the "/config/setWifi"
   * Sets and writes the WiFi parameters to the configstore/eeprom
   */
  void handleSetWifiConfiguration();

  /**
   * Handles a request at the "/config/setBackend"
   * Sets and writes the backend parameters to the configstore/eeprom
   */
  void handleSetBackendConfiguration();

private:
  /**
   * The host address
   */
  char* _host;

  /**
   * The host port
   */
  std::uint32_t _hostPort;

  /**
   * The api where to report
   */
  char* _postApi;

  /**
   * The complete address containing where to report
   */
  std::string _reportAddress;

  ConfigStore* _configStore;
  ESP8266WebServer* _webServer;

};

#endif
