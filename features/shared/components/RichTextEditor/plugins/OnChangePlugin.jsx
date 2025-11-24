"use client";

import { OnChangePlugin as LexicalOnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $generateHtmlFromNodes } from "@lexical/html";

export default function OnChangePlugin({ onChange }) {
  const handleChange = (editorState, editor) => {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      if (onChange) {
        onChange(htmlString, editorState);
      }
    });
  };

  return <LexicalOnChangePlugin onChange={handleChange} />;
}
