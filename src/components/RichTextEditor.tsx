import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { Bold, Italic, List, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (html: string) => void;
  rows?: number;
}

export function RichTextEditor({ value, onChange, rows = 4 }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none px-3 py-2 min-h-[var(--rte-min-h)]",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
  });

  // Keep editor synced when `value` changes externally (e.g. loading history).
  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="rounded-md border bg-white">
        <div className="h-9 border-b bg-neutral-50" />
        <div style={{ minHeight: `${rows * 1.5}rem` }} />
      </div>
    );
  }

  const btn = (active: boolean) =>
    cn(
      "inline-flex h-8 w-8 items-center justify-center rounded hover:bg-neutral-100",
      active && "bg-neutral-200 text-primary",
    );

  return (
    <div
      className="rounded-md border bg-white"
      style={{ ["--rte-min-h" as never]: `${rows * 1.5}rem` }}
    >
      <div className="flex items-center gap-1 border-b bg-neutral-50 px-2 py-1">
        <button
          type="button"
          className={btn(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={btn(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <div className="mx-1 h-5 w-px bg-neutral-300" />
        <button
          type="button"
          className={btn(editor.isActive("bulletList"))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Lista"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={btn(editor.isActive("orderedList"))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numerirana lista"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
