/*
  Mayi Space + Arduino
  --------------------
  El juego (en el navegador) habla con este programa por USB usando la Web Serial API.
  Mensajes de texto, uno por línea, a 9600 baudios:

    3:1   enciende el LED del pin 3        3:0   lo apaga
    4:1   enciende el LED del pin 4        4:0   lo apaga
    OFF   apaga todos los LEDs

  Cada comando recibido se responde con "OK <comando>". Al iniciar, los LEDs parpadean una vez y el Arduino envía "READY".
  Solo se aceptan los pines de la lista LED_PINS (por seguridad no se toca ningún otro pin).

  Conexión (cada LED): pin del Arduino -> resistencia de 220 ohmios -> pata larga (+) del LED,
  pata corta (-) del LED -> GND.
*/

const int LED_PINS[] = {3, 4};
const int LED_COUNT = sizeof(LED_PINS) / sizeof(LED_PINS[0]);

String line = "";

bool isAllowedPin(int pin) {
  for (int i = 0; i < LED_COUNT; i++) {
    if (LED_PINS[i] == pin) return true;
  }
  return false;
}

void allOff() {
  for (int i = 0; i < LED_COUNT; i++) digitalWrite(LED_PINS[i], LOW);
}

void handleCommand(String cmd) {
  cmd.trim();
  if (cmd.length() == 0) return;

  if (cmd == "OFF") {
    allOff();
    Serial.println("OK OFF");
    return;
  }

  int sep = cmd.indexOf(':');
  if (sep < 1) {
    Serial.println("ERR formato");
    return;
  }

  int pin = cmd.substring(0, sep).toInt();
  int state = cmd.substring(sep + 1).toInt();

  if (!isAllowedPin(pin)) {
    Serial.println("ERR pin");
    return;
  }

  digitalWrite(pin, state ? HIGH : LOW);
  Serial.print("OK ");
  Serial.println(cmd);
}

void setup() {
  Serial.begin(9600);
  for (int i = 0; i < LED_COUNT; i++) pinMode(LED_PINS[i], OUTPUT);
  allOff();
  // Prueba de arranque: cada LED parpadea una vez. Si no parpadean, el problema está en el cableado (resistencia, patas, GND o pin).
  for (int i = 0; i < LED_COUNT; i++) {
    digitalWrite(LED_PINS[i], HIGH);
    delay(250);
    digitalWrite(LED_PINS[i], LOW);
    delay(100);
  }
  Serial.println("READY");
}

void loop() {
  while (Serial.available() > 0) {
    char c = (char)Serial.read();
    if (c == '\n') {
      handleCommand(line);
      line = "";
    } else if (c != '\r' && line.length() < 16) {
      line += c;
    }
  }
}
