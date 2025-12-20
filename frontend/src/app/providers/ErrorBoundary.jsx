/**
 * Error Boundary - Перехоплення помилок React
 * Запобігає падінню всього додатку
 */
import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Можна надіслати помилку в сервіс логування
    if (process.env.NODE_ENV === "production") {
      // Приклад: logErrorToService(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container d-flex justify-content-center align-items-center vh-100">
          <div className="card" style={{ maxWidth: "500px" }}>
            <div className="card-body text-center p-5">
              <i
                className="bi bi-exclamation-triangle text-danger"
                style={{ fontSize: "4rem" }}
              ></i>

              <h3 className="mt-3 mb-3">Что-то пошло не так</h3>

              <p className="text-muted mb-4">
                Произошла непредвиденная ошибка. Пожалуйста, попробуйте обновить
                страницу.
              </p>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="alert alert-danger text-start mb-4">
                  <p className="mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary>Stack trace</summary>
                      <pre className="mt-2" style={{ fontSize: "0.8rem" }}>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="d-flex gap-2 justify-content-center">
                <button
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Обновить страницу
                </button>

                <button
                  className="btn btn-outline-secondary"
                  onClick={this.handleReset}
                >
                  Попробовать снова
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
