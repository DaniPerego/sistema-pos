import React, { useState } from 'react';
import { useCarrito, Producto } from '../context/CarritoContext';

const POS_API_URL = process.env.REACT_APP_POS_API_URL || 'http://localhost:3002';

const Pos: React.FC = () => {
  const { state, dispatch } = useCarrito();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchTerm) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${POS_API_URL}/productos/search?q=${searchTerm}`);
      if (!res.ok) throw new Error('Error al buscar productos');
      const data = await res.json();
      setSearchResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (producto: any) => {
    const item: Producto = {
      id: producto.id,
      nombre: producto.nombre,
      precio_venta: Number(producto.precio_venta),
      cantidad: 1
    };
    dispatch({ type: 'ADD_PRODUCTO', producto: item });
  };

  const calculateTotal = () => {
    return state.productos.reduce((acc: number, p: Producto) => acc + (p.precio_venta * p.cantidad), 0);
  };

  const handleCheckout = async () => {
    if (state.productos.length === 0) return;
    
    const ventaData = {
      cajero_id: 1, // TODO: Obtener del usuario logueado
      cliente_id: 1, // TODO: Permitir seleccionar cliente
      total: calculateTotal(),
      detalles: state.productos.map((p: Producto) => ({
        producto_id: p.id,
        cantidad: p.cantidad,
        precio_unitario: p.precio_venta
      }))
    };

    try {
      const res = await fetch(`${POS_API_URL}/ventas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventaData)
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error al procesar venta');
      }

      const result = await res.json();
      alert(`Venta registrada con éxito! ID: ${result.venta_id}`);
      dispatch({ type: 'CLEAR_CARRITO' });
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Columna de búsqueda */}
      <div style={{ flex: 1, borderRight: '1px solid #ccc', padding: 16, overflowY: 'auto' }}>
        <h3>Búsqueda de Productos</h3>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input 
            type="text" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Nombre, SKU o Código"
            style={{ flex: 1, padding: 8 }}
          />
          <button onClick={handleSearch} disabled={loading} style={{ padding: '8px 16px' }}>
            {loading ? '...' : 'Buscar'}
          </button>
        </div>
        
        {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}

        <div style={{ display: 'grid', gap: 16 }}>
          {searchResults.map((p) => (
            <div key={p.id} style={{ border: '1px solid #eee', padding: 12, borderRadius: 4 }}>
              <div style={{ fontWeight: 'bold' }}>{p.nombre}</div>
              <div style={{ color: '#666', fontSize: '0.9em' }}>SKU: {p.sku}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <span style={{ fontWeight: 'bold', color: '#2e7d32' }}>${p.precio_venta}</span>
                <button 
                  onClick={() => addToCart(p)}
                  style={{ background: '#1976d2', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' }}
                >
                  Agregar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Columna de carrito */}
      <div style={{ flex: 1, borderRight: '1px solid #ccc', padding: 16, display: 'flex', flexDirection: 'column' }}>
        <h3>Carrito de Compras</h3>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {state.productos.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center' }}>Carrito vacío</p>
          ) : (
            state.productos.map((p: Producto) => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <div>
                  <div>{p.nombre}</div>
                  <div style={{ fontSize: '0.85em', color: '#666' }}>${p.precio_venta} x {p.cantidad}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 'bold' }}>${(p.precio_venta * p.cantidad).toFixed(2)}</span>
                  <button 
                    onClick={() => dispatch({ type: 'REMOVE_PRODUCTO', id: p.id })}
                    style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div style={{ borderTop: '2px solid #eee', paddingTop: 16, marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', fontWeight: 'bold' }}>
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Columna de checkout */}
      <div style={{ flex: 1, padding: 16, backgroundColor: '#f9f9f9' }}>
        <h3>Checkout</h3>
        <div style={{ marginBottom: 24 }}>
          <p><strong>Cliente:</strong> Consumidor Final (Default)</p>
          <p><strong>Cajero:</strong> Cajero #1</p>
        </div>
        
        <button 
          onClick={handleCheckout}
          disabled={state.productos.length === 0}
          style={{ 
            width: '100%', 
            padding: 16, 
            fontSize: '1.1em', 
            backgroundColor: state.productos.length === 0 ? '#ccc' : '#2e7d32', 
            color: 'white', 
            border: 'none', 
            borderRadius: 8,
            cursor: state.productos.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          Pagar y Emitir Ticket
        </button>
      </div>
    </div>
  );
};

export default Pos;
