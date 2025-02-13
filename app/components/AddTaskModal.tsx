"use client";
import React, { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Placeholder from "@tiptap/extension-placeholder";

interface AddTaskModalProps {
  onClose: () => void;
  onSave: (task: {
    title: string;
    description: string;
    date: string;
    status: string;
    category: string;
    attachment?: File | null;
  }) => void;
}

const categories = ["Work", "Personal"];

const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("To-Do");
  const [category, setCategory] = useState("Work");
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
    content: "",
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      if (text.length > 300) {
        editor.commands.setContent(text.slice(0, 300)); // Limit to 300 characters
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 4 * 1024 * 1024) { // 4MB limit
      setAttachment(file);
    } else {
      alert("File size must be under 4MB");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const description = editor?.getHTML() || "";
    onSave({ title, description, date, status, category, attachment });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-md h-[674px] w-[697px] relative">
        <h2 className="text-2xl mb-4 font-semibold">Create Task</h2>
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
  {/* Editor */}
  <div className="bg-white p-2 rounded min-h-[120px] w-auto"> {/* Increased height */}
    <EditorContent editor={editor} />
  </div>

  {/* Toolbar BELOW the editor */}
  <div className="flex items-center justify-between mt-2 text-gray-600 border-t pt-2">
    <div className="flex space-x-4">
      <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={`font-bold ${editor?.isActive("bold") ? "text-black" : ""}`}>B</button>
      <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={`${editor?.isActive("italic") ? "text-black" : ""}`}>/</button>
      <button type="button" onClick={() => editor?.chain().focus().toggleStrike().run()} className={`${editor?.isActive("strike") ? "text-black" : ""}`}>S</button>
      <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={`${editor?.isActive("bulletList") ? "text-black" : ""}`}>•≡</button>
      <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={`${editor?.isActive("orderedList") ? "text-black" : ""}`}>1≡</button>
    </div>
    
    {/* Right-Aligned Character Counter */}
    <span className="text-gray-400 text-sm">{editor?.getText().length || 0}/300 characters</span>
  </div>
</div>

          <div className="flex items-center space-x-6 mb-3">
            {/* Task Category */}
            <div>
              <p className="text-gray-600 mb-2">Task Category*</p>
              <div className="flex overflow-hidden">
                {categories.map((cat) => (
                  <button
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

            {/* Due Date */}
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

            {/* Task Status */}
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

          {/* File Upload */}
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="w-full p-2 mb-4 border rounded"
          />
          {attachment && <p className="text-sm text-gray-600">Attached: {attachment.name}</p>}

          {/* Sticky Footer Buttons */}
          <div className="absolute bottom-0 left-0 w-full bg-[#F1F1F1]">
            <div className="border-b border-gray-300"></div>
            <div className="p-4 flex justify-end">
              <button
                onClick={onClose}
                className="bg-white rounded-full font-semibold border-gray-500 border text-black px-4 py-2 mr-3"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="bg-[#7B1984] text-white font-semibold px-4 py-2 mr-2 rounded-full"
              >
                CREATE
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
