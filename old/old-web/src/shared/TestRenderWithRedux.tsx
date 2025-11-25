/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import {
  FC, PropsWithChildren,
} from 'react';
import '../App.less';
import {
  Routes, Route, BrowserRouter,
} from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../redux/store';

export const isBrowser = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

const App: FC<any> = ({ children }: PropsWithChildren<{}>) => {
  const ErrorFallback = ({ error, resetErrorBoundary }: any) => (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={(
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  {children}
                </ErrorBoundary>
              )}
            />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};

export default App;
