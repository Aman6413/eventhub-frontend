// // src/components/AIChat/ChatWindow.jsx
// import { useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";

// const ChatWindow = ({ onClose }) => {
//   const { user } = useSelector((state) => state.auth);

//   const [messages, setMessages] = useState([
//     {
//       sender: "ai",
//       text: "Hi 👋 I’m your EventHub assistant. Ask me about events.",
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);

//   const handleSend = async () => {
//     if (!input.trim() || isTyping) return;

//     const userMessage = input;

//     setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
//     setInput("");
//     setIsTyping(true);

//     try {
//       const res = await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/ai/chat`,
//         {
//           message: userMessage,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         }
//       );      

//       setMessages((prev) => [...prev, { sender: "ai", text: res.data.reply }]);
//     } catch (error) {
//       setMessages((prev) => [
//         ...prev,
//         { sender: "ai", text: "Sorry, I couldn’t respond right now." },
//       ]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   return (
//     <div
//       className="fixed bottom-24 right-6 
//                  w-[90vw] sm:w-[400px] 
//                  h-[70vh] max-h-[550px]
//                  bg-white border rounded-lg shadow-lg
//                  flex flex-col z-50"
//     >
//       {/* Header */}
//       <div
//         className="bg-blue-600 text-white px-4 py-2
//                       flex justify-between items-center rounded-t-lg"
//       >
//         <div>
//           <p className="font-semibold">EventHub AI Assistant</p>
//           <p className="text-xs opacity-80">Ask me about events</p>
//         </div>
//         <button onClick={onClose} className="text-lg">
//           ✖
//         </button>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-3 space-y-2">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`max-w-[80%] px-3 py-2 rounded-lg text-sm
//               ${
//                 msg.sender === "user"
//                   ? "bg-blue-100 ml-auto text-right"
//                   : "bg-gray-100 mr-auto text-left"
//               }`}
//           >
//             {msg.text}
//           </div>
//         ))}

//         {/* Typing Indicator */}
//         {isTyping && (
//           <div className="bg-gray-100 mr-auto px-3 py-2 rounded-lg text-sm italic">
//             AI is typing...
//           </div>
//         )}
//       </div>

//       {/* Input */}
//       <div className="border-t p-2 flex gap-2">
//         <input
//           type="text"
//           placeholder="Type your message..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           disabled={isTyping}
//           className="flex-1 border rounded px-2 py-1
//                      focus:outline-none focus:ring-2
//                      focus:ring-blue-400 text-sm
//                      disabled:bg-gray-100"
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}
//         />
//         <button
//           onClick={handleSend}
//           disabled={isTyping}
//           className="bg-blue-600 text-white px-3 py-1
//                      rounded hover:bg-blue-700 text-sm
//                      disabled:opacity-50"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;
