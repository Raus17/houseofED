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
import { X } from "lucide-react";

interface AddTaskDrawerProps {
  isOpen: boolean;
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

const AddTaskDrawer: React.FC<AddTaskDrawerProps> = ({ isOpen, onClose, onSave }) => {
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
        editor.commands.setContent(text.slice(0, 300));
      }
    },
  });

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
    onSave({ title, description, date, status, category, attachment });
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-x-0 bottom-0 transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } transition-transform duration-300 ease-in-out z-50 bg-white rounded-t-xl shadow-lg max-h-[90vh] overflow-y-auto`}
      >
        <form onSubmit={handleSubmit} className="relative">
          {/* Header */}
          <div className="sticky top-0 bg-white px-4 py-3 border-b flex items-center justify-between">
            <h2 className="text-xl font-semibold">Create Task</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3 border rounded-lg text-base"
            />

            {/* Rich Text Editor */}
            <div className="border rounded-lg">
              <div className="p-3 min-h-[120px]">
                <EditorContent editor={editor} />
              </div>
              
              <div className="flex items-center justify-between p-2 border-t">
                <div className="flex space-x-4">
                  <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={`p-1 ${editor?.isActive("bold") ? "text-purple-600" : ""}`}>B</button>
                  <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={`p-1 ${editor?.isActive("italic") ? "text-purple-600" : ""}`}>/</button>
                  <button type="button" onClick={() => editor?.chain().focus().toggleStrike().run()} className={`p-1 ${editor?.isActive("strike") ? "text-purple-600" : ""}`}>S</button>
                  <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={`p-1 ${editor?.isActive("bulletList") ? "text-purple-600" : ""}`}>•≡</button>
                  <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={`p-1 ${editor?.isActive("orderedList") ? "text-purple-600" : ""}`}>1≡</button>
                </div>
                <span className="text-sm text-gray-500">{editor?.getText().length || 0}/300</span>
              </div>
            </div>

            {/* Category */}
            <div>
              <p className="text-gray-600 mb-2">Task Category*</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-full transition ${
                      category === cat ? "bg-purple-600 text-white" : "bg-gray-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Date and Status */}
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 mb-2">Due on*</p>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              <div>
                <p className="text-gray-600 mb-2">Task Status*</p>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-white"
                >
                  <option value="To-Do">To-Do</option>
                  <option value="In-Progress">In-Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="w-full p-3 border rounded-lg"
              />
              {attachment && (
                <p className="mt-2 text-sm text-gray-600">
                  Attached: {attachment.name}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 px-4 py-3 border-t">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-full border border-gray-300 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-full bg-purple-600 text-white font-medium"
              >
                Create
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddTaskDrawer;