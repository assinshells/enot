/**
 * Widget: Left Sidebar Menu
 * Путь: src/widgets/left-sidebar-menu/ui/LeftSidebarMenu.jsx
 */
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./LeftSidebarChat.css";

export const LeftSidebarChat = ({}) => {
  return (
    <>
      <div className="chat-leftsidebar me-lg-1 ms-lg-0">
        <div className="tab-content">TabContent</div>
      </div>
    </>
  );
};
