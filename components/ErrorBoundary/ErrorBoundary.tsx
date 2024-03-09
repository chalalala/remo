import { Component, PropsWithChildren } from 'react';
import { Image } from '../Image';
import { Layout } from '../Layout';

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
          <div className="flex flex-col items-center gap-2 py-12">
            <Image
              src="/icons/remo-cry.svg"
              alt="Error"
            />
            <h2 className="text-2xl font-medium leading-normal text-red-600">
              Oops, there is an error!
            </h2>
          </div>
        </Layout>
      );
    }

    // Return children components in case of no error
    return this.props.children;
  }
}

export default ErrorBoundary;
