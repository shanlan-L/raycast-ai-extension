import { useNavigation, Form, ActionPanel, Action, Toast } from "@raycast/api";
import React, { FC } from "react";
import { toast } from "../../utils";
import { ChatState } from "./type";

const CreateChat: FC<{
  chatState: ChatState;
  setChatState: React.Dispatch<React.SetStateAction<ChatState>>;
}> = ({ chatState, setChatState }) => {
  const { pop } = useNavigation();

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="创建对话"
            onSubmit={(values) => {
              if (values.chatName === "") {
                toast("Chat 需要一个名字！", Toast.Style.Failure);
              } else if (chatState.chats.map((x) => x.name).includes(values.chatName)) {
                toast("这个名字已经有了，再想一个吧😊", Toast.Style.Failure);
              } else {
                setChatState((prev) => {
                  const newState = structuredClone(prev);
                  newState.chats.push({
                    name: values.chatName,
                    creationDate: new Date(),
                    messages: [],
                  });
                  newState.currentChatName = values.chatName;

                  return newState;
                });

                pop();
              }
            }}
          />
        </ActionPanel>
      }
    >
      <Form.Description title="Chat Name" text="对话名称, 在对话中发出的消息，会携带当前对话的上下文" />
      <Form.TextField id="chatName" />
    </Form>
  );
};

export default CreateChat;
