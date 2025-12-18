export const LeftSidebarChat = () => {
  return (
    <>
      {/* start chat-leftsidebar */}
      <div className="chat-leftsidebar me-lg-1 ms-lg-0">
        <div className="tab-content">
          {/* start profile tab-pane */}
          <div
            className="tab-pane"
            id="pills-user"
            role="tabpanel"
            aria-labelledby="pills-user-tab"
          >
            Profile
          </div>
          {/* end profile tab-pane */}

          {/* start rooms tab-pane */}
          <div
            className="tab-pane"
            id="pills-rooms"
            role="tabpanel"
            aria-labelledby="pills-rooms-tab"
          >
            Rooms
          </div>
          {/* end rooms tab-pane */}

          {/* start users tab-pane */}
          <div
            className="tab-pane"
            id="pills-users"
            role="tabpanel"
            aria-labelledby="pills-users-tab"
          >
            Users
          </div>
          {/* end users tab-pane */}
        </div>
      </div>
      {/* end chat-leftsidebar */}
    </>
  );
};
