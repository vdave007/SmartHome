#ifndef IEEPROM_H
#define IEEPROM_H

#include <stdint.h>

/**
 * Interface for the Eeprom
 */
class IEeprom
{
public:
    
    /**
    * Reads a single byte from the given address
    * @param address - address from which to read
    * @return uint8_t - byte readed
    */
    virtual uint8_t read(uint16_t address) = 0;
    
    /**
     * Reads multiple bytes from the given address
     * @param address - address from which to read
     * @param data - a pointer to a uint8_t array where the data will be saved
     * @param dataSize - size of the data needed to be read
     */
    virtual void read(uint16_t address,uint8_t* data, uint8_t dataSize) = 0;
    
    /**
     * Write a single byte to the given address
     * @param address - address where to write
     * @param data - the value to write
     */
    virtual void write(uint16_t address, const uint8_t data) = 0;
    
    /**
     * Write multiple bytes to the given address
     * @param address - address from which to read
     * @param data - pointer to the array to write
     * @param dataSize - size of the array
     */
    virtual void write(uint16_t address, const uint8_t* data, uint8_t dataSize) = 0;
    
};

#endif
