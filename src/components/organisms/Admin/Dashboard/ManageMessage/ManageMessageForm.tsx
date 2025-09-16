"use client";
import Cookies from "js-cookie";
import { useUserStore } from "@/store/user";
import { io, Socket } from "socket.io-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import React, { useState, useEffect, useRef } from "react";
import { HiPaperAirplane } from "react-icons/hi2";
import { toast } from "sonner";

// Định nghĩa kiểu dữ liệu cho user
interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  conversation_id: string;
  sender?: ChatUser;
}

// Định nghĩa kiểu dữ liệu cho phòng chat (room)
interface Room {
  id: string;
  user1_id: string;
  user2_id: string;
  last_message_id: string;
  createdAt: string;
  updatedAt: string;
  user1: ChatUser;
  user2: ChatUser;
  lastMessage: Message;
  conversation_id: string;
}

interface ServerToClientEvents {
  new_message: (newMessage: Message) => void,
  messages_read: (data: { ids: string[] }) => void,
  message: (msg: { from: string; content: string; room: string }) => void;
  new_room: (newRoom: Room) => void,
}

interface ClientToServerEvents {
  join_room: (userId: string) => void;
  send_message: (data: { sender_id: string; content: string }) => void;
  mark_as_read: (unreadIds: string[]) => void;
}

const ManageMessageForm: React.FC = () => {

  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null); // Để quản lý việc mở/đóng chatbox
  const [messages, setMessages] = useState<Message[]>([]);
  const user = useUserStore((state) => state.user);
  const [content, setContent] = useState("");
  const [userReceiveId, setUserReceiveId] = useState<ChatUser>({
    id: "",
    name: "",
    avatar: "",
    role: ""
  });
  const token = Cookies.get("session");
 
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString); // Tạo đối tượng Date từ chuỗi

    // Lấy ngày, tháng, năm
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    // Lấy giờ, phút, giây
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    // Trả về chuỗi định dạng "dd/mm/yyyy hh:mm:ss"
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const sendMessage = () => {
    if (!content.trim()) {
      toast.error("Vui lòng nhập tin nhắn");
      return;
    }

    const newMessage = {
      // Tạo ID giả cho tin nhắn mới
      conversation_id: selectedRoomId,
      sender_id: user.id,
      receiver_id: userReceiveId, // ID của admin (có thể thay đổi tùy thuộc vào tình huống)
      content,
    };

    if(socketRef.current) {
      socketRef.current.emit("send_message", newMessage); // Gửi tin nhắn mới đến server
      setContent(""); // Xóa nội dung sau khi gửi
    }
  };

  useEffect(() => {
      if (selectedRoomId) {
        // dùng setTimeout để chắc chắn DOM đã render
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
        }, 0);
      }
    }, [selectedRoomId]);
  
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
    // Lấy danh sách các phòng chat
    const fetchRooms = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chats/admin/${user.id}/rooms`,
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


        setRooms(result.rooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    if (user.id) {
      // Fetch phòng
      fetchRooms();

      if(socketRef.current) {
        // Sự kiện nhận tin nhắn mới
        socketRef.current.on("new_message", (newMessage) => {
          console.log("admin đã nhận được tin nhắn", newMessage);
          setMessages((prevMessages) => [...prevMessages, newMessage]); // Thêm tin nhắn mới vào state

          setRooms((prevRooms) =>
            prevRooms.map((prevRoom) =>
              prevRoom.id === newMessage.conversation_id
                ? {
                    ...prevRoom,
                    lastMessage: newMessage,
                    last_message_id: newMessage.id,
                  }
                : prevRoom
            )
          );
        });

        // Sự kiện đọc tin nhắn mới
        socketRef.current.on("messages_read", (data) => {
  
          setMessages((prev) =>
            prev.map((msg) =>
              data.ids.includes(msg.id) ? { ...msg, isRead: true } : msg
            )
          );
        });

        // Sự kiện khi có phòng mới (phòng này có người nhắn tin)
        socketRef.current.on("new_room", (newRoom) => {
          setRooms((prevRoom) => [newRoom, ...prevRoom]);
        });
      }
    }

    return () => {
      if(socketRef.current) {
        socketRef.current.off("new_message");
        socketRef.current.off("messages_read");
      }
    };
  }, [user.id, token]);

  const handleRoomClick = async (conversation: Room) => {
    // Khi admin nhấn vào phòng, lấy danh sách tin nhắn giữa admin và user
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chats/admin/${user.id}/rooms/${conversation.id}/messages`,
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
      if (result) {
        setUserReceiveId(result.messages.sender_id);

        // Tin nhắn được gửi từ user nhưng chưa đọc (admin là người nhận)
        const unreadMessage = result.messages.filter(
          (msg: Message) => !msg.isRead && msg.receiver_id === user.id
        );
        if (unreadMessage.length > 0) {
          const unreadIds = unreadMessage.map((msg: Message) => msg.id);
          if(socketRef.current) {
            socketRef.current.emit("mark_as_read", unreadIds);
          }
        }

        // Cập nhật lại trạng thái của lastMessage
        setRooms((prevRooms) =>
          prevRooms.map((prevRoom) => {
            if (prevRoom.id === conversation.id) {
              return {
                ...prevRoom,
                lastMessage: {
                  ...prevRoom.lastMessage,
                  isRead: true,
                },
              };
            }
            return prevRoom;
          })
        );
        setMessages(result.messages);
        setSelectedRoomId(conversation.id);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  

  const handleFocus = () => {
    // Cập nhật lại trạng thái các tin nhắn mà người gửi là user gửi đến admin
    const unreadMessage = messages.filter(
      (msg) => !msg.isRead && msg.receiver_id === user.id
    );

    if (unreadMessage.length > 0) {
      const unreadIds = unreadMessage.map((msg) => msg.id);
      if(socketRef.current) {
        socketRef.current.emit("mark_as_read", unreadIds);
      }

      // Cập nhật lại trạng thái của lastMessge
      setRooms((prevRooms) => {
        const updatedRooms = [...prevRooms]; // Tạo bản sao để giữ tính bất biến
        const room = updatedRooms.find((prevRoom) =>
          prevRoom.id === selectedRoomId
        );
        if (room) {
          room.lastMessage.isRead = true; // Cập nhật isRead
        }
        return updatedRooms;
      });
    }
  };

  return (
    <div className="p-4">
      <h4 className="uppercase font-bold text-xl mb-4">Quản lý tin nhắn</h4>
      <div className="flex gap-8 h-[560px]">
        <div className="w-[40%] bg-white rounded-lg p-4 overflow-y-scroll custom-scrollbar">
          <h5 className="font-bold">Danh sách các đoạn tin nhắn</h5>
          <ul className="flex flex-col gap-4 mt-4">
            {rooms.map((room, index) => (
              <li
                key={index}
                className={`p-4 flex flex-col justify-center gap-4 border-2 rounded-lg cursor-pointer ${
                  !room.lastMessage.isRead && room.lastMessage.sender_id !== user.id && " border-red-500 animate-blink"
                } ${room.id === selectedRoomId && "border-neutral-600"}`}
                // receiver là người nhận (api room trả về là như vậy)
                onClick={() => handleRoomClick(room)}
              >
                <div>
                  <div className="flex gap-4 items-center">
                    <Avatar>
                      <AvatarImage
                        src={room.user1.avatar}
                        className="object-cover"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p>{room.user1.name}</p>
                  </div>
                </div>
                <div className={`${!room.lastMessage.isRead && room.lastMessage.sender_id !== user.id ? "font-bold text-neutral-800" : "font-normal text-neutral-500"} flex flex-row gap-2`}>
                  {
                    user.id === room.lastMessage.sender_id && (
                      <p>Bạn:</p>
                    )
                  }
                  <p className="w-full truncate">
                    {room.lastMessage.content}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {selectedRoomId && (
          <div
            className=" w-[60%] bg-white  pt-4 border rounded-lg h-full "
            onClick={() => handleFocus()}
          >
            <div className="flex h-full flex-col ">
              <p className="font-bold px-4 pb-4 mb-2 border-b border-red-300">Đoạn hội thoại</p>
              <div className="w-full flex flex-col gap-4 px-4 flex-1 overflow-y-scroll custom-scrollbar">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`w-[80%]  px-2 py-1  ${
                      msg.sender_id === user.id ? "ml-auto " : "ml-0 "
                    }`}
                  >
                    <div
                      className={`p-4 rounded-lg ${
                        msg.sender_id === user.id
                          ? " bg-red-400 text-white"
                          : "border border-red-400"
                      }`}
                    >
                      <p className="w-full break-words">{msg.content}</p>
                    </div>
                    <div className="flex gap-2 text-sm text-neutral-500">
                      {
                        msg.sender_id === user.id && (
                          <p> {msg.isRead ? "(Đã đọc)" : "(Chưa đọc)"}</p>
                        )
                      }
                      <p>{formatDateTime(msg.createdAt)}</p>
                    </div>
                  </div>
                ))}
                {/* div đánh dấu cuối */}
                <div ref={messagesEndRef} />
              </div>
              <div className="flex gap-2 w-full sticky z-30 border-t border-red-400 py-2 bottom-0 bg-white shadow-lg px-4 items-stretch">
                <div className="px-4 py-2 border-2 rounded-lg w-[84%] order-black/20 focus-within:border-black/60">
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
                    className="h-full w-full flex justify-center items-center px-4 py-2 border border-red-400 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition duration-300"
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
    </div>
  );
};

export default ManageMessageForm;
