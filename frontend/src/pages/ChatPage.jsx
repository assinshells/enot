import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

/**
 * Главная страница (защищенная)
 */
const ChatPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="card-title mb-0">
                  Добро пожаловать, {user?.nickname}!
                </h2>
                <button
                  className="btn btn-outline-danger"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Выйти
                </button>
              </div>

              <div className="card bg-light">
                <div className="card-body">
                  <h5 className="card-title">Информация о профиле</h5>
                  <div className="mt-3">
                    <p className="mb-2">
                      <strong>Никнейм:</strong> {user?.nickname}
                    </p>
                    {user?.email && (
                      <p className="mb-2">
                        <strong>Email:</strong> {user.email}
                      </p>
                    )}
                    <p className="mb-0">
                      <strong>ID:</strong> {user?._id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center text-muted">
                <p>Вы успешно авторизованы в системе</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;