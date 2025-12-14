/**
 * Page: Chat
 * Путь: src/pages/chat/ui/ChatPage.jsx
 */
import { useState, useEffect } from "react";
import { LeftSidebarMenu } from "@/widgets/left-sidebar-menu/ui/LeftSidebarMenu";
import { LeftSidebarChat } from "@/widgets/left-sidebar-chat/ui/LeftSidebarChat";
import { RoomSidebar } from "@/widgets/room-sidebar/ui/RoomSidebar";
import { ProfileSidebar } from "@/widgets/profile-sidebar/ui/ProfileSidebar";
import { ChatMessages } from "@/widgets/chat/messages/ui/ChatMessages";
import { ChatInput } from "@/widgets/chat/input/ui/ChatInput";
import { SettingsModal } from "@/widgets/modals/settings/ui/SettingsModal";
import { useChat } from "@/features/chat/model/useChat";
import { Alert } from "@/shared/ui";
import "./ChatPage.css";

export const ChatPage = () => {
  const {
    currentRoom,
    messages,
    loading,
    sending,
    error,
    sendMessage,
    changeRoom,
    rooms,
    counts,
  } = useChat();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [localError, setLocalError] = useState(null);
  useEffect(() => {
    setLocalError(error);
  }, [error]);

  const handleSendMessage = async (text) => {
    try {
      await sendMessage(text);
    } catch (err) {
      console.error("Ошибка отправки:", err);
    }
  };

  return (
    <>
      <div className="layout-wrapper d-lg-flex">
        <LeftSidebarMenu onOpenSettings={() => setIsSettingsOpen(true)} />
        <LeftSidebarChat />
        <div className="user-chat w-100 overflow-hidden">
          <div className="d-lg-flex">
            <div className="w-100 overflow-hidden position-relative">
              {/*<div className="p-3 p-lg-4 border-bottom user-chat-topbar">
                <div className="row align-items-center">
                  <div className="col-sm-4 col-8">
                    <div className="d-flex align-items-center">
                      <div className="d-block d-lg-none me-2 ms-0">
                        <a
                          href="javascript: void(0);"
                          className="user-chat-remove text-muted font-size-16 p-2"
                        >
                          <i className="ri-arrow-left-s-line"></i>
                        </a>
                      </div>
                      <div className="me-3 ms-0">
                        <img
                          src="assets/images/users/avatar-4.jpg"
                          className="rounded-circle avatar-xs"
                          alt=""
                        />
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <h5 className="font-size-16 mb-0 text-truncate">
                          <strong>{currentRoom}</strong>
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-8 col-4">
                    <ul className="list-inline user-chat-nav text-end mb-0">
                      <li className="list-inline-item">
                        <div className="dropdown">
                          <button
                            className="btn nav-btn dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <i className="ri-search-line"></i>
                          </button>
                          <div className="dropdown-menu p-0 dropdown-menu-end dropdown-menu-md">
                            <div className="search-box p-2">
                              <input
                                type="text"
                                className="form-control bg-light border-0"
                                placeholder="Search.."
                              />
                            </div>
                          </div>
                        </div>
                      </li>

                      <li className="list-inline-item d-none d-lg-inline-block me-2 ms-0">
                        <button
                          type="button"
                          className="btn nav-btn"
                          data-bs-toggle="modal"
                          data-bs-target="#audiocallModal"
                        >
                          <i className="ri-phone-line"></i>
                        </button>
                      </li>

                      <li className="list-inline-item d-none d-lg-inline-block me-2 ms-0">
                        <button
                          type="button"
                          className="btn nav-btn"
                          data-bs-toggle="modal"
                          data-bs-target="#videocallModal"
                        >
                          <i className="ri-vidicon-line"></i>
                        </button>
                      </li>

                      <li className="list-inline-item d-none d-lg-inline-block me-2 ms-0">
                        <button
                          type="button"
                          className="btn nav-btn user-profile-show"
                        >
                          <i className="ri-user-2-line"></i>
                        </button>
                      </li>

                      <li className="list-inline-item">
                        <div className="dropdown">
                          <button
                            className="btn nav-btn dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <i className="ri-more-fill"></i>
                          </button>
                          <div className="dropdown-menu dropdown-menu-end">
                            <a
                              className="dropdown-item d-block d-lg-none user-profile-show"
                              href="#"
                            >
                              View profile{" "}
                              <i className="ri-user-2-line float-end text-muted"></i>
                            </a>
                            <a
                              className="dropdown-item d-block d-lg-none"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#audiocallModal"
                            >
                              Audio{" "}
                              <i className="ri-phone-line float-end text-muted"></i>
                            </a>
                            <a
                              className="dropdown-item d-block d-lg-none"
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#videocallModal"
                            >
                              Video{" "}
                              <i className="ri-vidicon-line float-end text-muted"></i>
                            </a>
                            <a className="dropdown-item" href="#">
                              Archive{" "}
                              <i className="ri-archive-line float-end text-muted"></i>
                            </a>
                            <a className="dropdown-item" href="#">
                              Muted{" "}
                              <i className="ri-volume-mute-line float-end text-muted"></i>
                            </a>
                            <a className="dropdown-item" href="#">
                              Delete{" "}
                              <i className="ri-delete-bin-line float-end text-muted"></i>
                            </a>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>*/}
              {localError && (
                <div className="p-3">
                  <Alert type="danger" onClose={() => setLocalError(null)}>
                    {localError}
                  </Alert>
                </div>
              )}
              <ChatMessages messages={messages} loading={loading} />
              <ChatInput onSendMessage={handleSendMessage} loading={sending} />
            </div>
            <RoomSidebar currentRoom={currentRoom} onRoomChange={changeRoom} />
          </div>
        </div>
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </div>
    </>
  );
};
