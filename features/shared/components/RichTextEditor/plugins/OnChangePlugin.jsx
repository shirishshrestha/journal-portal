"use client";

import { useCallback, useRef, useEffect } from "react";
import { OnChangePlugin as LexicalOnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $generateHtmlFromNodes } from "@lexical/html";
import { debounce } from "@/features/shared/utils/debounce";

export default function OnChangePlugin({ onChange, debounceMs = 300 }) {
  const debouncedOnChangeRef = useRef(null);

  useEffect(() => {
    if (onChange) {
      debouncedOnChangeRef.current = debounce((html, state) => {
        onChange(html, state);
      }, debounceMs);
    }
  }, [onChange, debounceMs]);

  const handleChange = useCallback((editorState, editor) => {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      if (debouncedOnChangeRef.current) {
        debouncedOnChangeRef.current(htmlString, editorState);
      }
    });
  }, []);

  return <LexicalOnChangePlugin onChange={handleChange} />;
}
