"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { useTheme } from "next-themes";

import ToolbarPlugin from "./plugins/ToolbarPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import OnChangePlugin from "./plugins/OnChangePlugin";
import TabIndentationPlugin from "./plugins/TabIndentationPlugin";
import InitialValuePlugin from "./plugins/InitialValuePlugin";
import "./RichTextEditor.css";

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  paragraph: "editor-paragraph",
  quote: "editor-quote",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
  },
  list: {
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listitem",
  },
  image: "editor-image",
  link: "editor-link",
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    overflowed: "editor-text-overflowed",
    hashtag: "editor-text-hashtag",
    underline: "editor-text-underline",
    strikethrough: "editor-text-strikethrough",
    underlineStrikethrough: "editor-text-underlineStrikethrough",
    code: "editor-text-code",
  },
  code: "editor-code",
  codeHighlight: {
    atrule: "editor-tokenAttr",
    attr: "editor-tokenAttr",
    boolean: "editor-tokenProperty",
    builtin: "editor-tokenSelector",
    cdata: "editor-tokenComment",
    char: "editor-tokenSelector",
    class: "editor-tokenFunction",
    "class-name": "editor-tokenFunction",
    comment: "editor-tokenComment",
    constant: "editor-tokenProperty",
    deleted: "editor-tokenProperty",
    doctype: "editor-tokenComment",
    entity: "editor-tokenOperator",
    function: "editor-tokenFunction",
    important: "editor-tokenVariable",
    inserted: "editor-tokenSelector",
    keyword: "editor-tokenAttr",
    namespace: "editor-tokenVariable",
    number: "editor-tokenProperty",
    operator: "editor-tokenOperator",
    prolog: "editor-tokenComment",
    property: "editor-tokenProperty",
    punctuation: "editor-tokenPunctuation",
    regex: "editor-tokenVariable",
    selector: "editor-tokenSelector",
    string: "editor-tokenSelector",
    symbol: "editor-tokenProperty",
    tag: "editor-tokenProperty",
    url: "editor-tokenOperator",
    variable: "editor-tokenVariable",
  },
};

function Placeholder({ placeholder, className }) {
  return <div className={`editor-placeholder ${className}`}>{placeholder}</div>;
}

const editorConfig = {
  namespace: "RichTextEditor",
  theme,
  onError(error) {
    throw error;
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
};

/**
 * RichTextEditor - A feature-rich text editor component using Lexical
 * @param {Object} props
 * @param {string} [props.placeholder="Enter some text..."] - Placeholder text
 * @param {Function} [props.onChange] - Callback when editor content changes (debounced)
 * @param {string} [props.initialValue] - Initial HTML content
 * @param {string} [props.className] - Additional className for the editor container
 * @param {boolean} [props.autoFocus=false] - Whether to auto-focus on mount
 * @param {number} [props.debounceMs=300] - Debounce delay in milliseconds for onChange callback
 */
export default function RichTextEditor({
  placeholder = "Enter some text...",
  onChange,
  initialValue,
  className = "",
  autoFocus = false,
  debounceMs = 500,
  editor_classname = "",
}) {
  const { theme: currentTheme } = useTheme();

  return (
    <div
      className={`editor-container ${
        currentTheme === "dark" ? "dark-theme" : "light-theme"
      } ${className}`}
    >
      <LexicalComposer initialConfig={editorConfig}>
        <div className="editor-inner">
          <ToolbarPlugin />
          <div className={`editor-wrapper bg-input/30 ${editor_classname}`}>
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input" />}
              placeholder={
                <Placeholder
                  className="text-muted-foreground"
                  placeholder={placeholder}
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            {autoFocus && <AutoFocusPlugin />}
            <ListPlugin />
            <LinkPlugin />
            <AutoLinkPlugin />
            <TabIndentationPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            {initialValue && <InitialValuePlugin initialValue={initialValue} />}
            {onChange && (
              <OnChangePlugin onChange={onChange} debounceMs={debounceMs} />
            )}
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
}
