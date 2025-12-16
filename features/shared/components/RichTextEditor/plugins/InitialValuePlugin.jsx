"use client";

import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes } from "lexical";

export default function InitialValuePlugin({ initialValue }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!initialValue) return;

    editor.update(() => {
      // Parse HTML string to DOM
      const parser = new DOMParser();
      const dom = parser.parseFromString(initialValue, "text/html");

      // Generate Lexical nodes from the DOM
      const nodes = $generateNodesFromDOM(editor, dom);

      // Clear the editor first
      const root = $getRoot();
      root.clear();

      // Insert the nodes
      $insertNodes(nodes);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  return null;
}
