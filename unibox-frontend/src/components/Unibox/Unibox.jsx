import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import ChatList from "./ChatList";
import ChatDetail from "./ChatDetail";
import ChatSidebar from "./ChatSidebar";
import SearchBar from "./SearchBar";
import Filters from "./Filters";
import {
  fetchChats,
  setCurrentChat,
  clearCurrentChat,
  updateChatLastMessage,
  addMessage,
} from "../../store/chatSlice";
import { fetchJobTypes } from "../../store/jobTypeSlice";
import { fetchPlatforms } from "../../store/platformSlice";

const Unibox = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chatId } = useParams();
  const socketRef = useRef();

  const { chats, currentChat, loading } = useSelector((state) => state.chat);
  const { user, token } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    search: "",
    platform: "",
    jobType: "",
    status: "",
    followUp: false,
  });

  // Connect to WebSocket
  useEffect(() => {
    const SOCKET_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

    socketRef.current = io(SOCKET_URL, {
      query: { token },
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to socket server");
    });

    socketRef.current.on("new_message", (message) => {
      // Update the UI when receiving new messages
      if (currentChat && message.chat === currentChat._id) {
        dispatch(addMessage(message));
      }

      // Update chat list to show new message
      dispatch(
        updateChatLastMessage({
          chatId: message.chat,
          message,
        })
      );
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token, currentChat, dispatch]);

  // Load chats when component mounts or filters change
  useEffect(() => {
    dispatch(fetchChats(filters));
    dispatch(fetchJobTypes());
    dispatch(fetchPlatforms());
  }, [dispatch, filters]);

  // Set current chat when chatId from URL changes
  useEffect(() => {
    if (chatId && chats.length > 0) {
      const chat = chats.find((chat) => chat._id === chatId);
      if (chat) {
        dispatch(setCurrentChat(chat));

        // Join chat room via socket
        socketRef.current?.emit("join_chat", chatId);
      } else {
        navigate("/unibox");
      }
    } else if (!chatId) {
      dispatch(clearCurrentChat());
    }

    return () => {
      // Leave chat room when component unmounts or chatId changes
      if (chatId) {
        socketRef.current?.emit("leave_chat", chatId);
      }
    };
  }, [chatId, chats, dispatch, navigate]);

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Handle chat selection
  const handleChatSelect = (chat) => {
    navigate(`/unibox/${chat._id}`);
  };

  // Handle search
  const handleSearch = (query) => {
    setFilters({
      ...filters,
      search: query,
    });
  };

  // Send a message
  const sendMessage = (content, attachments = []) => {
    if (!currentChat) return;

    const message = {
      content,
      chat: currentChat._id,
      isFromUs: true,
      sender: user._id,
      attachments,
    };

    // Emit message to socket server
    socketRef.current?.emit("send_message", message);
  };

  return (
    <div className="flex h-full">
      {/* Chat List Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
        <div className="p-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="p-4 border-y border-gray-200">
          <Filters filters={filters} onFilterChange={handleFilterChange} />
        </div>

        <div className="flex-1 overflow-y-auto">
          <ChatList
            chats={chats}
            loading={loading}
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
            onSendMessage={sendMessage}
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
          <ChatSidebar
            chat={currentChat}
            onUpdate={(field, value) => {
              // This is handled inside the ChatSidebar component with Redux actions
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Unibox;
