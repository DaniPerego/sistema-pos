import { render } from '@testing-library/react';
import { CarritoProvider } from '../context/CarritoContext';
import Pos from '../pages/Pos';

describe('POS', () => {
  it('renderiza las 3 columnas', () => {
    const { getByText } = render(
      <CarritoProvider>
        <Pos />
      </CarritoProvider>
    );
    expect(getByText('Búsqueda')).toBeInTheDocument();
    expect(getByText('Carrito')).toBeInTheDocument();
    expect(getByText('Checkout')).toBeInTheDocument();
  });
});
