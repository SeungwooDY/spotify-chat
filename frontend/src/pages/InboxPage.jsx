import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import db from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Send, ArrowLeft } from "lucide-react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";

const InboxPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [participantProfiles, setParticipantProfiles] = useState({});
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [activeOtherUser, setActiveOtherUser] = useState(null);
  const messagesEndRef = useRef(null);

  const authHeaders = {
    withCredentials: true,
    headers: { Authorization: `Bearer ${token}` },
  };

  // Fetch conversations list
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/messages/conversations`,
          authHeaders
        );
        setConversations(res.data);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      } finally {
        setLoadingConvos(false);
      }
    };
    if (token) fetchConversations();
  }, [token, conversationId]);

  // Fetch participant profiles for display names/avatars
  useEffect(() => {
    const fetchProfiles = async () => {
      const otherIds = conversations
        .flatMap((c) => c.participants)
        .filter((id) => id !== user?.id && !participantProfiles[id]);

      const unique = [...new Set(otherIds)];
      if (unique.length === 0) return;

      const profiles = { ...participantProfiles };
      await Promise.all(
        unique.map(async (id) => {
          try {
            const res = await axios.get(`${API_BASE}/users/${id}`);
            profiles[id] = res.data;
          } catch {
            profiles[id] = { id, display_name: id, images: [] };
          }
        })
      );
      setParticipantProfiles(profiles);
    };
    if (conversations.length > 0) fetchProfiles();
  }, [conversations]);

  // Fetch the other user's profile for the active conversation
  useEffect(() => {
    if (!conversationId || !token || !user) {
      setActiveOtherUser(null);
      return;
    }

    const resolve = async () => {
      try {
        // First try to find it in the already-loaded conversations
        const convo = conversations.find((c) => c.id === conversationId);
        let otherId;
        if (convo) {
          otherId = convo.participants.find((id) => id !== user.id);
        } else {
          // Fetch the conversation's messages endpoint to get the convo data
          const res = await axios.get(
            `${API_BASE}/messages/conversations`,
            authHeaders
          );
          const found = res.data.find((c) => c.id === conversationId);
          if (found) {
            setConversations((prev) => {
              const exists = prev.some((c) => c.id === found.id);
              return exists ? prev : [...prev, found];
            });
            otherId = found.participants.find((id) => id !== user.id);
          }
        }

        if (otherId) {
          if (participantProfiles[otherId]) {
            setActiveOtherUser(participantProfiles[otherId]);
          } else {
            const res = await axios.get(`${API_BASE}/users/${otherId}`);
            setActiveOtherUser(res.data);
            setParticipantProfiles((prev) => ({ ...prev, [otherId]: res.data }));
          }
        }
      } catch (err) {
        console.error("Error resolving active conversation user:", err);
      }
    };

    resolve();
  }, [conversationId, token, user, conversations.length]);

  // Real-time messages listener
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, "conversations", conversationId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [conversationId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await axios.post(
        `${API_BASE}/messages/conversations/${conversationId}`,
        { text: newMessage.trim() },
        authHeaders
      );
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  const getOtherUser = (conversation) => {
    const otherId = conversation.participants.find((id) => id !== user?.id);
    return participantProfiles[otherId] || { id: otherId, display_name: otherId, images: [] };
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    const now = new Date();
    const diff = now - date;
    if (diff < 86400000) {
      return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="flex h-[calc(100vh-0px)] bg-secondary md:h-screen">
      {/* Conversation List */}
      <div
        className={`${
          conversationId ? "hidden md:flex" : "flex"
        } w-full flex-col border-r border-border bg-background md:w-80 lg:w-96`}
      >
        <div className="border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">Inbox</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingConvos ? (
            <p className="p-4 text-sm text-muted-foreground">Loading...</p>
          ) : conversations.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              No conversations yet. Visit a user's profile to send a message.
            </p>
          ) : (
            conversations.map((convo) => {
              const other = getOtherUser(convo);
              const isActive = convo.id === conversationId;
              return (
                <button
                  key={convo.id}
                  onClick={() => navigate(`/inbox/${convo.id}`)}
                  className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted ${
                    isActive ? "bg-muted" : ""
                  }`}
                >
                  <Avatar className="h-10 w-10 shrink-0 border border-border bg-muted">
                    <AvatarImage
                      src={other.images?.[0]?.url}
                      alt={other.display_name}
                    />
                    <AvatarFallback className="bg-muted">
                      <User className="h-5 w-5 text-foreground" strokeWidth={2.5} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-medium text-foreground">
                        {other.display_name}
                      </p>
                      <span className="ml-2 shrink-0 text-xs text-muted-foreground">
                        {formatTime(convo.lastMessageAt)}
                      </span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {convo.lastMessage || "No messages yet"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Message Thread */}
      <div
        className={`${
          conversationId ? "flex" : "hidden md:flex"
        } flex-1 flex-col bg-secondary`}
      >
        {conversationId ? (
          <>
            {/* Thread Header */}
            <div className="flex items-center gap-3 border-b border-border bg-background px-4 py-3">
              <button
                onClick={() => navigate("/inbox")}
                className="cursor-pointer md:hidden"
              >
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </button>
              <Avatar className="h-8 w-8 border border-border bg-muted">
                <AvatarImage
                  src={activeOtherUser?.images?.[0]?.url}
                  alt={activeOtherUser?.display_name}
                />
                <AvatarFallback className="bg-muted">
                  <User className="h-4 w-4 text-foreground" strokeWidth={2.5} />
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium text-foreground">
                {activeOtherUser?.display_name || "Loading..."}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {messages.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">
                  Send a message to start the conversation.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {messages.map((msg) => {
                    const isOwn = msg.senderId === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                            isOwn
                              ? "bg-primary text-primary-foreground"
                              : "bg-card text-card-foreground"
                          }`}
                        >
                          <p>{msg.text}</p>
                          <p
                            className={`mt-1 text-[10px] ${
                              isOwn
                                ? "text-primary-foreground/60"
                                : "text-muted-foreground"
                            }`}
                          >
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 border-t border-border bg-background px-4 py-3"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-full border border-border bg-secondary px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!newMessage.trim() || sending}
                className="h-9 w-9 shrink-0 cursor-pointer rounded-full"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Select a conversation to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxPage;
