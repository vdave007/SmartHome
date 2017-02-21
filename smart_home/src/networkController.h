#ifndef NETWORKCONTROLLER_H
#define NETWORKCONTROLLER_H

#include <string>

class NetworkController
{
public:
  NetworkController();
  void connect(const std::string ssid, const std::string password);
  
};

#endif