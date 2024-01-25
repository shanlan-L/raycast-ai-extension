import { Clipboard, Detail } from "@raycast/api";
import { useEffect, useState } from "react";
import useModel from "./hooks/useModel";
import { fetch } from "undici";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).fetch = fetch;

export default () => {
  const [content, setContent] = useState<string>("");
  const { chatModel } = useModel();

  const translate = async () => {
    const { text } = await Clipboard.read();

    if (text) {
      setContent("# 翻译中，请稍等...");

      const result = await chatModel.generateContentStream(
        `将以下内容翻译成中文，如果内容本身是中文则翻译成英文：${text}`,
      );

      setContent("");

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        setContent((prev) => (prev += chunkText));
      }
    } else {
      setContent("🐛 请复制需要翻译的内容");
    }
  };

  useEffect(() => {
    translate();
  }, []);

  return <Detail markdown={content}></Detail>;
};
