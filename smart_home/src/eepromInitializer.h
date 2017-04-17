#ifndef EEPROMINITIALIZER_H
#define EEPROMINITIALIZER_H

#include "constants.h"

class IEeprom;
class NetworkController;

class EepromInitializer
{
public:
  EepromInitializer(IEeprom* eeprom, NetworkController* netController);
  void initialize();

private:
  IEeprom* _eeprom;
  NetworkController* _netController;

};

#endif
