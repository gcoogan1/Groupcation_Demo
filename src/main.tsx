import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from '@store/index.ts';
import { QueryClientProvider, QueryClient } from 'react-query';
import { createGlobalStyle } from 'styled-components';
import { theme } from './styles/theme.ts';
import { fetchAllGroupcationData } from './store/thunk/fetchAllThunk.ts';

const queryClient = new QueryClient();

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

// PRELOAD BEFORE RENDERING
async function preload() {
  await Promise.all([
    store.dispatch(fetchAllGroupcationData(333)),
  ]);
}

// Wait for preload THEN render
preload().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <DatepickerGlobalStyles />
          <App />
        </QueryClientProvider>
      </Provider>
    </StrictMode>
  );
});
