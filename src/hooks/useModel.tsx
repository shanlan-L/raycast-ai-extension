import { GoogleGenerativeAI } from "@google/generative-ai";
import { getPreferenceValues } from "@raycast/api";

interface Config {
  /**
   * 温度在生成响应期间用于采样，在应用 topP 和 topK 时会生成响应。
   * 温度可以控制 token 选择的随机程度。较低的温度有利于需要更具确定性、更少开放性或创造性响应的提示，而较高的温度可以导致更具多样性或创造性的结果。
   * 温度为 0 表示回复是确定的：系统始终会选择概率最高的响应。对于大多数应用场景，不妨先试着将温度设为 0.2。
   * https://cloud.google.com/vertex-ai/docs/generative-ai/start/quickstarts/api-quickstart?hl=zh-cn#parameter_definitions
   */
  temperature?: number;
  /**
   * 回复中可生成的 token 数量上限。指定较低的值可获得较短的响应，指定较高的值可获得较长的响应。
   * token 可能小于单词。 token 约为 4 个字符。100 个 token 对应大约 60-80 个单词。
   * https://cloud.google.com/vertex-ai/docs/generative-ai/start/quickstarts/api-quickstart?hl=zh-cn#parameter_definitions
   */
  maxOutputTokens?: number;
  /**
   * Top-p 可更改模型选择输出 token 的方式。系统会按照概率从最高 K（参见 topK 参数）到最低的顺序选择 token ，直到所选 token 的概率总和等于 Top-p 的值。
   * 例如，如果 token  A、B 和 C 的概率分别是 0.3、0.2 和 0.1，并且 Top-p 的值为 0.5，则模型将选择 A 或 B 作为下一个 token （通过温度确定），而不考虑 C。
   * Top-p 的默认值为 0.8。
   * 指定较低的值可获得随机程度较低的响应，指定较高的值可获得随机程度较高的响应。
   * https://cloud.google.com/vertex-ai/docs/generative-ai/start/quickstarts/api-quickstart?hl=zh-cn#parameter_definitions
   */
  topP?: number;
  /**
   * Top-k 可更改模型选择输出 token 的方式。如果 Top-k 设为 1，表示所选 token 是模型词汇表的所有 token 中概率最高的 token （也称为贪心解码）。
   * 如果 Top-k 设为 3，则表示系统将从 3 个概率最高的 token （通过温度确定）中选择下一个 token 。
   * 在每个 token 选择步骤中，系统都会对概率最高的前 K 个 token 进行采样。然后，系统会根据 topP 进一步过滤 token ，并使用温度采样选择最终的 token 。
   * 指定较低的值可获得随机程度较低的响应，指定较高的值可获得随机程度较高的响应。
   * https://cloud.google.com/vertex-ai/docs/generative-ai/start/quickstarts/api-quickstart?hl=zh-cn#parameter_definitions
   */
  topK?: number;
}

const defaultConfig: Config = {
  maxOutputTokens: 0,
  temperature: 0,
  topP: 40,
  topK: 0.95,
};

export default (model = "gemini-pro", config?: Config) => {
  const { apiKey } = getPreferenceValues();
  const genAI = new GoogleGenerativeAI(apiKey);

  const chatModel = genAI.getGenerativeModel({
    model,
    generationConfig: { ...defaultConfig, ...config },
  });

  return { chatModel };
};
