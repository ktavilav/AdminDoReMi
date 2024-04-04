import React, { useState, useEffect } from 'react';

import Header from './Header';
import Search from './Search';
import Category from './Category';
import Product from './ProductList';
import Footer from './Footer';
import './css/Body.css';

const Body = () => {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productosBuscados, setProductosBuscados] = useState([]);

  const token = '123123';

  const fetchCategoryData = async () => {
    try {
      const response = await fetch('/categoria/listar', {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Error al obtener la lista de categorías');
      }
      console.log('response--->',response);

      const data = await response.json();

      console.log('data--->',data);
      const categoriaConId = data.map((categoria, index) => ({
        ...categoria,
        id: index + 1,
      }));
      console.log(categoriaConId);
      setCategorias(categoriaConId);
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const fetchProductData = async () => {
    try {
      const response = await fetch('/instrumentos/listaraleatorios', {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Error al obtener la lista de instrumentos');
      }
      console.log('response--->',response);

      const data = await response.json();

      console.log('data--->',data);
      const instrumentoConId = data.map((instrumento, index) => ({
        ...instrumento,
        id: index + 1,
      }));
      console.log(instrumentoConId);
      setProductos(instrumentoConId);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSearch = (data) => {
    setProductosBuscados(data);
  };

  useEffect(() => {
    fetchCategoryData();
    fetchProductData();
  }, []);

  return (
    <div className="body">
    
    <Search onSearch={handleSearch}/>
    { !productosBuscados.length > 0 ? (
      <>
        <div>
          <Category categorias={categorias} />
        </div>
        <div>
        <Product productos={productos} />
        </div>
      </>
    ) : (
      <>
        <div><h3>{`Se encontraron ${productosBuscados.length} productos`}</h3></div>
        <Product productos={productosBuscados} />
      </>
    )}
    </div>
  );
};

export default Body;
