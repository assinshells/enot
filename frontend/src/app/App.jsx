/**
 * App: Main Application Component
 * Путь: src/app/App.jsx
 */
import { AuthProvider } from "./providers/AuthProvider";
import { AppRouter } from "./router/AppRouter";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/variables.css";
import "./styles/global.css";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
