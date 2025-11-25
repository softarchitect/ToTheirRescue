/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import React, {
  useState, useEffect, ReactNode, ErrorInfo,
} from 'react';

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

function ErrorBoundary(props: ErrorBoundaryProps): JSX.Element {
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const logErrorToMyService = (error: any) => {
      // Example "componentStack":
      //   in ComponentThatThrows (created by App)
      //   in ErrorBoundary (created by App)
      //   in div (created by App)
      //   in App
      console.error('Error occurred:', error);
      // You can add your error logging logic here
    };

    const componentDidCatch = (error: Error, info: ErrorInfo) => {
      setHasError(true);
      logErrorToMyService(error);
    };

    window.addEventListener('error', logErrorToMyService);
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      event.preventDefault();
      componentDidCatch(event.reason as Error, { componentStack: '' });
    });

    // Cleanup the event listeners when the component unmounts
    return () => {
      window.removeEventListener('error', logErrorToMyService);
      window.removeEventListener('unhandledrejection', (event) => {
        event.preventDefault();
        componentDidCatch(event.reason as Error, { componentStack: '' });
      });
    };
  }, []);

  if (hasError) {
    // You can render any custom fallback UI
    return <>{props.fallback}</>;
  }

  return <>{props.children}</>;
}

ErrorBoundary.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  fallback: null, // Provide a default value for 'fallback'
};

export default ErrorBoundary;
