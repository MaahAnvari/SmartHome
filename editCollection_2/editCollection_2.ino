#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <string.h>

#define LED  D6     // D6(gpio12)
#define LED2 D7     // D7(gpio13)
#define LED3 D8     // D8(gpio16)

#define BUTTON  D1  //D1(gpio5)
#define BUTTON2 D2  //D2(gpio4)
#define BUTTON3 D5  //D5(gpio14)

#define DEVICE_NAME           "d2"
#define INDEX                 "brightness"
#define COLLECTION            "devices"
#define CONTROLLER_UPDATE     "document"
#define CONTROLLER_SUBSCRIBE  "realtime"
#define ACTION_UPDATE         "update"
#define ACTION_SUBSCRIBE      "subscribe"
#define REFRESH               "wait_for"  

/*const char* ssid = "FARAZI";
const char* password = "123456789@@@";
const char* mqtt_server = "192.168.1.110";*/


/*const char* ssid = "FAZI";
const char* password = "12345678@@";
const char* mqtt_server = "192.168.1.3";*/

/*const char* ssid = "Farimaah";
const char* password = "maah93213025";
const char* mqtt_server = "172.20.10.5";*/

const char* ssid = "Anvari";
const char* password = "93213025";
const char* mqtt_server = "192.168.1.121";

/*const char* ssid = "fanavaran";
const char* password = "NaTa1300LKj#@";
const char* mqtt_server = "test.mosquitto.org";*/

WiFiClient espClient;
PubSubClient client(espClient);

int switchState = 0;      // actual read value from pin4
int oldSwitchState = 0;   // last read value from pin4
bool lightsOn = false; // is the switch on = 1 or off = 0

int switchState2 = 0; // actual read value from pin4
int oldSwitchState2 = 0; // last read value from pin4
bool lightsOn2 = false;

int switchState3 = 0; // actual read value from pin4
int oldSwitchState3 = 0; // last read value from pin4
bool lightsOn3 = false;

volatile long lastPush, lastPush2, lastPush3;
const int debounceDelay = 100;

int state  = -1;

int lastTimeToSetup = 0;
int lastTimeToConnect = 0;

String jwt = "";
int expireToken = millis() + 86400000;
const char msg_subscribe[] = "{\"index\":\"brightness\",\"collection\":\"devices\",\"controller\":\"realtime\","
              "\"action\":\"subscribe\",\"body\":{}}";

const char msg_login[] = "{\"controller\":\"auth\",\"action\":\"login\",\"strategy\":\"local\",\"expiresIn\":\"24h\",\"body\":{\"username\":\"d2\",\"password\":\"d2\"}}";

const char msg_createUser[] = "{\"controller\":\"security\",\"action\":\"createUser\",\"refresh\":\"wait_for\",\"_id\": \"d2\","
                                "\"body\": {\"content\": {\"profileIds\": [\"device\"]},"
                                "\"credentials\": {\"local\": {\"username\": \"d2\",\"password\": \"d2\"}}}}";
   
//---------------------------------------------- CREATE REQUEST -----------------------------------------
void create_request () {
  Serial.println("create request");
  StaticJsonBuffer<500> JSONbuffer;
  char jsonChar[500];
  JsonObject& JSONencoder = JSONbuffer.createObject();
  JSONencoder["index"] = INDEX;
  JSONencoder["collection"] = COLLECTION;
  JSONencoder["controller"] = CONTROLLER_UPDATE;
  JSONencoder["action"] = ACTION_UPDATE;
  JSONencoder["refresh"] = REFRESH;
  JSONencoder["_id"] = DEVICE_NAME;
  JSONencoder["jwt"] = jwt;
  JsonObject& body = JSONencoder.createNestedObject("body");
  JsonObject& deviceStatus = body.createNestedObject("deviceStatus");
  deviceStatus["c1"] = lightsOn;
  deviceStatus["c2"] = lightsOn2;
  deviceStatus["c3"] = lightsOn3;
  JSONencoder.printTo(jsonChar);
  client.publish("Kuzzle/request",jsonChar);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
//-----------------------------------------------SETUP WIFI --------------------------------------------
void setup_wifi() {

  delay(100);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  if (WiFi.status() != WL_CONNECTED) {
    delay(10000);
  }
  if(WiFi.status() == WL_CONNECTED) {
    randomSeed(micros());
    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    client.setServer(mqtt_server, 1883);
    client.setCallback(callback);
    reconnect();
  } else {
    lastTimeToSetup = millis();
    Serial.println("Failed to connect to the WiFi.");
    Serial.println("      Try again later");
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

//---------------------------------------------------- RECONNECT -----------------------------------------------------
void reconnect() {
  // Loop until we're reconnected
  if (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      int charcount;
      // ... and resubscribe
      //Serial.print("Publish subscribe message: ");
      //Serial.println(msg_subscribe);
      client.subscribe("Kuzzle/response");
      client.publish("Kuzzle/request",msg_createUser);
      Serial.println(msg_createUser);
      client.publish("Kuzzle/request",msg_login);
      Serial.println(msg_login);
      digitalWrite(BUILTIN_LED, LOW);
    } else {
      digitalWrite(BUILTIN_LED, HIGH);
      lastTimeToConnect = millis();
    }
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//----------------------------------------------- CALLBACK-----------------------------------------------

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived");
  bool channel[3];
  StaticJsonBuffer<1024> jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject((char *)payload);     // parsing the JSON object
  if (!root.success()) {
    Serial.println("parseObject() failed");
    return;
  }
  String device = root["result"]["_id"];
  root["controller"].printTo(Serial);
   Serial.println();
  if(root["controller"] == "auth") {
    if ( root["error"]["message"] != NULL ) {
      client.publish("Kuzzle/request",msg_createUser); 
    } else {
//      Serial.println("Login Succesfully");
      expireToken = root["result"]["expiresAt"];
      jwt = root["result"]["jwt"].as<String>();
//      Serial.println(jwt);
      client.publish("Kuzzle/request",msg_subscribe);
      client.subscribe("42e1d419bb39a8745b763b0a1113d4ce-7a90af8c8bdaac1b");        // subscribe from KUZZLE SUBSCRIBE CHANNLE
      create_request();
    }
  }else if (root["controller"] == "security") {
    Serial.println("create user");
    client.publish("Kuzzle/request",msg_login);
  }else if (root["controller"] == "document")  {
    Serial.println("controller document");
    channel[0] = root["result"]["_source"]["deviceStatus"]["c1"];
    channel[1] = root["result"]["_source"]["deviceStatus"]["c2"];
    channel[2] = root["result"]["_source"]["deviceStatus"]["c3"];
    
     if (device == DEVICE_NAME) {
      if (channel[0]) {
        digitalWrite(LED, HIGH);     // Turn the LED on
        lightsOn = true;
      } else if (!channel[0]){
        digitalWrite(LED, LOW);       // Turn the LED off
        lightsOn = false;
      }
      if (channel[1]) {
        digitalWrite(LED2, HIGH);     // Turn the LED on
        lightsOn2 = true;
      } else if( !channel[1]){
        digitalWrite(LED2, LOW);      // Turn the LED off
        lightsOn2 = false;
      }
      if (channel[2]) {
        digitalWrite(LED3, HIGH);     // Turn the LED on
        lightsOn3 = true;
      } else if( !channel[2] ){
        digitalWrite(LED3, LOW);      // Turn the LED off
        lightsOn3 = false;
      }
    }
  }  
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//------------------------------------------------------- SETUP -------------------------------------------------------------
void setup() {
  pinMode(BUILTIN_LED, OUTPUT);     // Initialize the BUILTIN_LED pin as an output 
  digitalWrite(BUILTIN_LED, HIGH);
  pinMode(BUTTON, INPUT);           // push button 
  pinMode(BUTTON2, INPUT);
  pinMode(BUTTON3, INPUT); 
 
  pinMode(LED, OUTPUT);             // anything you want to control using a switch e.g. a Led
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);

  attachInterrupt(BUTTON, onChange, CHANGE);
  attachInterrupt(BUTTON2, onChange2, CHANGE);
  attachInterrupt(BUTTON3, onChange3, CHANGE);
  
  Serial.begin(9600);
  setup_wifi();
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//------------------------------------------------------- LOOP ---------------------------------------------------------------
void loop() {

  if (WiFi.status() != WL_CONNECTED) {
    if ( millis() - lastTimeToSetup > 300000) {       // If the last attempt is longer than 5 minutes
      setup_wifi(); 
    }
  }
  else if (!client.connected()) {
    if ( millis() - lastTimeToConnect > 180000) {       // If the last attempt is longer than 3 minutes
      reconnect(); 
    }
  }
  if( millis() >= expireToken) {
      client.publish("Kuzzle/request",msg_login);
  }
  client.loop();
  if ( state  == 1 ) {
    create_request();
    state  = 0; 
  }
}

//------------------------------------------- ONCHANGE INTERUNPT FUNCTIONS -----------------------------------------------
void onChange() {
  int reading = digitalRead(BUTTON);
  if (reading == 1) lastPush = millis();
  if ( millis() - lastPush >  debounceDelay ) {
    lightsOn = !lightsOn;
    if(lightsOn) {
      digitalWrite(LED, HIGH);
      state = 1;
    } else {
       digitalWrite(LED, LOW);
       state = 1;
    }
    return;
 }
}
//--------------------------------------------------- 2 -------------------------------------------------------------------
void onChange2() {
  int reading = digitalRead(BUTTON2);
  if (reading == 1) lastPush2 = millis();
  if ( millis() - lastPush2 >  debounceDelay ) {
    lightsOn2 = !lightsOn2;
    if(lightsOn2) {
      digitalWrite(LED2, HIGH);
      state = 1;
    } else {
       digitalWrite(LED2, LOW);
       state = 1;
    }
    return; 
 } 
}
//--------------------------------------------------- 3 -------------------------------------------------------------------
void onChange3() {
  int reading = digitalRead(BUTTON3);
  if (reading == 1) lastPush3 = millis();
  if ( millis() - lastPush3 >  debounceDelay ) {
    lightsOn3 = !lightsOn3;
    if(lightsOn3) {
      digitalWrite(LED3, HIGH);
      state = 1;
    } else {
       digitalWrite(LED3, LOW);
       state = 1;
    }
    return;
 }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
