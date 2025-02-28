import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useGetChatsQuery,
  useSendMessageMutation,
  useGetChatByIdQuery,
  useUpdateChatMutation,
} from "../../store/api";
import { setCurrentChat, clearCurrentChat } from "../../store/chatSlice";
import ChatList from "./ChatList";
import ChatDetail from "./ChatDetail";
import SearchBar from "./SearchBar";
import Filters from "./Filters";
import ChatSidebar from "./ChatSidebar";
import socket from "../../utils/socket";

const Unibox = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { chatId } = useParams();
  const socketRef = useRef();

  const { currentChat } = useSelector((state) => state.chat);
  const { user, token } = useSelector((state) => state.auth);

  // State for chat filters and search
  const [filters, setFilters] = useState({
    platform: "",
    jobType: "",
    status: "",
    followUp: false,
    starred: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Use RTK Query hook for fetching chats with filters
  const {
    data: chats = [],
    isLoading: isLoadingChats,
    refetch: refetchChats,
  } = useGetChatsQuery({
    ...filters,
    search: searchTerm,
  });

  // Get chat by ID if chatId is present
  const { data: chatFromId, isLoading: isLoadingChatFromId } =
    useGetChatByIdQuery(chatId, {
      skip: !chatId,
    });

  // Send message mutation
  const [sendMessage, { isLoading: isSendingMessage }] =
    useSendMessageMutation();

  // Update chat mutation
  const [updateChat] = useUpdateChatMutation();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Auto-close sidebar on mobile if chat is selected
      if (mobile && currentChat && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentChat, sidebarOpen]);

  // Handle WebSocket connection
  useEffect(() => {
    socketRef.current = socket;

    // Connect with authentication
    socketRef.current.connect();

    // Join user's room for all notifications
    if (user && user._id) {
      socketRef.current.emit("join", { userId: user._id });
    }

    // Listen for new messages and other events
    socketRef.current.on("new_message", (message) => {
      // Refetch chats to get the updated list with new messages
      refetchChats();
    });

    socketRef.current.on("chat_updated", () => {
      // Refetch chats when any chat is updated
      refetchChats();
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [user, refetchChats]);

  // Set current chat when chatId changes
  useEffect(() => {
    if (chatId && !isLoadingChatFromId && chatFromId) {
      dispatch(setCurrentChat(chatFromId));

      // Join chat room for real-time updates
      socketRef.current?.emit("join_chat", chatId);
    } else if (!chatId && currentChat) {
      dispatch(clearCurrentChat());
    }

    return () => {
      // Leave chat room when component unmounts or chatId changes
      if (chatId) {
        socketRef.current?.emit("leave_chat", chatId);
      }
    };
  }, [chatId, chatFromId, isLoadingChatFromId, dispatch, currentChat]);

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchTerm(query);
  };

  // Handle chat selection
  const handleChatSelect = (chat) => {
    navigate(`/unibox/${chat._id}`);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Handle sending a message
  const handleSendMessage = async (content, attachments = []) => {
    if (!currentChat) return;

    try {
      const messageData = {
        chatId: currentChat._id,
        content,
        attachments,
      };

      await sendMessage(messageData).unwrap();

      // Emit typing stopped event
      socketRef.current?.emit("stop_typing", {
        chatId: currentChat._id,
        userId: user._id,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Handle typing indication
  const handleTyping = () => {
    if (!currentChat) return;

    socketRef.current?.emit("typing", {
      chatId: currentChat._id,
      userId: user._id,
    });
  };

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle chat update from sidebar
  const handleChatUpdate = async (field, value) => {
    if (!currentChat) return;

    try {
      await updateChat({
        id: currentChat._id,
        [field]: value,
      }).unwrap();
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
    }
  };

  return (
    <div className="flex h-full ">
      {/* Chat List Sidebar */}
      <div
        className={`${
          isMobile ? (sidebarOpen ? "block" : "hidden") : "block"
        } w-80 border-r border-gray-200 flex flex-col bg-white`}
      >
        <div className="p-4">
          <SearchBar onSearch={handleSearch} value={searchTerm} />
        </div>

        <div className="p-4 border-y border-gray-200">
          <Filters filters={filters} onFilterChange={handleFilterChange} />
        </div>

        <div className="flex-1 overflow-y-auto">
          <ChatList
            chats={chats}
            loading={isLoadingChats}
            selectedChatId={currentChat?._id}
            onChatSelect={handleChatSelect}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex">
        {currentChat ? (
          <ChatDetail
            chat={currentChat}
            socket={socketRef.current}
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
            isLoading={isLoadingChatFromId}
            isSending={isSendingMessage}
            onToggleSidebar={toggleSidebar}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Select a chat to start messaging
              </h3>
              <p className="text-gray-500">
                Or use the search and filters to find specific conversations
              </p>
            </div>
          </div>
        )}

        {/* Chat Details Sidebar */}
        {currentChat && (
          <div
            className={`${
              isMobile ? (sidebarOpen ? "hidden" : "block") : "block"
            } w-64 border-l border-gray-200 bg-white`}
          >
            <ChatSidebar chat={currentChat} onUpdate={handleChatUpdate} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Unibox;
