import { Component, type ReactNode } from 'react';


interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  showDetails?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDevelopment = import.meta.env.DEV;
      const showDetails = this.props.showDetails ?? isDevelopment;

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="max-w-2xl w-full mx-auto px-6 py-12">
            <div className="bg-white rounded-lg shadow-md p-10 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-6">
                <span className="text-6xl">⚠️</span>
              </div>

              <h1 className="text-5xl font-bold text-gray-900 mb-4">Oops!</h1>

              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Something went wrong
              </h2>

              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                An unexpected error occurred. Don't worry, it's not your fault.
              </p>

              {showDetails && this.state.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                  <p className="text-sm font-semibold text-red-800 mb-2">
                    Error Details:
                  </p>
                  <p className="text-xs font-mono text-red-700 break-all">
                    {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <details className="mt-2">
                      <summary className="text-xs text-red-600 cursor-pointer hover:text-red-800">
                        Stack Trace
                      </summary>
                      <pre className="text-xs text-red-600 mt-2 overflow-auto max-h-40">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReset}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-md transition-colors shadow-sm uppercase tracking-wide"
                >
                  TRY AGAIN
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-8 rounded-md transition-colors shadow-sm border border-gray-300 uppercase tracking-wide"
                >
                  RELOAD PAGE
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}