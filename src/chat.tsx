import { Icon, List, LocalStorage, Toast } from "@raycast/api";
import React, { useEffect, useMemo, useState } from "react";
import { answerPairToParameter, formatDate, saveChatState, toast } from "./utils";
import useChat from "./hooks/useChat";
import { fetch } from "undici";
import ListDropDown from "./components/chat/ListDropDown";
import { ChatState, Chat } from "./components/chat/type";
import ChatActionPanel from "./components/chat/ChatActionPanel";
(global as any).fetch = fetch;

const initChatData = {
  currentChatName: "New Chat",
  chats: [
    {
      name: "New Chat",
      creationDate: new Date(),
      messages: [],
    },
  ],
};

export default () => {
  const [searchText, setSearchText] = useState<string>("");
  const [chatState, setChatState] = useState<ChatState>(initChatData);

  const getChat = useMemo(
    () =>
      (target, customChat = chatState.chats): Chat => {
        for (const chat of customChat) {
          if (chat.name === target) return chat;
        }

        return {
          name: "New Chat",
          creationDate: new Date(),
          messages: [],
        };
      },
    [chatState]
  );

  const sendToAI = async (query, currentChatMessages) => {
    const { result } = useChat(
      query,
      currentChatMessages.map((x) => [x.prompt, x.answer]).flatMap(answerPairToParameter)
    );

    let text = "";
    for await (const chunk of (await result).stream) {
      const chunkText = chunk.text();
      text += chunkText;

      setChatState((prev) => {
        const newState = structuredClone(prev);

        getChat(chatState.currentChatName, newState.chats).messages[0].answer = text;

        return newState;
      });
    }

    setChatState((prev) => {
      const newState = structuredClone(prev);

      getChat(chatState.currentChatName, newState.chats).messages[0].finished = true;

      return newState;
    });

    toast("加载完成😄", Toast.Style.Success);
  };

  const onSendMessage = () => {
    if (searchText === "") {
      toast("请输入一些内容！", Toast.Style.Failure);
      return;
    }

    const query = searchText;

    setSearchText("");

    const currentChatMessages = getChat(chatState.currentChatName).messages;

    if (currentChatMessages.length === 0 || currentChatMessages[0].finished) {
      toast("处理中", Toast.Style.Animated, "请稍等");

      setChatState((prev) => {
        const newState = structuredClone(prev);

        getChat(chatState.currentChatName, newState.chats).messages.unshift({
          prompt: query,
          answer: "",
          creationDate: new Date().toISOString(),
          finished: false,
        });

        return newState;
      });

      sendToAI(query, currentChatMessages);
    } else {
      toast("请稍等片刻", Toast.Style.Failure, "小助手一次最多只能处理一条消息哦");
    }
  };

  useEffect(() => {
    const handleStoreData = async () => {
      const storedChatData = await LocalStorage.getItem<string>("chatData");

      if (storedChatData) {
        const newState: ChatState = JSON.parse(storedChatData);

        const currentChatMessages = getChat(newState.currentChatName, newState.chats).messages;
        if (currentChatMessages[0]?.finished === false) {
          const query = currentChatMessages[0].prompt;

          currentChatMessages[0].answer = "";
          toast("处理上次未完成消息中", Toast.Style.Animated);

          await sendToAI(query, currentChatMessages);
        }

        setChatState(structuredClone(newState));
      } else {
        saveChatState(chatState);
      }
    };

    handleStoreData();
  }, []);

  useEffect(() => {
    saveChatState(chatState);
  }, [chatState]);

  return (
    <List
      searchText={searchText}
      onSearchTextChange={setSearchText}
      isShowingDetail={getChat(chatState.currentChatName).messages.length > 0}
      searchBarPlaceholder="请输入"
      searchBarAccessory={
        <ListDropDown
          chats={chatState.chats}
          selectedName={chatState.currentChatName}
          onSelected={(selectedName) =>
            setChatState((prev) => {
              const newState = structuredClone(prev);
              newState.currentChatName = selectedName;
              return newState;
            })
          }
        />
      }
    >
      {(() => {
        const chat = getChat(chatState.currentChatName);

        if (!chat.messages.length) {
          return (
            <List.EmptyView
              icon={Icon.Stars}
              title="让我们开始对话吧！"
              actions={
                <ChatActionPanel chatState={chatState} setChatState={setChatState} onSendMessage={onSendMessage} />
              }
            />
          );
        }
        return chat.messages.map((x, i) => {
          return (
            <List.Item
              title={x.prompt}
              subtitle={formatDate(x.creationDate)}
              detail={<List.Item.Detail markdown={x.answer} />}
              key={x.prompt + x.creationDate}
              actions={
                <ChatActionPanel chatState={chatState} setChatState={setChatState} onSendMessage={onSendMessage} />
              }
            />
          );
        });
      })()}
    </List>
  );
};