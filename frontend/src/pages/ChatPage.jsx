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
    <>
    <div class="d-md-none p-2 border-bottom">
<button type="button" class="btn btn-outline-secondary" data-bs-toggle="offcanvas" data-bs-target="#rightSidebar" aria-controls="rightSidebar">
Открыть правый сайдбар
</button>
</div>
<div className="container-fluid">
<div className="row">


{/* Левый сайдбар */} 
<aside class="col-md-3 col-lg-2 sidebar-left p-3 d-none d-md-block">
<h5>Левый сайдбар</h5>


                  <button
                  className="btn btn-outline-danger"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Выйти
                </button>
</aside>



{/* Основной контент*/} 
<main class="col-12 col-md-6 col-lg-8 p-4">
<h1>Основной контент</h1>
<p>
Здесь располагается основной контент страницы.
Макет адаптивный и корректно работает на мобильных устройствах.
</p>
</main>

{/* Правый сайдбар desktop*/} 
<aside class="col-md-3 col-lg-2 sidebar-right p-3 d-none d-md-block">
<h5>Правый сайдбар</h5>
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
</aside>

{/* Футер (левый сайдбар на мобилке)*/} 
<footer class="d-md-none p-3 border-top">
<h5>Левый сайдбар</h5>
<ul class="nav flex-column">
<li class="nav-item"><a class="nav-link" href="#">Пункт 1</a></li>
<li class="nav-item"><a class="nav-link" href="#">Пункт 2</a></li>
<li class="nav-item"><a class="nav-link" href="#">Пункт 3</a></li>
</ul>
</footer>



{/* Offcanvas: правый сайдбар (мобилка)*/} 
<div class="offcanvas offcanvas-end" tabindex="-1" id="rightSidebar">
<div class="offcanvas-header">
<h5 class="offcanvas-title">Правый сайдбар</h5>
<button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
</div>
<div class="offcanvas-body">
<p>Дополнительная информация</p>
</div>
</div>


</div>
</div>
</>
  );
};

export default ChatPage;