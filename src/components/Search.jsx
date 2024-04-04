import React, { useState } from "react";
import "./css/Search.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

function Search({ onSearch }) {
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFin, setFechaFin] = useState(new Date());
  const [search, setSearch] = useState("");
  const [productos, setProductos] = useState([]);
  const suggestions = ['Kalimba 17 Teclas', 'Guitarra Electroacústica Cuerdas De Nylon', 'Flauta Dulce Yamaha Escolar Yrs23 Soprano', 'Kalimba Africana De 17 Teclas', 'Ukelele Femmto Soprano En Tilo','Kalimba 17 Teclas Acústica','Kazoo Metálico','Banjo 5 Cuerdas Persian','Kalimba 8 Notas','Ukelele Femmto Soprano En Tilo','Atril Plegable Para Partituras','Campana De Mano En Bronce','Guitarra Elctroacustica + Forro','Acordeón Vallenato Para Niños','Mini Kalimba 8 Teclas','Adaptador De Corriente Yamaha Pa-3c','Apoya Pie Para Guitarra','Patas De Goma Para Tambor','Capodastro Para Guitarra Económico','Fl Studio 21','Kalimba 17 Teclas Profesional','Armónica Jdr Profesional','Guitarra Electroacústica Con Microfono Activo','Batería Accent Fuse 5pc Silver','Transmisor Receptor Inalámbrico Guitarra Lekato','Capodastro Profesional Joyo','Punta De Goma Para Violonchelo','Correa Flex Elastica Bg France Clarinete Sib','Instrumentos Musicales Para La Novena Navideña Tambor Juguet','Limpiador De Instrumentos De Cuerda','Limpiador De Instrumentos De Cuerda','Guitarra Acústica 3/4', 'Guacharaca Guiro Metálico', 'Ukelele Femmto Soprano En Tilo', 'Pin De Correa Para Guitarra', 'Kalimba 17 Teclas Madera Caoba', 'Protector De Dedos Para Guitarra', 'Sampler', 'Limpiador Para Guitarra Bajo Dunlop', 'Atril Base Para Redoblante De Bateria', 'Guitarra Acústica', 'Colofonia Resina Rosin Pez', 'Correa Charol Para Instrumentos De Banda Marcial', 'Armónica 24 Holes', 'Guitarra Electroacústica Personalizada', 'Correa Charol Para Lira Banda Marcial', 'Transmisor Receptor Guitarra Bajo Sistema Inalámbrico', 'Ejercicio De Mano Varigrip D´addario', 'Clutch Para Platillos Hi Hats', 'Transmisor Y Receptor Guitarra Bajo Sistema Inalámbrico', 'Protector De Dedos Para Guitarra', 'Diapasón 512 Hz'];

  const bgSearch = {
    backgroundImage: 'url(images/bg-search.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center', 
  };

  const handleFechaInicioChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    if (selectedDate < today) {
      e.target.classList.add("past-date");
    } else {
      e.target.classList.remove("past-date");
    }
    setFechaInicio(selectedDate);
  };

  const handleFechaFinChange = (e) => {
    setFechaFin(e.target.value);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/instrumentos/buscarPorKeyWord/${search}`);
      if (!response.ok) {
        alert(`No se encontraron productos con el nombre ${search}`)
        setProductos({});
        onSearch(data);
        throw new Error('Error al buscar productos');
      }
      const data = await response.json();
      setProductos(data);
      onSearch(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div className="search" style={{ ...bgSearch, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className="search-title">
        <h1>La clave de tus sueños musicales</h1>
      </div>
      <div>
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-section">
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faSearch} className="frm-input frm-large-icon"/>
              <input
                type="text"
                id="search"
                name="search"
                value={search}
                onChange={handleSearch}
                placeholder="Guitarra, Batería, Piano..."
                list="suggestions"
              />
              <datalist id="suggestions">
                {suggestions.map((suggestion, index) => (
                  <option key={index} value={suggestion} />
                ))}
              </datalist>
            </div>
          </div>
          <div className="search-section-date">
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faCalendarAlt} className="frm-input frm-large-icon"/>
              <input
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={fechaInicio.toISOString().split('T')[0]} // Format the date to ISO string
                onChange={handleFechaInicioChange}
                aria-hidden="true"
              />
            </div>
            &nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faCalendarAlt} className="frm-input frm-large-icon"/>
              <input
                type="date"
                id="fechaFin"
                name="fechaFin"
                value={fechaFin}
                onChange={handleFechaFinChange}
                aria-hidden="true"
              />
            </div>
          </div>
          <button type="submit">Buscar</button>
        </form>
      </div>
    </div>
  );
}

export default Search;


