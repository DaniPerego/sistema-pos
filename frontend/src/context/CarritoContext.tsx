import React, { createContext, useContext, useReducer } from 'react';

export type Producto = {
  id: number;
  nombre: string;
  precio_venta: number;
  cantidad: number;
};

export type CarritoState = {
  productos: Producto[];
};

const initialState: CarritoState = {
  productos: [],
};

function carritoReducer(state: CarritoState, action: any): CarritoState {
  switch (action.type) {
    case 'ADD_PRODUCTO':
      // Si el producto ya está, suma cantidad
      const existente = state.productos.find(p => p.id === action.producto.id);
      if (existente) {
        return {
          productos: state.productos.map(p =>
            p.id === action.producto.id
              ? { ...p, cantidad: p.cantidad + action.producto.cantidad }
              : p
          ),
        };
      }
      return {
        productos: [...state.productos, action.producto],
      };
    case 'REMOVE_PRODUCTO':
      return {
        productos: state.productos.filter(p => p.id !== action.id),
      };
    case 'CLEAR_CARRITO':
      return initialState;
    default:
      return state;
  }
}

const CarritoContext = createContext<any>(null);

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(carritoReducer, initialState);
  return (
    <CarritoContext.Provider value={{ state, dispatch }}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  return useContext(CarritoContext);
}
