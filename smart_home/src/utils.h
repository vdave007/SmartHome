#ifndef MUTILS_H
#define MUTILS_H


/**
 * Converts a number to string
 * @param number - the number
 * @return std::string - the converted number
 */
static std::string numberToString(uint32_t number)
{
    char* convBuffer = new char(11);
    memset(convBuffer,0,11);
    itoa(number,convBuffer,10);

    std::string retString(convBuffer);
    delete convBuffer;

    return retString;
}

/**
 * Converts a string to a number
 * @param str - the string
 * @return uint32_t - the converted number
 */
static uint32_t stringToNumber(std::string str)
{
    return atoi(str.c_str());
}

#endif
