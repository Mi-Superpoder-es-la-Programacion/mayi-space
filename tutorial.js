// Tutorial de bienvenida: recorre las 8 estaciones del dibujo y explica las barras.
// Cada paso usa el dibujo de la estación y su color de sala.
const TUTORIAL = [
  {
    key:"blueprint", art:"assets/rooms/blueprint.jpg", color:"#1c3d6e", frame:"#3c415a", light:true, icon:"🛰️", logo:"assets/icons/tutorial/satellite.png",
    title:{es:"Tu estación espacial", en:"Your space station"},
    text:{es:"Aquí vive Mayito. La estación tiene 7 bases especiales y cada una es un reto de ciencia. ¡Vamos a conocerlas!", en:"Mayito lives here. The station has 7 special bases and each one is a science challenge. Let's meet them!"}
  },
  {
    key:"roots", art:"assets/rooms/roots.jpg", color:"#e8262b", frame:"#eb5550", light:true, icon:"🌱", logo:"assets/icons/tutorial/sprout.png",
    title:{es:"Cultivos sin Tierra", en:"Soil-free Crops"},
    text:{es:"Aquí las plantas crecen sin tierra: sus raíces reciben una niebla con nutrientes. En el espacio la tierra flotaría por todos lados.", en:"Here plants grow without soil: their roots get a mist full of nutrients. In space, soil would float everywhere."}
  },
  {
    key:"greenhouse", art:"assets/rooms/greenhouse.jpg", color:"#34a935", frame:"#63c772", light:false, icon:"🍅", logo:"assets/icons/tutorial/tomato.png",
    title:{es:"Invernadero Espacial", en:"Space Greenhouse"},
    text:{es:"Aquí crecen los tomates con luces LED rojas y azules. En el espacio no hay sol gratis, ¡hay que fabricar la luz!", en:"Tomatoes grow here under red and blue LED lights. In space there is no free sunshine, so we must make our own light!"}
  },
  {
    key:"water", art:"assets/rooms/water.jpg", color:"#ffe81a", frame:"#d5d737", light:false, icon:"💧", logo:"assets/icons/tutorial/drop.png",
    title:{es:"Planta de Reciclaje de Agua", en:"Water Recycling Plant"},
    text:{es:"Aquí se limpia y se reutiliza el agua. Sin gravedad, las bacterias se pegan en las tuberías y hay que cuidarlas.", en:"Here water is cleaned and reused. Without gravity, bacteria stick to the pipes, so we have to look after them."}
  },
  {
    key:"gym", art:"assets/rooms/gym.jpg", color:"#ff8a0a", frame:"#e6a96d", light:false, icon:"🏋️", logo:"assets/icons/tutorial/lifter.png",
    title:{es:"Gimnasio de Gravedad Cero", en:"Zero-Gravity Gym"},
    text:{es:"Aquí los astronautas hacen ejercicio. Flotando sin peso, los huesos y los músculos se debilitan si no se mueven.", en:"Astronauts exercise here. Floating without weight, bones and muscles get weak if they don't move."}
  },
  {
    key:"shield", art:"assets/rooms/shield.jpg", color:"#ff9a1f", frame:"#ed8e2f", light:false, icon:"☢️", logo:"assets/icons/tutorial/radiation.png",
    title:{es:"Escudo y Sensor de Radiación", en:"Radiation Shield and Sensor"},
    text:{es:"Aquí un escudo y unos sensores avisan cuando llega radiación peligrosa del espacio. ¡Es invisible, pero daña las células!", en:"A shield and sensors here warn us when dangerous radiation arrives from space. It is invisible, but it harms cells!"}
  },
  {
    key:"temperature", art:"assets/rooms/temperature.jpg", color:"#2e6fe3", frame:"#5a82b3", light:true, icon:"🌡️", logo:"assets/icons/tutorial/thermometer.png",
    title:{es:"Control de Temperatura", en:"Temperature Control"},
    text:{es:"Aquí se cuida el calor de la base. ¡Hasta la temperatura importa para los huesos de la tripulación!", en:"Here we look after the base's heat. Even the temperature matters for the crew's bones!"}
  },
  {
    key:"dining", art:"assets/rooms/dining.jpg", color:"#a7a7a7", frame:"#a0a1a3", light:false, icon:"🍽️", logo:"assets/icons/tutorial/cutlery.png",
    title:{es:"Comedor Espacial", en:"Space Dining Room"},
    text:{es:"Aquí se come y se cuida la barriguita. Algunos alimentos tienen bacterias buenas que protegen el intestino.", en:"Here we eat and look after our tummies. Some foods have good bacteria that protect the gut."}
  },
  {
    key:"bars", art:"assets/intro-mayito.png", noBlur:true, color:"#7a45b8", frame:"#7a45b8", light:true, icon:"📊", logo:"assets/icons/tutorial/bars.png",
    title:{es:"Las 3 barras de la base", en:"The base's 3 bars"},
    text:{es:"El tiempo por pregunta lo eliges tú ⏱️. Responde bien para cuidar las barras: si una llega a cero, la misión termina.", en:"You choose the time per question ⏱️. Answer well to protect the bars: if one reaches zero, the mission ends."},
    bars:[
      {icon:"assets/icons/air.svg", name:{es:"Aire", en:"Air"}, hint:{es:"lo que respiramos", en:"what we breathe"}},
      {icon:"assets/icons/energy.svg", name:{es:"Energía", en:"Power"}, hint:{es:"hace funcionar las máquinas", en:"runs the machines"}},
      {icon:"assets/icons/shelter.svg", name:{es:"Refugio", en:"Shelter"}, hint:{es:"protege a la tripulación", en:"keeps the crew safe"}}
    ]
  }
];
