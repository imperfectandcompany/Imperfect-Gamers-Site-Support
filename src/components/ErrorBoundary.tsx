import { Component, ErrorInfo, h } from 'preact';
import { Link } from 'preact-router/match';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<{}, ErrorBoundaryState> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ hasError: true });
    console.log('Error caught in error boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto relative px-8 py-16 max-w-7xl md:px-12 lg:px-18 lg:py-22">
          <h1 className="text-3xl font-normal tracking-tighter text-black sm:text-4xl lg:text-5xl">
            Something went wrong.
          </h1>
          <Link href="/" className="text-indigo-500 hover:underline mt-8 inline-block">
            Go to Home
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
