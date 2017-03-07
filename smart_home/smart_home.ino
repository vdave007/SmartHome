#include <ESP8266WiFi.h>

int firstLed = 16;//GPIO16
int secondLed = 5;//GPIO5
int thirdLed = 4;//GPIO4
int rawValues[8];

const char* ssid = "BotNet";
const char* password = "ltdguitars";
char *message;

char server[] = "192.168.0.105";

WiFiClient client;


const int analogIn = A0;
int RawValue= 0;


void turnLeds(int value);

void setup() {
  
  Serial.begin(115200);
  pinMode(firstLed,OUTPUT);
  pinMode(secondLed,OUTPUT);
  pinMode(thirdLed,OUTPUT);
  delay(100);
  turnLeds(0);

   Serial.println();
   Serial.print("Connecting to ");
   Serial.println(ssid);
   WiFi.begin(ssid, password);
   while (WiFi.status() != WL_CONNECTED) {
     delay(500);
     Serial.print(".");
   }
   Serial.println("");
   Serial.println("WiFi connected");
  
}

void loop() {
  for(int i = 0; i<8;i++)
  {
    turnLeds(i);
    RawValue = analogRead(analogIn);
    rawValues[i] = RawValue;
    
    delay(100);
  }

  int avg = 0;
  for(int i = 0; i<8;i++)
  {
    avg+=rawValues[i];
    Serial.print(i);
    Serial.print(":");
    Serial.print(rawValues[i]);
    Serial.print(", ");
  }
  Serial.print(". AVG=");
  Serial.print(avg/8);
  Serial.print(" Current = ");
  Serial.println(abs(avg/8-517));
  turnLeds(0);
  delay(200);

  if (client.connect(server, 8081)) {
    Serial.println("connected to server");
    // Make a HTTP request:
    client.print("GET ");
    client.print("/saveRawData?cid=1337");
    client.print("&v1=");
    client.print(rawValues[0]);
    client.print("&v2=");
    client.print(rawValues[1]);
    client.print("&v3=");
    client.print(rawValues[2]);
    client.print("&v4=");
    client.print(rawValues[3]);
    client.println(" HTTP/1.1");
//    client.println("GET ?cid=1&v1=5&v2=3&v3=6&v4=10 HTTP/1.1");
    client.print("Host: ");
    client.print(server);
    client.println(":8081");
    client.println("Connection: close");
    client.println();
    
  }

  while (client.available()) {
    char c = client.read();
    Serial.write(c);
  }

  client.stop();
  }



void turnLeds(int value)
{
switch(value){
  case 0:
  {
    //OFF all
    digitalWrite(firstLed,0);
    digitalWrite(secondLed,0);
    digitalWrite(thirdLed,0);
    break;
  }
  case 1:
  {
    //OFF 
    digitalWrite(firstLed,0);
    digitalWrite(secondLed,0);
    digitalWrite(thirdLed,1);
    break;
  }
  case 2:
  {
    //OFF all
    digitalWrite(firstLed,0);
    digitalWrite(secondLed,1);
    digitalWrite(thirdLed,0);
    break;
  }
  case 3:
  {
    //OFF all
    digitalWrite(firstLed,0);
    digitalWrite(secondLed,1);
    digitalWrite(thirdLed,1);
    break;
  }
  case 4:
  {
    //OFF all
    digitalWrite(firstLed,1);
    digitalWrite(secondLed,0);
    digitalWrite(thirdLed,0);
    break;
  }
  case 5:
  {
    //OFF all
    digitalWrite(firstLed,1);
    digitalWrite(secondLed,0);
    digitalWrite(thirdLed,1);
    break;
  }
  case 6:
  {
    //OFF all
    digitalWrite(firstLed,1);
    digitalWrite(secondLed,1);
    digitalWrite(thirdLed,0);
    break;
  }
  case 7:
  {
    //OFF all
    digitalWrite(firstLed,1);
    digitalWrite(secondLed,1);
    digitalWrite(thirdLed,1);
    break;
  }
  default:
  {
    Serial.println("ERROR");
    break;
  }
}
}

