/\*\*

- RichTextEditor Component Usage Example
-
- Import the component:
- import { RichTextEditor } from "@/features/shared";
-
- Basic Usage:
- ```jsx

  ```
- <RichTextEditor
- placeholder="Start typing..."
- onChange={(html) => console.log(html)}
- />
- ```

  ```
-
- With Form (React Hook Form):
- ```jsx

  ```
- import { RichTextEditor } from "@/features/shared";
- import { useForm, Controller } from "react-hook-form";
-
- function MyForm() {
- const { control, handleSubmit } = useForm();
-
- const onSubmit = (data) => {
-     console.log(data.content);
- };
-
- return (
-     <form onSubmit={handleSubmit(onSubmit)}>
-       <Controller
-         name="content"
-         control={control}
-         render={({ field }) => (
-           <RichTextEditor
-             placeholder="Enter description..."
-             onChange={(html) => field.onChange(html)}
-             initialValue={field.value}
-           />
-         )}
-       />
-       <button type="submit">Submit</button>
-     </form>
- );
- }
- ```

  ```
-
- Features:
- - Text formatting: Bold, Italic, Underline, Strikethrough, Code
- - Headings: H1, H2, H3
- - Lists: Bullet and Numbered lists
- - Quotes and Code blocks
- - Links with auto-detection
- - Text alignment: Left, Center, Right, Justify
- - Markdown shortcuts support
- - Undo/Redo functionality
- - Dark/Light theme compatible
- - Responsive toolbar
-
- Props:
- @param {string} [placeholder="Enter some text..."] - Placeholder text
- @param {Function} [onChange] - Callback when content changes (receives HTML string)
- @param {string} [initialValue] - Initial HTML content
- @param {string} [className] - Additional CSS class for container
- @param {boolean} [autoFocus=false] - Auto-focus on mount
  \*/

export default function RichTextEditorExample() {
return null;
}
