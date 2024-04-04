import React, { useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import '../components/css/Calendario.css';
import es from "date-fns/locale/es";

function Calendario({ instrumentId, onConfirmReserve }) {
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [monthsToShow, setMonthsToShow] = useState(
    window.innerWidth <= 768 ? 1 : 2
  );

  const now = new Date(); 
  const offset = now.getTimezoneOffset() * 60000; 
  
  // Crear las fechas para startDate y endDate ajustadas al huso horario de Argentina (UTC-3)
  const startDate = new Date(now - offset - (3 * 60 * 60 * 1000)); // Restar 3 horas en milisegundos
  const endDate = new Date(now - offset - (3 * 60 * 60 * 1000)); // Restar 3 horas en milisegundos

  const [selectionRange, setSelectionRange] = useState({
    startDate,
    endDate,
    key: "selection",
  });
  console.log(selectionRange.startDate?.toISOString().split("T").shift());
  console.log(selectionRange.endDate?.toISOString().split("T").shift());

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(`/reservas/buscarPorInstrumento/${instrumentId}`);
        const data = await response.json();
        const reservationsFromServer = data.map(reservation => ({
          start: reservation.fechaInicial,
          end: reservation.fechaFinal
        }));
        console.log('reservationsFromServer-->',reservationsFromServer);
        const disabledDates = [];
        reservationsFromServer.forEach((reservation) => {
          const { start, end } = reservation;
          const startDate = new Date(start + "T00:00:00-03:00");
    
          const endDate = new Date(end + "T00:00:00-03:00");
    
          const currentDate = startDate;
          while (currentDate <= endDate) {
            disabledDates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });

        setFechasOcupadas(disabledDates);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, [instrumentId]);

  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
  };

  const handleReserve = () => {
    if (selectionRange.startDate && selectionRange.endDate) {
      onConfirmReserve(selectionRange.startDate, selectionRange.endDate);
    } else {
      console.error('Por favor selecciona un rango de fechas válido.');
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setMonthsToShow(1);
      } else {
        setMonthsToShow(2);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  return (
    <div className="calendario-container">
      <div className="calendario-card">
        <DateRange
          ranges={[selectionRange]}
          onChange={handleSelect}
          rangeColors={["peru"]}
          disabledDates={fechasOcupadas}
          showDateDisplay={false}
          months={monthsToShow}
          direction="horizontal"
          locale={es}
          minDate={new Date()}
        /><br></br>
        <button disabled={!selectionRange.startDate || !selectionRange.endDate} onClick={handleReserve}>Reservar</button>
      </div>
    </div>
  );
}

export default Calendario;