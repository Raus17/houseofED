"use client";
import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectContent } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Editor } from "@/components/ui/tiptap-editor";

interface TaskDrawerProps {
  onSave: (task: {
    title: string;
    description: string;
    date: string;
    status: string;
    category: string;
    attachment?: File;
  }) => void;
}

const categories = ["Work", "Personal"];

const TaskDrawer: React.FC<TaskDrawerProps> = ({ onSave }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("To-Do");
  const [taskCategory, setTaskCategory] = useState("Work");
  const [taskDate, setTaskDate] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (e.g., limit to 5MB)
      if (file.size > 1 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      
      setAttachment(file);
    }
  };

  const handleSave = async () => {
    if (!taskTitle || !taskStatus || !taskDate) {
      alert("Task title, status, and due date are required!");
      return;
    }

    const newTask = {
      title: taskTitle,
      description: taskDescription,
      date: taskDate,
      status: taskStatus,
      category: taskCategory,
      attachment: attachment || undefined,
    };

    try {
      await onSave(newTask);
      setIsOpen(false);

      // Reset fields after saving
      setTaskTitle("");
      setTaskDescription("");
      setTaskStatus("To-Do");
      setTaskCategory("Work");
      setTaskDate("");
      setAttachment(null);
    } catch {
      // Remove the unused error variable and just show the alert
      alert("Failed to save task. Please try again.");
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <div className="flex justify-end">
          <Button className="bg-purple-600 font-semibold rounded-full text-white">
            Add Task
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent className="p-5">
        <h2 className="text-lg font-semibold text-center mb-4">Create Task</h2>

        <Label className="pb-2">Task Title</Label>
        <Input
          type="text"
          placeholder="Task title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className="mb-3"
        />

        <Label className="pb-2">Description</Label>
        <div className="mb-3 min-h-[150px] h-auto border rounded-md p-3">
          <Editor value={taskDescription} onChange={setTaskDescription} />
        </div>

        <Label className="pb-2">Category</Label>
        <div className="flex gap-2 mb-3">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={taskCategory === cat ? "default" : "outline"}
              onClick={() => setTaskCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        <Label className="pb-2">Due Date</Label>
        <DatePicker
          value={taskDate}
          onChange={setTaskDate}
          className="mb-3"
        />

        <Label className="pb-2 mt-2">Status</Label>
        <Select onValueChange={setTaskStatus} value={taskStatus}>
          <SelectTrigger className="mb-3 w-1/2" />
          <SelectContent>
            <SelectItem value="To-Do">To-Do</SelectItem>
            <SelectItem value="In-Progress">In-Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Label className="pb-2 mt-2">Attachment</Label>
        <Input
          type="file"
          onChange={handleFileChange}
          className="mb-3 w-1/2"
          accept="image/*,application/pdf"
        />
        {attachment && (
          <div className="text-sm text-gray-500 mb-3">
            Selected file: {attachment.name}
          </div>
        )}

        <div className="flex justify-between mt-4 w-full">
          <Button variant="outline" className="rounded-full" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} className="bg-[#7B1984] rounded-full text-white">Create</Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TaskDrawer;