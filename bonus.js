function longestCommonPrefix(words) {
  if (words.length === 0) return "";

  let prefix = words[0];
  for (const word of words.slice(1)) {
    while (!word.startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (prefix === "") return "";
    }
  }
  return prefix;
}

const examples = [
  { words: ["flower", "flow", "flight"], expected: "fl" },
  { words: ["dog", "racecar", "car"], expected: "" },
  { words: ["sticky", "stick", "sticker"], expected: "stick" },
  { words: [], expected: "" }
];

for (const example of examples) {
  const result = longestCommonPrefix(example.words);
  console.log(`${JSON.stringify(example.words)} -> ${JSON.stringify(result)} (expected ${JSON.stringify(example.expected)})`);
}
