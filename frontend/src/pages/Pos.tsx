import React from 'react';
import { useCarrito } from '../context/CarritoContext';

const Pos: React.FC = () => {
  const { state, dispatch } = useCarrito();

  // Aquí iría la lógica de búsqueda, agregar al carrito y checkout
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Columna de búsqueda */}
      <div style={{ flex: 1, borderRight: '1px solid #ccc', padding: 16 }}>
        <h3>Búsqueda</h3>
        {/* Implementar búsqueda y agregar productos */}
      </div>
      {/* Columna de carrito */}
      <div style={{ flex: 1, borderRight: '1px solid #ccc', padding: 16 }}>
        <h3>Carrito</h3>
        {state.productos.map((p: any) => (
          <div key={p.id}>
            {p.nombre} x {p.cantidad} (${p.precio_venta})
            <button onClick={() => dispatch({ type: 'REMOVE_PRODUCTO', id: p.id })}>Eliminar</button>
          </div>
        ))}
      </div>
      {/* Columna de checkout */}
      <div style={{ flex: 1, padding: 16 }}>
        <h3>Checkout</h3>
        <button onClick={() => dispatch({ type: 'CLEAR_CARRITO' })}>Pagar Contado</button>
        {/* Implementar envío a /ventas y mostrar éxito/error */}
      </div>
    </div>
  );
};

export default Pos;
