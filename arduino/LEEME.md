# Mayi Space + Arduino (2 LEDs)

El juego se conecta al Arduino **directamente desde el navegador**, por el cable USB, con la Web Serial API. No hace falta instalar ningún programa en el computador, solo cargar el sketch una vez en el Arduino.

## Qué hace

| Momento del juego | LED |
| --- | --- |
| **Planta de Reciclaje de Agua** respondida **bien** (pregunta 1) | se enciende el LED del **pin 3** |
| Planta de Reciclaje de Agua mal o sin tiempo | el LED del pin 3 se queda apagado |
| **Invernadero Espacial** respondido **bien** (pregunta 2) | se enciende el LED del **pin 4** |
| Invernadero Espacial mal o sin tiempo | el LED del pin 4 se queda apagado |
| Empezar una partida nueva ("Empezar de nuevo" o "Jugar otra vez") | los dos LEDs se apagan |

Cada LED va ligado a una **base**, no al turno: con el orden predeterminado el agua es la pregunta 1 y el invernadero la 2. Con el orden aleatorio, el LED se enciende cuando le toca a su base. Para cambiar un pin o ligar otra base, edita el campo `led` de esa pregunta en `questions.js` y `LED_PINS` en el sketch y en `game.js`.

## Conexión

Para cada LED: pin del Arduino → resistencia de 220 Ω → pata larga (+) del LED; pata corta (−) del LED → GND.

- LED 1: pin **3**
- LED 2: pin **4**

## Pasos

1. Abre `mayi_space_leds/mayi_space_leds.ino` en el IDE de Arduino y cárgalo en la placa (9600 baudios).
2. **Cierra el Monitor Serie del IDE** (solo un programa puede usar el puerto a la vez).
3. Abre el juego en **Chrome o Edge** de escritorio (Web Serial no existe en Firefox ni en Safari).
4. Pulsa el botón **Arduino** de la barra de arriba y elige el puerto de tu placa. El juego manda `OFF` y espera la respuesta `OK OFF`: si llega, el punto se pone **verde** y los LEDs parpadean uno por uno. Si no llega, el punto se pone **naranja** y sale un aviso.
5. Juega. Pulsa de nuevo el botón para desconectar.

Funciona abriendo `index.html` directamente, desde `localhost` o desde una página con `https`. El navegador pide permiso cada vez que se conecta.

## Mensajes que usa el juego

Texto, un mensaje por línea: `3:1` (enciende el pin 3), `3:0` (lo apaga), `4:1`, `4:0` y `OFF` (apaga todo). El Arduino responde `OK <mensaje>` y al iniciar envía `READY`.

## Si los LEDs no se encienden

Junto al botón Arduino hay dos círculos **3** y **4**: son los LEDs virtuales y se encienden aunque no haya placa. Úsalos para separar el problema:

- **Se encienden los círculos del juego pero no los LEDs reales** → el problema está en la conexión, el programa o el cableado (sigue la lista).
- **No se encienden ni los círculos** → responde la pregunta correcta de su base (agua = pin 3, invernadero = pin 4).

Lista de revisión, en orden:

1. Al cargar el sketch, los dos LEDs **parpadean una vez**. Si no parpadean, es el cableado: resistencia de 220 Ω, pata larga (+) hacia el pin, pata corta (−) a GND, y el pin correcto (3 y 4).
2. **Cierra el Monitor Serie** del IDE y cualquier otro programa que use el puerto (solo uno puede usarlo).
3. Pulsa el botón **Arduino** y elige el puerto correcto. Si el punto queda **naranja** ("Arduino sin respuesta"), el programa cargado no es `mayi_space_leds.ino` o la velocidad no es 9600.
4. Con el punto **verde**, pulsa el botón **💡** (probar los LEDs): deben encenderse uno por uno. Si lo hacen, la conexión está bien.
5. En el resultado de la pregunta del agua y del invernadero aparece "💡 LED del pin N encendido". Si sale un aviso de que el Arduino no confirmó el mensaje, revisa el cable.
