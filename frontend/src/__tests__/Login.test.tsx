import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';

describe('Login', () => {
  it('muestra error si los campos están vacíos', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Entrar'));
    expect(screen.getByText(/Error/)).toBeInTheDocument;
  });
});
