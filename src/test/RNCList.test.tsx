import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RNCList from '../pages/RNCList';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('RNCList', () => {
  it('renders the RNC list page', () => {
    renderWithProviders(<RNCList />);
    expect(screen.getByText('Registro de Não Conformidade')).toBeInTheDocument();
  });

  it('allows filtering RNCs', () => {
    renderWithProviders(<RNCList />);
    const filterInput = screen.getByPlaceholderText('Pesquisar RNCs...');
    fireEvent.change(filterInput, { target: { value: 'teste' } });
    expect(filterInput).toHaveValue('teste');
  });

  it('allows creating new RNC', () => {
    renderWithProviders(<RNCList />);
    const newButton = screen.getByText('Nova RNC');
    expect(newButton).toBeInTheDocument();
  });
});