export type Message = {
  prompt: string;
  creationDate: string;
  answer: string;
  finished: boolean;
};

export type Chat = { name: string; creationDate: Date; messages: Message[] };

export interface ChatState {
  chats: Chat[];
  currentChatName: string;
}
