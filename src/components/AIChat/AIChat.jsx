// // src/components/AIChat/AIChat.jsx
// import { useState } from "react";
// import ChatButton from "./ChatButton";
// import ChatWindow from "./ChatWindow";
// import { useSelector } from "react-redux";

// const AIChat = () => {
//   const [open, setOpen] = useState(false);
//   const { user } = useSelector((state) => state.auth);

//   // Do not show chat if user not logged in
//   if (!user) return null;

//   return (
//     <>
//       {open && <ChatWindow onClose={() => setOpen(false)} />}
//       <ChatButton onClick={() => setOpen((prev) => !prev)} />
//     </>
//   );
// };

// export default AIChat;
