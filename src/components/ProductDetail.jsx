import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import products from '../components/product.json';
import '../components/css/ProductDetail.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 
import Calendario from './Calendario';
import ReservationDetail from './ReservationDetail';
import ReservationConfirm from './ReservationConfirm';
import ReservationCancel from './ReservationCancel';
import Modal from './Modal'; 
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';


const ProductDetail = () => {
  const { id } = useParams();
  const { isLogged, userRole } = useAuth();

  const [userId, setUserID] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reservationConfirmation, setReservationConfirmation] = useState(null);
  const [reservationDates, setReservationDates] = useState({
    startDate: null,
    endDate: null
  });
  const [modalType, setModalType] = useState(null);

  const changeThumbnail = (index) => {
    setSelectedThumbnail(index);
  };

  const navigateThumbnails = (direction) => {
    const newIndex =
      direction === 'up'
        ? selectedThumbnail - 1
        : selectedThumbnail + 1;

    if (newIndex >= 0 && newIndex < selectedProduct.images.length) {
      setSelectedThumbnail(newIndex);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite); 
    const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`)) || {};
    if (isFavorite) {
      delete favorites[id];
    } else {
      favorites[id] = selectedProduct;
    }
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSelectedThumbnail(prevIndex => (prevIndex + 1) % selectedProduct.imagen.length);
    }, 3000);

    return () => {
      clearInterval(intervalId); 
    };
  }, [selectedProduct]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/instrumentos/buscarPorId/' + parseInt(id));
        const data = await response.json();

        const productFromBackend = data;
        const productFromJSON = products.find((product) => product.instrumento_id === parseInt(id));

        if (productFromBackend && productFromJSON) {
          const mergedProduct = {
            ...productFromBackend,
            imagen: productFromJSON.imagen,
          };
          console.log('productFromJSON--->',productFromJSON.imagen);
          console.log('productFromBackend--->',productFromBackend);
          console.log('mergedProduct--->',mergedProduct);

          setSelectedProduct(mergedProduct);
        } else {
          setSelectedProduct(productFromBackend);
        }

        setUserID(localStorage.getItem('userId'));
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos del servidor:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`)) || {};
    setIsFavorite(!!favorites[id]);
  }, [id]);

  if (loading) {
    return <div className="loading-container">Cargando...</div>;
  }

  if (!selectedProduct) {
    return <div className="error-container">Producto no encontrado</div>;
  }

  const handleCloseModal = () => {
    setModalType(null);
  };
  
  const handleConfirmReserve = (startDate, endDate) => {
    setReservationDates({ startDate, endDate });
    setModalType('reservationDetail');
    console.log('startDate-->',startDate);
    console.log('endDate-->', endDate);
    return;
  };

  const handleReserve = () => {
      const { startDate, endDate } = reservationDates;
      const reservaData = {
      usuarioId: userId,
      instrumentoId: id,
      fechaInicial: startDate.toISOString().split("T")[0],
      fechaFinal: endDate.toISOString().split("T")[0]
    };

    fetch('/reservas/agregar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify(reservaData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al reservar');
      }
      setModalType('reservationConfirm');
    })
    .catch(error => {
      console.error('Error de reserva:', error);
    });
  };
  return (
    <>
      <div className="productDetail-header">
        <div className="productDetail-header-title-left">
          <h1>Categoría: {selectedProduct.categoria.nombre}</h1>
        </div>
        <div className="productDetail-header-right">
          <Link to="/">
            <button>Volver Atrás</button>
          </Link>
        </div>
      </div>
      <div className="">
        <div className="product-container">
          <div className="product-images">
            <div className="image-wrapper" style={{ cursor: 'pointer' }} >
              <img
                src={selectedProduct.imagen[selectedThumbnail].url}
                alt={`Producto ${selectedProduct.id} Imagen principal`}
                className="main-image"
                onClick={() => setModalType('carousel')} 
              />
            </div>
            <div className="thumbnail-container">
              {selectedProduct.imagen.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Producto ${selectedProduct.id} Imagen ${index + 1}`}
                  className={`product-thumbnail ${
                    index === selectedThumbnail ? 'selected' : ''
                  }`}
                  onClick={() => changeThumbnail(index)}
                />
              ))}
            </div>
          </div>
          <div className="product-details">
            <h3>
              {isLogged && (
              <span onClick={toggleFavorite} style={{ cursor: 'pointer', position: 'absolute', top: '0', right: '0', margin: '8px' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill={isFavorite ? '#512DA8' : 'none'}
                stroke={isFavorite ? '#512DA8' : '#000000'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 21.943L12 21.943C5.91 16.373 2 12.82 2 9.155c0-3.309 2.91-5.983 6.5-5.983 2.637 0 4.638 1.767 5.5 3.5.862-1.733 2.863-3.5 5.5-3.5C19.09 3.172 22 5.846 22 9.155c0 3.665-3.91 7.218-9 12.788z"></path>
              </svg>
            </span>
            
              )}
              <p
                style={{
                  fontWeight: 'bold',
                  fontSize: '20px',
                  color: '#512DA8',
                  right: '0',
                  margin: '8px',
                }}
              >
                  {selectedProduct.nombre}
              </p>            
            </h3>
            <p>{selectedProduct.descripcion}</p>
            {selectedProduct.precioDia && ( 
              <p
                style={{
                  fontWeight: 'bold',
                  fontSize: '16px',
                  color: '#512DA8',
                  position: 'center',
                  bottom: '0',
                  right: '0',
                  margin: '8px',
                }}
              >
                Precio por día: ${selectedProduct.precioDia}
              </p>
            )} 
            {isLogged && (
            <div className="boton-container">
              <button onClick={() => setModalType('calendar')}>Quiero reservar</button>
            </div> 
            )}
          </div>
        </div>
      </div>
      <Modal mostrar={modalType === 'calendar'} onClose={handleCloseModal}>
          <div className="modal-contenido">
            <h2>Selecciona tu fecha de reserva</h2>
            
            <Calendario instrumentId={id} onConfirmReserve={handleConfirmReserve}/>
          </div>
      </Modal>
      <Modal mostrar={modalType === 'carousel'} onClose={handleCloseModal}>
      <div className="carousel-overlay">
        <div className="carousel-container">
          <Carousel showArrows={true} showThumbs={false} selectedItem={selectedThumbnail}>
            {selectedProduct.imagen.map((image, index) => (
              <div key={index}>
                <img 
                  src={image.url} 
                  alt={`Producto ${id} Imagen ${index + 1}`} 
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto',
                    marginBottom: '10px',
                    aspectRatio: '3/2',
                    objectFit: 'contain'
                  }}     

                />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
      </Modal>  
      <Modal mostrar={modalType === 'reservationDetail'} onClose={handleCloseModal}>
        <ReservationDetail
          product={selectedProduct}
          userId={userId}
          startDate={reservationDates.startDate!=null?reservationDates.startDate.toISOString().split("T")[0]:''}
          endDate={reservationDates.endDate!=null?reservationDates.endDate.toISOString().split("T")[0]:''}
          setModalType={setModalType} 
          onReserve={handleReserve}
        />

      </Modal>
      <Modal mostrar={modalType === 'reservationConfirm'} onClose={handleCloseModal}>
        <ReservationConfirm/>
      </Modal>
      <Modal mostrar={modalType === 'reservationCancel'} onClose={handleCloseModal}>
        <ReservationCancel />
      </Modal>
    </>
  );
};

export default ProductDetail;
