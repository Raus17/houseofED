"use client";
import React, { useState, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Placeholder from "@tiptap/extension-placeholder";

interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  status: string;
  category: string;
  attachment?: File;
  attachmentData?: {
    base64: string;
    type: string;
    name: string;
  };
}

interface UpdateTaskModalProps {
  onClose: () => void;
  onSave: (task: Task) => void;
  task: Task;
}

const categories = ["Work", "Personal"];

const UpdateTaskModal: React.FC<UpdateTaskModalProps> = ({ onClose, onSave, task }) => {
  const [title, setTitle] = useState(task.title);
  const [date, setDate] = useState(task.date);
  const [status, setStatus] = useState(task.status);
  const [category, setCategory] = useState(task.category);
  const [attachment, setAttachment] = useState<File | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Strike,
      BulletList,
      OrderedList,
      ListItem,
      Placeholder.configure({ placeholder: "Description" }),
    ],
    content: task.description,
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      if (text.length > 300) {
        editor.commands.setContent(text.slice(0, 300));
      }
    },
  });

  useEffect(() => {
    if (editor && task.description) {
      editor.commands.setContent(task.description);
    }
  }, [task.description, editor]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 4 * 1024 * 1024) {
      setAttachment(file);
    } else {
      alert("File size must be under 4MB");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const description = editor?.getHTML() || "";
    
    const updatedTask: Task = {
      ...task,
      title,
      description,
      date,
      status,
      category,
      attachment: attachment || undefined
    };

    onSave(updatedTask);
    onClose();
  };

  const handleViewAttachment = () => {
    if (task.attachmentData?.base64) {
      // Create a blob from base64 data
      const byteCharacters = atob(task.attachmentData.base64.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: task.attachmentData.type });

      // Create object URL for viewing/downloading
      const url = URL.createObjectURL(blob);

      if (task.attachmentData.type.startsWith('image/')) {
        // Open image in new window
        window.open(url, '_blank');
      } else {
        // Download file
        const a = document.createElement('a');
        a.href = url;
        a.download = task.attachmentData.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      // Clean up object URL
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-md h-[674px] w-[697px] relative">
        <h2 className="text-2xl mb-4 font-semibold">Update Task</h2>
        <div className="-mx-6 border-b border-gray-300 mb-4"></div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 mb-2 border rounded"
          />

          {/* Rich Text Editor */}
          <div className="border rounded-lg p-3 relative">
            <div className="bg-white p-2 rounded min-h-[120px] w-auto">
              <EditorContent editor={editor} />
            </div>

            <div className="flex items-center justify-between mt-2 text-gray-600 border-t pt-2">
              <div className="flex space-x-4">
                <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={`font-bold ${editor?.isActive("bold") ? "text-black" : ""}`}>B</button>
                <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={`${editor?.isActive("italic") ? "text-black" : ""}`}>/</button>
                <button type="button" onClick={() => editor?.chain().focus().toggleStrike().run()} className={`${editor?.isActive("strike") ? "text-black" : ""}`}>S</button>
                <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={`${editor?.isActive("bulletList") ? "text-black" : ""}`}>•≡</button>
                <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={`${editor?.isActive("orderedList") ? "text-black" : ""}`}>1≡</button>
              </div>
              <span className="text-gray-400 text-sm">{editor?.getText().length || 0}/300 characters</span>
            </div>
          </div>

          <div className="flex items-center space-x-6 mb-3">
            <div>
              <p className="text-gray-600 mb-2">Task Category*</p>
              <div className="flex overflow-hidden">
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-5 py-1 text-center border rounded-full transition mr-2 ${
                      category === cat ? "bg-purple-600 text-white" : "bg-white text-black"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-40">
              <p className="text-gray-600 mb-2">Due on*</p>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="p-2 border rounded w-full"
              />
            </div>

            <div className="w-40">
              <p className="text-gray-600 mb-2">Task Status*</p>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="p-2 border rounded w-full"
              >
                <option value="To-Do">To-Do</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="w-full p-2 mb-2 border rounded"
          />
          {attachment && (
            <p className="text-sm text-gray-600">New attachment: {attachment.name}</p>
          )}
          {task.attachmentData && !attachment && (
            <div className="flex items-center">
              <p className="text-sm text-gray-600 mr-2">
                Current attachment: {task.attachmentData.name}
              </p>
              <button
                type="button"
                onClick={handleViewAttachment}
                className="text-purple-600 hover:text-purple-700 text-sm underline"
              >
                View/Download
              </button>
            </div>
          )}
        </div>

          <div className="absolute bottom-0 left-0 w-full bg-[#F1F1F1]">
            <div className="border-b border-gray-300"></div>
            <div className="p-4 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="bg-white rounded-full font-semibold border-gray-500 border text-black px-4 py-2 mr-3"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="bg-[#7B1984] text-white font-semibold px-4 py-2 mr-2 rounded-full"
              >
                UPDATE
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTaskModal;