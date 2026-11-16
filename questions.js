// Banco de preguntas: Junior Astronaut Mission Trainer (NASA Space Apps 2026).
// Cada sala compara la Tierra con el Espacio y se apoya en un estudio real de NASA OSDR.
// Las 7 salas con "art" son las del plano dibujado (assets/rooms) y son las que se juegan; las demás quedan en el banco para ampliar el juego.
// led = pin del Arduino que se enciende al responder bien esa base (agua -> 3, invernadero -> 4).
// fx = cambio en las barras (positivo suma, negativo resta). La respuesta correcta siempre suma
// protección o recursos y nunca deja una barra en cero; las demás restan.
const QUESTIONS = [
  {
    icon:"💧",
    art:"assets/rooms/water.jpg", color:"#ffe81a", light:false, split:0.56, led:3,
    room:{es:"Planta de Reciclaje de Agua", en:"Water Recycling Plant"},
    earth:{es:"La gravedad baja el agua y la suciedad por las tuberías.", en:"Gravity pulls water and dirt down the pipes."},
    space:{es:"Sin gravedad, el agua se estanca y las bacterias forman una capa pegajosa.", en:"Without gravity, water stands still and bacteria form a sticky layer."},
    question:{es:"¡Alerta en los tanques de agua! Sin gravedad, las bacterias están formando una capa pegajosa en las tuberías del reciclador. ¿Qué haces?", en:"Alert in the water tanks! Without gravity, bacteria are forming a sticky layer in the recycler pipes. What do you do?"},
    options:[
      {text:{es:"Apagar los filtros para ahorrar electricidad.", en:"Turn off the filters to save electricity."}, icon:"🔌", short:{es:"Apagar los filtros", en:"Turn off the filters"}, fx:{energy:1, shield:-2}},
      {text:{es:"Usar energía extra para purificar y circular el agua ahora mismo.", en:"Use extra power to purify and circulate the water right now."}, icon:"🚰", short:{es:"Purificar con energía extra", en:"Purify with extra power"}, fx:{shield:1, energy:-1}, correct:true},
      {text:{es:"Esperar a que la gravedad baje la suciedad al fondo.", en:"Wait for gravity to pull the dirt to the bottom."}, icon:"⏳", short:{es:"Esperar a la gravedad", en:"Wait for gravity"}, fx:{shield:-2}}
    ],
    explain:{es:"En el espacio no hay gravedad que empuje la suciedad hacia abajo. Si no gastas energía limpiando el sistema, el agua se contamina y te quedas sin hidratación.", en:"In space there is no gravity to push dirt down. If you don't spend power cleaning the system, the water gets contaminated and you run out of safe drinking water."},
    osd:["OSD-729"]
  },
  {
    icon:"🍅",
    art:"assets/rooms/greenhouse.jpg", color:"#34a935", light:false, split:0.27, led:4,
    room:{es:"Invernadero Espacial", en:"Space Greenhouse"},
    earth:{es:"Las plantas reciben luz solar gratis.", en:"Plants get free sunlight."},
    space:{es:"Hay que fabricar la luz con paneles solares y baterías limitadas.", en:"Light must be made with solar panels and limited batteries."},
    question:{es:"Nuestros tomates espaciales necesitan luz para crecer, pero las baterías están al 50%. ¿Qué luces LED enciendes?", en:"Our space tomatoes need light to grow, but the batteries are at 50%. Which LED lights do you turn on?"},
    options:[
      {text:{es:"Luz blanca súper brillante al máximo todo el día.", en:"Super bright white light at full power all day."}, icon:"💡", short:{es:"Luz blanca al máximo", en:"Full white light"}, fx:{energy:-2}},
      {text:{es:"Una mezcla especial de 90% luz roja y 10% luz azul.", en:"A special mix of 90% red light and 10% blue light."}, icon:"🔴🔵", short:{es:"Luz roja y azul", en:"Red and blue light"}, fx:{energy:1}, correct:true},
      {text:{es:"Apagar las luces y dejar que las plantas crezcan a oscuras.", en:"Turn off the lights and let the plants grow in the dark."}, icon:"🌑", short:{es:"Apagar las luces", en:"Lights off"}, fx:{oxygen:-2}}
    ],
    explain:{es:"La NASA comprobó en el experimento VEG-05 de la EEI que combinar luz roja y azul permite cultivar tomates sanos ahorrando energía vital para la estación.", en:"NASA showed in the ISS VEG-05 experiment that mixing red and blue light grows healthy tomatoes while saving vital power for the station."},
    osd:["OSD-767", "OSD-766"]
  },
  {
    icon:"🌱",
    art:"assets/rooms/roots.jpg", color:"#e8262b", light:true, split:0.44,
    room:{es:"Cultivos sin Tierra", en:"Soil-free Crops"},
    earth:{es:"Usamos macetas con tierra y regadera.", en:"We use pots with soil and a watering can."},
    space:{es:"La tierra flotaría por la cabina y ahogaría las raíces.", en:"Soil would float around the cabin and smother the roots."},
    question:{es:"Queremos cultivar vegetales frescos en la estación, pero la tierra flotaría y ensuciaría los equipos. ¿Cómo alimentamos las raíces?", en:"We want to grow fresh vegetables on the station, but soil would float and dirty the equipment. How do we feed the roots?"},
    options:[
      {text:{es:"Regar con manguera normal dentro de la cabina.", en:"Water with a normal hose inside the cabin."}, icon:"🚿", short:{es:"Regar con manguera", en:"Water with a hose"}, fx:{energy:-2}},
      {text:{es:"Usar niebla con nutrientes directo a las raíces en el aire (aeroponía).", en:"Use a nutrient mist sprayed straight onto roots in the air (aeroponics)."}, icon:"🌫️", short:{es:"Niebla de nutrientes", en:"Nutrient mist"}, fx:{oxygen:1}, correct:true},
      {text:{es:"Enterrar las semillas en polvo lunar sin agua.", en:"Bury the seeds in moon dust with no water."}, icon:"🌙", short:{es:"Enterrar en polvo lunar", en:"Bury in moon dust"}, fx:{oxygen:-2}}
    ],
    explain:{es:"Con el sistema XROOTS de la NASA, las plantas crecen sin tierra usando gotitas de agua y nutrientes en el aire, ahorrando peso y espacio en los cohetes.", en:"With NASA's XROOTS system, plants grow without soil using tiny drops of water and nutrients in the air, saving weight and space on rockets."},
    osd:["OSD-773"]
  },
  {
    icon:"🏋️",
    art:"assets/rooms/gym.jpg", color:"#ff8a0a", light:false, split:0.37,
    room:{es:"Gimnasio de Gravedad Cero", en:"Zero-Gravity Gym"},
    earth:{es:"Caminar y cargar cosas mantiene fuertes huesos y músculos.", en:"Walking and carrying things keeps bones and muscles strong."},
    space:{es:"Al flotar sin peso, el cuerpo pierde músculo y hueso rápidamente.", en:"Floating without weight, the body quickly loses muscle and bone."},
    question:{es:"Llevas 3 semanas flotando en la estación. Hacer ejercicio consume mucho oxígeno y agua de la tripulación. ¿Qué decides?", en:"You have been floating on the station for 3 weeks. Exercise uses a lot of the crew's oxygen and water. What do you decide?"},
    options:[
      {text:{es:"Cancelar el ejercicio para ahorrar oxígeno.", en:"Cancel exercise to save oxygen."}, icon:"🛑", short:{es:"Cancelar el ejercicio", en:"Cancel exercise"}, fx:{oxygen:1, shield:-2}},
      {text:{es:"Hacer 2 horas diarias de ejercicio con resistencia, aunque consuma más oxígeno.", en:"Do 2 hours of resistance exercise every day, even if it uses more oxygen."}, icon:"🏋️", short:{es:"Ejercicio 2 horas al día", en:"Exercise 2 hours a day"}, fx:{shield:1, oxygen:-1}, correct:true},
      {text:{es:"Dormir más horas para no cansar los músculos.", en:"Sleep more hours so the muscles don't get tired."}, icon:"😴", short:{es:"Dormir más", en:"Sleep more"}, fx:{shield:-2}}
    ],
    explain:{es:"Sin gravedad, tus huesos y músculos se debilitan. Gastar oxígeno hoy en ejercicio evita que te lesiones cuando regreses a la gravedad.", en:"Without gravity, your bones and muscles get weaker. Spending oxygen on exercise today keeps you from getting hurt when you return to gravity."},
    osd:["OSD-984", "OSD-977"]
  },
  {
    icon:"🌡️",
    art:"assets/rooms/temperature.jpg", color:"#2e6fe3", light:true, split:0.61,
    room:{es:"Control de Temperatura", en:"Temperature Control"},
    earth:{es:"Bajar la calefacción solo da un poco de frío.", en:"Lowering the heating only makes you a little cold."},
    space:{es:"El frío ligero en microgravedad acelera la pérdida de huesos.", en:"Mild cold in microgravity speeds up bone loss."},
    question:{es:"Para ahorrar energía de los paneles solares, un compañero propone bajar la calefacción de la base a 18 °C. ¿Es buena idea?", en:"To save solar panel power, a crewmate suggests lowering the base heating to 18 °C. Is it a good idea?"},
    options:[
      {text:{es:"Sí, así ahorramos energía sin consecuencias.", en:"Yes, we save power with no consequences."}, icon:"💸", short:{es:"Sí, ahorrar energía", en:"Yes, save power"}, fx:{energy:1, shield:-2}},
      {text:{es:"No, el frío combinado con la falta de gravedad debilita más rápido los huesos.", en:"No, cold plus no gravity weakens bones faster."}, icon:"🦴", short:{es:"No: debilita los huesos", en:"No: it weakens bones"}, fx:{shield:1}, correct:true},
      {text:{es:"Sí, porque el frío hace que los músculos crezcan más rápido.", en:"Yes, because cold makes muscles grow faster."}, icon:"💪", short:{es:"Sí: más músculo", en:"Yes: more muscle"}, fx:{shield:-2}}
    ],
    explain:{es:"¡Todo está conectado! Ahorrar energía enfriando la cabina hace que el cuerpo gaste energía calentándose y pierda más masa ósea.", en:"Everything is connected! Saving power by cooling the cabin makes the body spend energy keeping warm and lose more bone."},
    osd:["OSD-979", "OSD-980"]
  },
  {
    icon:"☢️",
    art:"assets/rooms/shield.jpg", color:"#ff9a1f", light:false, split:0.59,
    room:{es:"Escudo y Sensor de Radiación", en:"Radiation Shield and Sensor"},
    earth:{es:"La atmósfera y el campo magnético nos protegen.", en:"The atmosphere and magnetic field protect us."},
    space:{es:"La radiación es invisible y daña las células.", en:"Radiation is invisible and damages cells."},
    question:{es:"¡Se acerca una tormenta solar! ¿Cómo sabemos si la radiación está afectando a los seres vivos fuera del escudo?", en:"A solar storm is coming! How do we know if radiation is affecting living things outside the shield?"},
    options:[
      {text:{es:"Salir sin traje a mirar el Sol.", en:"Go outside without a suit to look at the Sun."}, icon:"☀️", short:{es:"Salir sin traje", en:"Go out without a suit"}, fx:{shield:-2}},
      {text:{es:"Revisar nuestros sensores biológicos con levadura (como la usada para hacer pan) y activar el escudo.", en:"Check our yeast biosensors (like the yeast used to make bread) and turn on the shield."}, icon:"🧫", short:{es:"Sensores de levadura y escudo", en:"Yeast sensors and shield"}, fx:{shield:1, energy:-1}, correct:true},
      {text:{es:"Usar un termómetro normal de cocina.", en:"Use a normal kitchen thermometer."}, icon:"🌡️", short:{es:"Termómetro de cocina", en:"Kitchen thermometer"}, fx:{shield:-2}}
    ],
    explain:{es:"En la misión BioSentinel, la NASA usa células de levadura porque su ADN reacciona a la radiación espacial de forma parecida al nuestro, avisando el peligro a tiempo.", en:"In the BioSentinel mission, NASA uses yeast cells because their DNA reacts to space radiation much like ours, warning of danger in time."},
    osd:["OSD-964"]
  },
  {
    icon:"🍽️",
    art:"assets/rooms/dining.jpg", color:"#a7a7a7", light:false, split:0.54,
    room:{es:"Comedor Espacial", en:"Space Dining Room"},
    earth:{es:"La radiación casi no llega a nuestro estómago.", en:"Radiation barely reaches our stomach."},
    space:{es:"La radiación irrita el estómago y el intestino de los astronautas.", en:"Radiation irritates astronauts' stomachs and intestines."},
    question:{es:"La radiación del espacio está afectando la digestión de la tripulación. ¿Qué agregamos al menú espacial?", en:"Space radiation is affecting the crew's digestion. What do we add to the space menu?"},
    options:[
      {text:{es:"Solo comida deshidratada con mucha azúcar.", en:"Only dehydrated food with lots of sugar."}, icon:"🍬", short:{es:"Comida con mucha azúcar", en:"Very sugary food"}, fx:{shield:-2}},
      {text:{es:"Alimentos con probióticos (bacterias buenas como Lacticaseibacillus) que protegen el intestino.", en:"Foods with probiotics (good bacteria like Lacticaseibacillus) that protect the gut."}, icon:"🥛", short:{es:"Alimentos con probióticos", en:"Probiotic foods"}, fx:{shield:1}, correct:true},
      {text:{es:"Saltarse el almuerzo para no usar el baño espacial.", en:"Skip lunch to avoid using the space bathroom."}, icon:"🙅", short:{es:"Saltarse el almuerzo", en:"Skip lunch"}, fx:{energy:-2}}
    ],
    explain:{es:"Estudios de la NASA en chips de intestino humano muestran que los probióticos ayudan a proteger las células intestinales contra la radiación espacial.", en:"NASA studies on human gut-on-a-chip show that probiotics help protect intestinal cells from space radiation."},
    osd:["OSD-1010"]
  },
  {
    icon:"👁️",
    room:{es:"Enfermería", en:"Sick Bay"},
    earth:{es:"La gravedad lleva los líquidos del cuerpo hacia las piernas.", en:"Gravity pulls body fluids down toward the legs."},
    space:{es:"Los líquidos suben hacia la cabeza y presionan los ojos.", en:"Fluids rise to the head and press on the eyes."},
    question:{es:"Un astronauta dice que ve borroso después de un mes en órbita. ¿Por qué ocurre esto en el espacio y no en la Tierra?", en:"An astronaut says their vision is blurry after a month in orbit. Why does this happen in space and not on Earth?"},
    options:[
      {text:{es:"Porque hay demasiado polvo en el espacio.", en:"Because there is too much dust in space."}, icon:"💨", short:{es:"Demasiado polvo", en:"Too much dust"}, fx:{shield:-2}},
      {text:{es:"Porque sin gravedad los líquidos del cuerpo suben a la cabeza y presionan el nervio óptico.", en:"Because without gravity body fluids rise to the head and press on the optic nerve."}, icon:"🧠", short:{es:"Los líquidos suben a la cabeza", en:"Fluids rise to the head"}, fx:{shield:1}, correct:true},
      {text:{es:"Porque mirar las estrellas cansa la vista.", en:"Because looking at the stars tires the eyes."}, icon:"⭐", short:{es:"Mirar estrellas cansa", en:"Stargazing tires eyes"}, fx:{energy:-2}}
    ],
    explain:{es:"Este problema real se llama SANS (Síndrome Neuro-ocular Asociado al Vuelo Espacial). Los astronautas deben medir la presión de sus ojos regularmente.", en:"This real problem is called SANS (Spaceflight-Associated Neuro-ocular Syndrome). Astronauts must measure the pressure in their eyes regularly."},
    osd:["OSD-816", "OSD-817", "OSD-815"]
  },
  {
    icon:"🪥",
    room:{es:"Baño e Higiene Bucal", en:"Bathroom and Dental Care"},
    earth:{es:"Abrimos el grifo para cepillarnos los dientes.", en:"We open the tap to brush our teeth."},
    space:{es:"Cada gota pesa en el cohete y las bacterias de la boca cambian.", en:"Every drop adds weight to the rocket and mouth bacteria behave differently."},
    question:{es:"El agua de la estación está baja, pero las bacterias de la placa dental crecen distinto en microgravedad. ¿Qué haces?", en:"The station's water is low, but dental plaque bacteria grow differently in microgravity. What do you do?"},
    options:[
      {text:{es:"Dejar de cepillarse los dientes hasta volver a la Tierra.", en:"Stop brushing teeth until you return to Earth."}, icon:"🙅", short:{es:"No cepillarse", en:"Don't brush"}, fx:{shield:-2}},
      {text:{es:"Usar una pequeña ración de agua para cepillarse y tragar o limpiar con toallita la pasta.", en:"Use a small ration of water to brush, then swallow the paste or wipe it off with a towel."}, icon:"🪥", short:{es:"Poca agua y toallita", en:"A little water and a wipe"}, fx:{shield:1}, correct:true},
      {text:{es:"Enjuagarse con jugo de naranja.", en:"Rinse with orange juice."}, icon:"🍊", short:{es:"Enjuagar con jugo", en:"Rinse with juice"}, fx:{shield:-2}}
    ],
    explain:{es:"En microgravedad, bacterias como Streptococcus mutans cambian su forma de agruparse. Cuidar los dientes evita emergencias médicas donde no hay dentistas.", en:"In microgravity, bacteria like Streptococcus mutans change how they group together. Caring for your teeth avoids medical emergencies where there are no dentists."},
    osd:["OSD-987"]
  },
  {
    icon:"📡",
    room:{es:"Torre de Comunicaciones", en:"Communications Tower"},
    earth:{es:"Estamos rodeados de amigos, familia y naturaleza.", en:"We are surrounded by friends, family, and nature."},
    space:{es:"El aislamiento y la radiación afectan el ánimo y la concentración.", en:"Isolation and radiation affect mood and focus."},
    question:{es:"La tripulación lleva meses aislada y comete errores en los controles. Usar la antena para hablar con la Tierra gasta mucha batería. ¿Qué haces?", en:"The crew has been isolated for months and makes mistakes at the controls. Using the antenna to talk to Earth drains a lot of battery. What do you do?"},
    options:[
      {text:{es:"Cortar las llamadas con la Tierra para ahorrar 100% de batería.", en:"Cut calls with Earth to save 100% of the battery."}, icon:"✂️", short:{es:"Cortar las llamadas", en:"Cut the calls"}, fx:{energy:1, shield:-2}},
      {text:{es:"Reservar energía para videollamadas con sus familias y actividades en equipo.", en:"Reserve power for video calls with their families and team activities."}, icon:"📞", short:{es:"Videollamadas con la familia", en:"Video calls with family"}, fx:{shield:1, energy:-1}, correct:true},
      {text:{es:"Dejar que cada astronauta trabaje solo sin hablar con nadie.", en:"Let each astronaut work alone without talking to anyone."}, icon:"🧍", short:{es:"Trabajar solo", en:"Work alone"}, fx:{shield:-2}}
    ],
    explain:{es:"La NASA estudia cómo el aislamiento social sumado a la radiación afecta el aprendizaje y el comportamiento. Mantener la mente sana es tan vital como el oxígeno.", en:"NASA studies how social isolation plus radiation affects learning and behavior. Keeping the mind healthy is as vital as oxygen."},
    osd:["OSD-1018"]
  },
  {
    icon:"🦠",
    room:{es:"Mantenimiento de Cabina", en:"Cabin Maintenance"},
    earth:{es:"Puedes abrir las ventanas para ventilar.", en:"You can open the windows to air things out."},
    space:{es:"La nave es un ambiente cerrado y los microbios se pegan a plásticos y cables.", en:"The ship is a closed space and microbes stick to plastics and cables."},
    question:{es:"Detectamos microbios creciendo sobre los paneles plásticos de la estación. ¿Por qué es peligroso ignorarlos?", en:"We detect microbes growing on the station's plastic panels. Why is it dangerous to ignore them?"},
    options:[
      {text:{es:"Porque pueden dañar los materiales de la nave y enfermar a la tripulación en un espacio cerrado.", en:"Because they can damage the ship's materials and make the crew sick in a closed space."}, icon:"🦠", short:{es:"Dañan la nave y enferman", en:"They damage the ship and make people sick"}, fx:{oxygen:1}, correct:true},
      {text:{es:"No pasa nada, en el espacio los microbios desaparecen solos.", en:"It's fine, in space microbes disappear on their own."}, icon:"✨", short:{es:"Desaparecen solos", en:"They vanish on their own"}, fx:{oxygen:-2}},
      {text:{es:"Porque hacen que la nave pese el doble.", en:"Because they make the ship twice as heavy."}, icon:"⚖️", short:{es:"La nave pesa el doble", en:"The ship gets twice as heavy"}, fx:{energy:-2}}
    ],
    explain:{es:"La NASA analiza qué materiales resisten mejor la acumulación de microbios (bioburden) para construir naves más limpias y seguras.", en:"NASA studies which materials resist microbe buildup (bioburden) best, to build cleaner and safer spacecraft."},
    osd:["OSD-989"]
  },
  {
    icon:"🧊",
    room:{es:"Simulador Antártico EDEN ISS", en:"EDEN ISS Antarctic Simulator"},
    earth:{es:"Los científicos prueban invernaderos en lugares extremos como la Antártida.", en:"Scientists test greenhouses in extreme places like Antarctica."},
    space:{es:"Allí hace frío extremo y no hay luz solar en invierno, como en otros mundos.", en:"It is extremely cold with no winter sunlight, like on other worlds."},
    question:{es:"Estás en el invernadero experimental EDEN ISS en la Antártida preparando comida para futuras bases espaciales. ¿Cuál es el mayor reto compartido con el espacio?", en:"You are in the EDEN ISS experimental greenhouse in Antarctica, preparing food for future space bases. What is the biggest challenge it shares with space?"},
    options:[
      {text:{es:"Que hay demasiados insectos comiéndose las lechugas.", en:"Too many insects eating the lettuce."}, icon:"🐛", short:{es:"Muchos insectos", en:"Too many insects"}, fx:{shield:-2}},
      {text:{es:"Producir comida sin luz solar natural y reciclando cada gota de agua y nutrientes.", en:"Producing food without natural sunlight while recycling every drop of water and nutrients."}, icon:"🔁", short:{es:"Sin sol y reciclando todo", en:"No sun and recycling everything"}, fx:{energy:1}, correct:true},
      {text:{es:"Que las plantas crecen demasiado rápido y rompen el techo.", en:"Plants grow so fast they break the roof."}, icon:"🌳", short:{es:"Plantas rompen el techo", en:"Plants break the roof"}, fx:{energy:-2}}
    ],
    explain:{es:"La estación EDEN ISS en la Antártida ayuda a la NASA y a las agencias espaciales a entrenar cómo cultivar alimentos en mundos helados y oscuros.", en:"The EDEN ISS station in Antarctica helps NASA and other space agencies train for growing food in icy, dark worlds."},
    osd:["OSD-895"]
  }
];
const ROUNDS_PER_GAME = 7;
const OSDR_STUDY_URL = "https://osdr.nasa.gov/bio/repo/data/studies/";
