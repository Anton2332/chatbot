export const transformText = (text: string) => {
  const pattern = /!\[(.*?)\{(.*?)\|(.*?)\}\]/g;
  let match;
  let lastIndex = 0;
  let texts = '';
  const mentionValues = [];
  // eslint-disable-next-line no-cond-assign
  while ((match = pattern.exec(text)) !== null) {
    const [, mentionText, , mentionValue] = match;
    mentionValues.push(mentionValue);

    texts += text.slice(lastIndex, match.index);
    texts += mentionText;
    lastIndex = pattern.lastIndex;
  }

  texts += text.slice(lastIndex);

  return { text: texts, mentionValues };
};
