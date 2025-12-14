/**
 * Widget: Profile Sidebar
 * Путь: src/widgets/profile-sidebar/ui/ProfileSidebar.jsx
 */
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { formatDate } from "@/shared/lib/utils/formatTime";

export const ProfileSidebar = () => {
  const { user } = useAuth();

  return (
    <>
      {/* Desktop версия */}
      <aside className="col-md-3 col-lg-2 sidebar-right p-3 d-none d-md-block">
        <h5 className="mb-3">Профиль</h5>
        <div className="profile-info">
          <div className="mb-3">
            <small className="text-muted d-block">Никнейм</small>
            <strong>{user?.nickname}</strong>
          </div>
          {user?.email && (
            <div className="mb-3">
              <small className="text-muted d-block">Email</small>
              <strong className="text-break">{user.email}</strong>
            </div>
          )}
          <div className="mb-3">
            <small className="text-muted d-block">ID</small>
            <code className="text-break">{user?._id}</code>
          </div>
          {user?.createdAt && (
            <div className="mb-3">
              <small className="text-muted d-block">Регистрация</small>
              <small>{formatDate(user.createdAt)}</small>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Offcanvas */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="profileSidebar"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Профиль</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="mb-3">
            <small className="text-muted d-block">Никнейм</small>
            <strong>{user?.nickname}</strong>
          </div>
          {user?.email && (
            <div className="mb-3">
              <small className="text-muted d-block">Email</small>
              <strong className="text-break">{user.email}</strong>
            </div>
          )}
          <div className="mb-3">
            <small className="text-muted d-block">ID</small>
            <code className="text-break">{user?._id}</code>
          </div>
        </div>
      </div>
    </>
  );
};
