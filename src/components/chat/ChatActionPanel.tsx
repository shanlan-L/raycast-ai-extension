import { Toast, ActionPanel, Action, Icon, confirmAlert, Alert } from "@raycast/api";
import React, { FC } from "react";
import { toast } from "../../utils";
import CreateChat from "./CreateChat";
import { ChatState } from "./type";

const ChatActionPanel: FC<{
  chatState: ChatState;
  setChatState: React.Dispatch<React.SetStateAction<ChatState>>;
  onSendMessage: () => void;
}> = ({ chatState, setChatState, onSendMessage }) => {
  const onDelete = () => {
    const name = chatState.currentChatName;
    const chats = chatState.chats;
    const chatsLen = chats.length;

    if (chatsLen === 1) {
      toast("只剩这一个了，别删了 😭", Toast.Style.Failure);
      return;
    }

    const chatIndex = chats.findIndex((chat) => chat.name === name);

    setChatState((prev) => {
      const newState = structuredClone(prev);
      newState.chats = newState.chats.filter((chat) => chat.name !== name);
      newState.currentChatName =
        newState.chats[chatIndex === chatsLen - 1 ? newState.chats.length - 1 : chatIndex].name;

      return newState;
    });
  };

  return (
    <ActionPanel>
      <Action icon={Icon.Message} title="Send to AI" onAction={onSendMessage} />
      <ActionPanel.Section title="管理对话">
        <Action.Push
          icon={Icon.PlusCircle}
          title="Create Chat"
          target={<CreateChat chatState={chatState} setChatState={setChatState} />}
          shortcut={{ modifiers: ["cmd"], key: "n" }}
        />
      </ActionPanel.Section>
      <ActionPanel.Section title="危险操作">
        <Action
          icon={Icon.Trash}
          title="删除对话"
          onAction={async () => {
            await confirmAlert({
              title: "确定删除吗?",
              message: "删除后将不可恢复！",
              icon: Icon.Trash,
              primaryAction: {
                title: "永久删除当前对话",
                style: Alert.ActionStyle.Destructive,
                onAction: onDelete,
              },
            });
          }}
          shortcut={{ modifiers: ["cmd", "shift"], key: "delete" }}
          style={Action.Style.Destructive}
        />
      </ActionPanel.Section>
    </ActionPanel>
  );
};

export default ChatActionPanel;
