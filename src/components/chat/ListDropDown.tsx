import { List } from "@raycast/api";
import React, { FC } from "react";
import { Chat } from "./type";

const ListDropDown: FC<{
  chats: Chat[];
  selectedName: string;
  onSelected: (selectedName: string) => void;
}> = ({ chats, selectedName, onSelected }) => {
  return (
    <List.Dropdown tooltip="你的对话" onChange={onSelected} value={selectedName}>
      {chats.map((x) => {
        return <List.Dropdown.Item title={x.name} value={x.name} key={x.name} />;
      })}
    </List.Dropdown>
  );
};

export default ListDropDown;
