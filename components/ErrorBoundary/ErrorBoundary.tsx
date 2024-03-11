import { Component, PropsWithChildren } from 'react';
import { Layout } from '../Layout';
import { Error } from '../Error';

interface Props {}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<PropsWithChildren<Props>> {
  constructor(props: Props) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    const state = this.state as State;

    // Fallback UI for errors
    if (state.hasError) {
      return (
        <Layout type="account">
          <Error />
        </Layout>
      );
    }

    // Return children components in case of no error
    return this.props.children;
  }
}

export default ErrorBoundary;
