import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux';
import { persistor, store } from '@store/index.ts';
import { QueryClientProvider, QueryClient } from 'react-query';
import { PersistGate } from 'redux-persist/integration/react';
import { createGlobalStyle } from 'styled-components';
import { theme } from './styles/theme.ts';

const queryClient = new QueryClient();

// Style react-datepicker calender
export const DatepickerGlobalStyles = createGlobalStyle`
  .react-datepicker-popper {
    position: absolute;
    z-index: 9999 !important;
    top: 22px !important;
  }

  .react-datepicker {
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .react-datepicker__day--selected {
    background-color: ${theme.primary};
    color: #fff;
  }
`;


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
      <DatepickerGlobalStyles />
        <App />
      </QueryClientProvider>
    </PersistGate>
    </Provider>
  </StrictMode>,
)
