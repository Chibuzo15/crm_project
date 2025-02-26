// File: src/components/Unibox/Unibox.jsx
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import ChatList from "./ChatList";
import ChatDetail from "./ChatDetail";
import ChatSidebar from "./ChatSidebar";
import Filters from "./Filters";
import SearchBar from "./SearchBar";
import { fetchChats, setCurrentChat } from "../../redux/actions/chatActions";
import { fetchJobTypes } from "../../redux/actions/jobTypeActions";
import { fetchPlatforms } from "../../redux/actions/platformActions";
import "./Unibox.css";

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
    const SOCKET_URL =
      process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

    socketRef.current = io(SOCKET_URL, {
      query: { token },
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to socket server");
    });

    socketRef.current.on("new_message", (message) => {
      // Update the UI when receiving new messages
      if (currentChat && message.chat === currentChat._id) {
        dispatch({
          type: "ADD_MESSAGE",
          payload: message,
        });
      }

      // Update chat list to show new message
      dispatch({
        type: "UPDATE_CHAT_LAST_MESSAGE",
        payload: {
          chatId: message.chat,
          message,
        },
      });
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [token, currentChat, dispatch]);

  // Load chats when component mounts
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
      } else {
        navigate("/unibox");
      }
    }
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
    socketRef.current.emit("send_message", message);

    // Optimistically add message to the UI
    dispatch({
      type: "ADD_MESSAGE",
      payload: {
        ...message,
        _id: Date.now().toString(), // Temporary ID
        createdAt: new Date().toISOString(),
      },
    });
  };

  return (
    <div className="unibox-container">
      <div className="unibox-sidebar">
        <SearchBar onSearch={handleSearch} />
        <Filters filters={filters} onFilterChange={handleFilterChange} />
        <ChatList
          chats={chats}
          loading={loading}
          selectedChatId={currentChat?._id}
          onChatSelect={handleChatSelect}
        />
      </div>

      <div className="unibox-main">
        {currentChat ? (
          <ChatDetail
            chat={currentChat}
            socket={socketRef.current}
            onSendMessage={sendMessage}
          />
        ) : (
          <div className="no-chat-selected">
            <h3>Select a chat to start messaging</h3>
            <p>Or create a new chat from the sidebar</p>
          </div>
        )}
      </div>

      {currentChat && (
        <ChatSidebar
          chat={currentChat}
          onUpdate={(field, value) => {
            dispatch({
              type: "UPDATE_CURRENT_CHAT",
              payload: {
                _id: currentChat._id,
                [field]: value,
              },
            });
          }}
        />
      )}
    </div>
  );
};

export default Unibox;
