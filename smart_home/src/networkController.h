#ifndef NETWORKCONTROLLER_H
#define NETWORKCONTROLLER_H

#include <string>

class NetworkController
{
public:
  NetworkController();
  void connect(const std::string ssid, const std::string password);
  bool report(int* data, uint8_t numberOfData);

private:
  char* _host;
  std::uint32_t _hostPort;
  char* _postApi;

};

#endif
