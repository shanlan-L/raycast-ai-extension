import { LocalStorage, Toast, showToast } from "@raycast/api";
import { ChatState } from "../components/chat/type";

export const toast = async (title: string, style?: Toast.Style, message?: string) => {
  await showToast({
    style,
    title,
    message,
  });
};

export const formatDate = (dateToCheckISO: string) => {
  const dateToCheck = new Date(dateToCheckISO);
  if (dateToCheck.toDateString() === new Date().toDateString()) {
    return `${dateToCheck.getHours()}:${String(dateToCheck.getMinutes()).padStart(2, "0")}`;
  } else {
    return `${dateToCheck.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" })}`;
  }
};

export const answerPairToParameter = (message: string[]) => {
  if (message.length !== 2) {
    throw new Error("Message format must be an array of [user, model] pairs. See docs for more information.");
  }
  return [
    {
      parts: [{ text: message[0] }],
      role: "user",
    },
    {
      parts: [{ text: message[1] }],
      role: "model",
    },
  ];
};

export const saveChatState = async (chatState: ChatState) => {
  await LocalStorage.setItem("chatData", JSON.stringify(chatState));
};
