# Rich Text Editor Component

A feature-rich text editor component built with [Lexical](https://lexical.dev/) that supports both dark and light themes.

## Features

✅ **Text Formatting**

- Bold, Italic, Underline, Strikethrough
- Inline code formatting

✅ **Block Types**

- Headings (H1, H2, H3, H4, H5)
- Paragraphs
- Block quotes
- Code blocks with syntax highlighting
- Bullet lists
- Numbered lists

✅ **Advanced Features**

- Link insertion and editing
- Auto-link detection (URLs and emails)
- Text alignment (left, center, right, justify)
- Markdown shortcuts support
- Undo/Redo functionality
- Floating link editor

✅ **Theme Support**

- Fully compatible with dark and light themes
- Uses CSS variables from your theme
- Smooth transitions between themes

## Installation

The required dependencies have been installed:

```bash
npm install lexical @lexical/react @lexical/rich-text @lexical/selection @lexical/utils @lexical/list @lexical/link @lexical/code @lexical/markdown @lexical/html
```

## Usage

### Basic Usage

```jsx
import { RichTextEditor } from "@/features/shared";

function MyComponent() {
  const [content, setContent] = useState("");

  return (
    <RichTextEditor
      placeholder="Start typing..."
      onChange={(html) => setContent(html)}
    />
  );
}
```

### With React Hook Form

```jsx
import { RichTextEditor } from "@/features/shared";
import { useForm, Controller } from "react-hook-form";

function MyForm() {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data.content); // HTML string
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <RichTextEditor
            placeholder="Enter description..."
            onChange={(html) => field.onChange(html)}
            initialValue={field.value}
          />
        )}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### In a Card

```jsx
import { RichTextEditor } from "@/features/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Description</CardTitle>
      </CardHeader>
      <CardContent>
        <RichTextEditor
          placeholder="Enter the journal description..."
          onChange={(html) => console.log(html)}
        />
      </CardContent>
    </Card>
  );
}
```

## Props

| Prop           | Type       | Default                | Description                                                                          |
| -------------- | ---------- | ---------------------- | ------------------------------------------------------------------------------------ |
| `placeholder`  | `string`   | `"Enter some text..."` | Placeholder text shown when editor is empty                                          |
| `onChange`     | `function` | `undefined`            | Callback function called when content changes. Receives HTML string and editor state |
| `initialValue` | `string`   | `undefined`            | Initial HTML content to populate the editor                                          |
| `className`    | `string`   | `""`                   | Additional CSS classes for the editor container                                      |
| `autoFocus`    | `boolean`  | `false`                | Whether to auto-focus the editor on mount                                            |

## Keyboard Shortcuts

### Text Formatting

- `Ctrl/Cmd + B` - Bold
- `Ctrl/Cmd + I` - Italic
- `Ctrl/Cmd + U` - Underline

### Markdown Shortcuts

- `#` + `Space` - H1 heading
- `##` + `Space` - H2 heading
- `###` + `Space` - H3 heading
- `*` or `-` + `Space` - Bullet list
- `1.` + `Space` - Numbered list
- `>` + `Space` - Block quote
- ```+`Space` - Code block
- `**text**` - Bold text
- `*text*` or `_text_` - Italic text
- `~~text~~` - Strikethrough
- `` `code` `` - Inline code

### Other

- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Shift + Z` - Redo

## Demo Page

A demo page has been created at `/test-editor` to showcase the editor's features.

## File Structure

```
features/shared/components/RichTextEditor/
├── RichTextEditor.jsx          # Main component
├── RichTextEditor.css          # Styles with theme support
├── index.js                    # Export file
├── README.md                   # This file
└── plugins/
    ├── ToolbarPlugin.jsx       # Toolbar with formatting controls
    ├── AutoLinkPlugin.jsx      # Auto-detect and convert URLs to links
    └── OnChangePlugin.jsx      # Handle content changes
```

## Customization

### Styling

The editor uses CSS variables from your theme system. You can customize the appearance by modifying `RichTextEditor.css` or by passing custom classes via the `className` prop.

### Extending Functionality

To add more features:

1. Create a new plugin in the `plugins` folder
2. Import and add it to the `RichTextEditor.jsx` component
3. Update the toolbar if needed in `ToolbarPlugin.jsx`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- The editor outputs HTML strings via the `onChange` callback
- Content is sanitized by Lexical
- The editor is fully responsive
- Supports both LTR and RTL text direction
- All styles use theme CSS variables for seamless dark/light mode switching

## Troubleshooting

### Editor content not updating

Make sure you're properly handling the `onChange` callback and storing the content in state.

### Styles not applying

Ensure that the CSS file is being imported and your theme CSS variables are properly defined.

### Build errors

Make sure all Lexical dependencies are installed and up to date.
