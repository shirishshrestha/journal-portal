"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import {
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  KEY_TAB_COMMAND,
} from "lexical";

export default function TabIndentationPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_TAB_COMMAND,
      (event) => {
        event.preventDefault();
        if (event.shiftKey) {
          return editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
        } else {
          return editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
        }
      },
      1 // High priority
    );
  }, [editor]);

  return null;
}
