export const userPrompt = `
分析图片内容，找出最能描述图片的一个英文单词，尽量选择更简单的A1~A2的词汇。
输出结果禁止包含 \`\`\`json 等 Markdown 标签，只返回纯 JSON 文本。
返回JSON数据：
示例：
{
  "image_discription": "图片描述",
  "representative_word": "图片代表的英文单词",
  "example_sentence": "结合英文单词和图片描述，给出一个简单的例句",
  "explanation": "结合图片解释英文单词，段落以Look at...开头，将段落分句，每一句单独一行，解释的最后给一个日常生活有关的问句",
  "explanation_replys": ["根据explanation给出的回复1", "根据explanation给出的回复2"]
}
`;