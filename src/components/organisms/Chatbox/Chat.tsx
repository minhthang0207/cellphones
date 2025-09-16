import { useUserStore } from "@/store/user";
import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { IoChatboxOutline } from "react-icons/io5";
import { HiPaperAirplane } from "react-icons/hi2";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { FaTimes } from "react-icons/fa";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  conversation_id: string;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
}

interface ServerToClientEvents {
  new_message: (newMessage: Message) => void,
  messages_read: (data: { ids: string[] }) => void,
  message: (msg: { from: string; content: string; room: string }) => void;
}

interface ClientToServerEvents {
  join_room: (userId: string) => void;
  send_message: (data: { sender_id: string; content: string }) => void;
  mark_as_read: (unreadIds: string[]) => void;
}

const UserChat = () => {
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [conversationId, setConversationId] = useState<string>("");
  const [timestampMsgAdminId, setTimestampMsgAdminId] = useState<string>("");
  const [statusMsgId, setStatusMsgId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false); // Để quản lý việc mở/đóng chatbox
  const [unreadCount, setUnreadCount] = useState(0); // Để lưu số lượng tin nhắn chưa đọc
  const user = useUserStore((state) => state.user);
  const [adminInfo, setAdminInfo] = useState<Participant | null>(null);
  const token = Cookies.get("session");

  const formatDateTime = (dateString: string, types: "full" | "time") => {
    const date = new Date(dateString); // Tạo đối tượng Date từ chuỗi

    // Lấy ngày, tháng, năm
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    // Lấy giờ, phút, giây
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    // const seconds = date.getSeconds().toString().padStart(2, "0");

    // Trả về chuỗi định dạng "dd/mm/yyyy hh:mm:ss"
    if(types === "full") {
      return `${day}/${month}/${year} LÚC ${hours}:${minutes}`;
    } else if(types === "time") {
      return `${hours}:${minutes}`;
    }
  };

  useEffect(() => {
    if (isChatOpen) {
      // dùng setTimeout để chắc chắn DOM đã render
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      }, 0);
    }
  }, [isChatOpen]);

  // 🔹 Mỗi khi có tin nhắn mới thì cuộn mượt xuống cuối
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    socketRef.current = io(`${process.env.NEXT_PUBLIC_API_URL}`);

    // join room (userId = room)
    socketRef.current.on("connect", () => {

      // join lại room mỗi lần connect
      socketRef.current?.emit("join_room", user.id);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user.id]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chats/${user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching messages");
        }

        const result = await response.json();

        setConversationId(result.id)

        setMessages(result.messages); // Cập nhật state với dữ liệu tin nhắn từ API

        setAdminInfo(result.user2)

        // Tính số lượng tin nhắn chưa đọc mà người gửi là admin
        const unreadMessages = result.messages.filter(
          (msg: Message) => !msg.isRead && msg.receiver_id === user.id
        );
        setUnreadCount(unreadMessages.length);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (user.id) {
      fetchMessages();

      if(socketRef.current) {
        socketRef.current.on("new_message", (newMessage) => {
          setMessages((prevMessages) => [...prevMessages, newMessage]); // Thêm tin nhắn mới vào state
          if (newMessage.receiver_id === user.id && !newMessage.isRead) {
            setUnreadCount((prev) => prev + 1); // Cập nhật số tin nhắn chưa đọc
          }
        });
  
        socketRef.current.on("messages_read", (data) => {
  
          setMessages((prev) =>
            prev.map((msg) =>
              data.ids.includes(msg.id) ? { ...msg, isRead: true } : msg
            )
          );
          setUnreadCount(0);
        });
      }
    }

    return () => {
      if(socketRef.current) {
        socketRef.current.off("messages_read");
      }
    };
  }, [user.id, token]);

  const sendMessage = () => {
    if (!content.trim()) {
      return;
    }

    const newMessage = {
      conversation_id: conversationId,
      sender_id: user.id,
      content,
    };

    if(socketRef.current) {
      socketRef.current.emit("send_message", newMessage); // Gửi tin nhắn mới đến server
      setContent(""); // Xóa nội dung sau khi gửi
    }
  };

  const toggleChatbox = () => {
    setIsChatOpen(!isChatOpen);

    // Khi mở chatbox, đánh dấu tất cả tin nhắn từ admin là đã đọc
    if (!isChatOpen) {
      const unreadMessage = messages.filter(
        (msg) => !msg.isRead && msg.receiver_id === user.id
      );
      if (unreadMessage.length > 0) {
        const unreadIds = unreadMessage.map((msg) => msg.id);

        if(socketRef.current) {
          socketRef.current.emit("mark_as_read", unreadIds);
        }

        setUnreadCount(0);
      }
    }
  };

  const handleFocus = () => {
    const unreadMessage = messages.filter(
      (msg) => !msg.isRead && msg.receiver_id === user.id
    );
    if (unreadMessage.length > 0) {
      const unreadIds = unreadMessage.map((msg) => msg.id);
      
      if(socketRef.current) {
        socketRef.current.emit("mark_as_read", unreadIds);
      }

      setUnreadCount(0);
    }
  };

  return (
    <div className="w-[300px] border rounded-lg">
      <div
        className="fixed bottom-12 right-16 bg-blue-500 text-white p-4 rounded-full cursor-pointer"
        onClick={toggleChatbox}
      >
        <div className="relative">
          <span>
            <IoChatboxOutline size={20} />
          </span>
          {unreadCount > 0 && (
            <span className="absolute -top-4 -right-4 bg-red-500 text-white text-xs rounded-full p-1">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
      {/* Chatbox */}
      {isChatOpen && (
        <div
          className="fixed bottom-28 right-16 w-[350px] h-[500px] bg-white border rounded-lg overflow-hidden"
          onClick={() => handleFocus()}
        >
          {/* Header */}
          <div className="flex h-full flex-col">
            <div className="font-bold px-4 py-2 bg-red-400 sticky top-0 z-20 flex items-center justify-between">
              <p className="">
                Đoạn hội thoại
              </p>
    
              <div className="cursor-pointer" onClick={() => setIsChatOpen(false)}>
                <FaTimes size={20} className="text-black/50 hover:text-black/80 transition duration-150"/>
              </div>
            </div>

            {/* Nôi dung chat */}
            <div className="w-full flex flex-col gap-1 px-4 flex-1 overflow-y-scroll custom-scrollbar">
              <div className="w-full  px-2 py-1 ml-0 mt-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={`${adminInfo?.avatar}`}/>
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div
                      className="px-4 w-fit py-2 rounded-lg border border-red-400">
                      <p>Xin chào tôi có thể giúp gì cho bạn?</p>
                    </div>
                  </div>
              </div>
              {messages.map((msg, index) => {
                const prevMsg = messages[index - 1];
                const nextMsg = messages[index + 1];

                const currentTime = new Date(msg.createdAt);
                let showTimestamp = false;
                let showTimeSwitchSide = false

                // Thể hiện thời gian sau 1 khoảng thời gian 15p
                if(prevMsg) {
                  const prevTime = new Date(prevMsg.createdAt);
                  const difMinutes = (currentTime.getTime() - prevTime.getTime())/ 60000;

                  if(difMinutes > 15) {
                    showTimestamp = true;
                  }
                } else {
                  // Tin nhắn đầu tiên thì luôn show thời gian
                  showTimestamp = true;
                }

                // Thể hiện thời gian ở cuối mỗi tin nhắn khi đổi vai (người này chat rồi người khác chat)
                if(nextMsg) {
                  if(msg.sender_id !== nextMsg.sender_id) {
                    showTimeSwitchSide = true;
                  }
                } else {
                  showTimeSwitchSide = true;
                }

                return (
                  <div
                    key={msg.id}
                    className={`w-full px-2 py-1  ${
                      msg.sender_id === user.id ? "ml-auto " : "ml-0 "
                    }`}
                  >
                    {
                      timestampMsgAdminId === msg.id  && !showTimestamp && (
                        <p className="w-fit mx-auto mb-4 text-sm"> {formatDateTime(msg.createdAt, "full")}</p>
                      )
                    }

                    {
                      showTimestamp && (
                        <p className="w-fit mx-auto mb-4 text-sm"> {formatDateTime(msg.createdAt, "full")}</p>
                      )
                    }
                    <div className={`flex items-center gap-4 w-full ${msg.sender_id === user.id && "flex-row-reverse"}`}>
                      {
                        msg.sender_id === adminInfo?.id && (
                          <div >
                            <Avatar className="z-10">
                              <AvatarImage src={`${msg.sender_id === user.id ? user.avatar : adminInfo?.avatar}` }/>
                              <AvatarFallback>AD</AvatarFallback>
                            </Avatar>
                          </div>
                        )
                      }
                      <div className={`${msg.sender_id === user.id ? "w-full" : "w-[80%]"}`}>
                        <div
                          className={`w-fit relative px-4 py-2 rounded-lg ${
                            msg.sender_id === user.id
                              ? "ml-auto bg-red-400 text-white max-w-[70%] "
                              : "border border-red-400 max-w-[80%] "
                          } ${showTimeSwitchSide && "pb-6"}
                          `}
                          onClick={() => {
                            if(msg.sender_id === user.id) {
                              if(statusMsgId === msg.id) {
                                setStatusMsgId("");
                              } else {
                                setStatusMsgId(msg.id || "");
                              }
                            } 
                            if(msg.sender_id === adminInfo?.id) {
                              if(timestampMsgAdminId === msg.id) {
                                setTimestampMsgAdminId("");
                              } else {
                                setTimestampMsgAdminId(msg.id || "");
                              }
                            }
                          }}
                        >
                          <p className="break-words">{msg.content}</p>
                          {
                            showTimeSwitchSide && (
                              <p className="w-fit mx-auto mb-0 text-xs absolute left-1.5 bottom-1"> {formatDateTime(msg.createdAt, "time")}</p>
                            )
                          }
                        </div>
                        {
                          msg.sender_id === user.id && statusMsgId === msg?.id && index !== messages.length - 1 && (
                            <p className="w-fit ml-auto text-xs text-neutral-500"> {msg.isRead ? "Đã đọc" : "Đã gửi"}</p>
                          )
                        }
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs text-neutral-500">
                      { 
                        msg.sender_id === user.id && index === messages.length - 1 && (
                          <p className="w-fit ml-auto"> {msg.isRead ? "Đã đọc" : "Đã gửi"}</p>
                        )
                      }
                    </div>
                  </div>
                )
              })}

              {/* div đánh dấu cuối */}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex gap-2 w-full sticky z-30 border-t border-red-400 py-2 bottom-0 bg-white shadow-lg px-4 items-stretch">
              <div className="px-4 py-2 border-2 rounded-lg w-[84%] border-black/20 focus-within:border-black/60">
                <input
                  className="border-none w-full h-full outline-none text-sm"
                  type="text"
                  value={content}
                  placeholder="Nhập tin nhắn"
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                />
              </div>
              <div className="w-[16%]">
                <button
                  className="h-full w-full flex justify-center items-center px-4 py-2 border border-red-400 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition duration-150"
                  onClick={sendMessage}
                >
                  <HiPaperAirplane size={18} className="" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserChat;
