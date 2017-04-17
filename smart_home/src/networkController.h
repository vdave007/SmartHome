#ifndef NETWORKCONTROLLER_H
#define NETWORKCONTROLLER_H

#include <string>

class ConfigStore;

class NetworkController
{
public:
  NetworkController(ConfigStore* configStore);
  void connect(const std::string ssid, const std::string password);
  bool report(int* data, uint8_t numberOfData);
  std::string get(const std::string getAddress);

private:
  char* _host;
  std::uint32_t _hostPort;
  char* _postApi;
  std::string _reportAddress;

  ConfigStore* _configStore;

};

#endif
