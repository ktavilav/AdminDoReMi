import React from 'react';

const Category = ({ categorias }) => {
    console.log(categorias);
  return (
    <section className="categories-section">
      <h2 className='title-categorias'>Categorías</h2>
      <div className="category-cards">
        {categorias.map(categoria => (
          <div className="category-card" key={categoria.categoria_id}>
            <section className='picture'> 
                <img src={categoria.imagen} alt={categoria.nombre} /> 
            </section>
            <h3>{categoria.nombre}</h3>
            <p>{categoria.descripcion}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Category;
