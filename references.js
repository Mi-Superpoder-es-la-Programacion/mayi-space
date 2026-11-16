// Referencias reales de NASA OSDR de las 12 salas del banco de preguntas
// (texto: preguntas_nasa_osdr_junior_astronaut_mission_trainer.md). "inGame" marca las 7 salas con dibujo que se juegan hoy.
// Cada estudio enlaza al repositorio abierto: OSDR_STUDY_URL + id (por ejemplo OSD-729).
const REFERENCES = [
  {n:1,  icon:"💧", inGame:true,  color:"#ffe81a", room:{es:"Planta de Reciclaje de Agua", en:"Water Recycling Plant"},
   ids:["OSD-729"], title:"Biofilm formation is correlated with low nutrient and simulated microgravity conditions in a Burkholderia isolate from the ISS water processor assembly"},
  {n:2,  icon:"🍅", inGame:true,  color:"#34a935", room:{es:"Invernadero Espacial (Iluminación)", en:"Space Greenhouse (Lighting)"},
   ids:["OSD-767", "OSD-766"], title:"Stress and light spectral quality influence the transcriptome of a tomato crop on the ISS"},
  {n:3,  icon:"🌱", inGame:true,  color:"#e8262b", room:{es:"Cultivos sin Tierra (Aeroponía)", en:"Soil-free Crops (Aeroponics)"},
   ids:["OSD-773"], title:"Exposed Root On Orbit Test System (XROOTS), an aeroponic and hydroponic plant growth system on the ISS"},
  {n:4,  icon:"🏋️", inGame:true,  color:"#ff8a0a", room:{es:"Gimnasio de Gravedad Cero", en:"Zero-Gravity Gym"},
   ids:["OSD-984", "OSD-977"], title:"Effects of spaceflight on cancellous and cortical bone / Skeletal muscle metabolic proteins"},
  {n:5,  icon:"🌡️", inGame:true,  color:"#2e6fe3", room:{es:"Control de Temperatura del Hábitat", en:"Habitat Temperature Control"},
   ids:["OSD-979", "OSD-980"], title:"Cold stress during room temperature housing alters skeletal response to simulated microgravity"},
  {n:6,  icon:"☢️", inGame:true,  color:"#ff9a1f", room:{es:"Escudo y Sensor de Radiación", en:"Radiation Shield and Sensor"},
   ids:["OSD-964"], title:"BioSentinel: Validating Sensitivity of Yeast Biosensors to Deep Space Relevant Radiation"},
  {n:7,  icon:"🍽️", inGame:true,  color:"#a7a7a7", room:{es:"Comedor Espacial (Nutrición)", en:"Space Dining Room (Nutrition)"},
   ids:["OSD-1010"], title:"Lacticaseibacillus rhamnosus GG modulates epithelial responses to space-relevant heavy-ion irradiation in a human gut-on-chip"},
  {n:8,  icon:"👁️", inGame:false, color:"#d6c8ee", room:{es:"Enfermería (Chequeo de la Vista)", en:"Sick Bay (Eye Check)"},
   ids:["OSD-816", "OSD-817", "OSD-815"], title:"Spaceflight-Associated Neuro-ocular Syndrome pathogenesis"},
  {n:9,  icon:"🪥", inGame:false, color:"#d6c8ee", room:{es:"Baño e Higiene Bucal", en:"Bathroom and Dental Care"},
   ids:["OSD-987"], title:"Comparison of Streptococcus mutans Growth-Phase Dependent Transcriptome Changes in Simulated Microgravity"},
  {n:10, icon:"📡", inGame:false, color:"#d6c8ee", room:{es:"Torre de Comunicaciones y Recreación", en:"Communications and Recreation Tower"},
   ids:["OSD-1018"], title:"Differential Impact of Social Isolation and Space Radiation on Behavior and Motor Learning"},
  {n:11, icon:"🦠", inGame:false, color:"#d6c8ee", room:{es:"Mantenimiento de Cabina y Materiales", en:"Cabin and Materials Maintenance"},
   ids:["OSD-989"], title:"Identification of Bioburden Associated with Nonmetallic Spacecraft Materials"},
  {n:12, icon:"🧊", inGame:false, color:"#d6c8ee", room:{es:"Cúpula / Simulador Antártico (EDEN ISS)", en:"Dome / Antarctic Simulator (EDEN ISS)"},
   ids:["OSD-895"], title:"Biomass Production of the EDEN ISS Space Greenhouse in Antarctica"}
];
