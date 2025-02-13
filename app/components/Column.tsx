import React from "react";
import { useDrop } from "react-dnd";
import Task from "./Task";

interface Task {
  id: string;
  title: string;
  status: string;
}

interface ColumnProps {
  status: string;
  tasks: Task[];
  moveTask: (task: Task, newStatus: string) => void;
  deleteTask: (taskId: string) => void;
  openUpdateModal: (task: Task) => void;
}

const Column: React.FC<ColumnProps> = ({ status, tasks, moveTask, deleteTask, openUpdateModal }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item: { task: Task }) => {
      if (item.task.status !== status) {
        moveTask(item.task, status);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To-Do":
        return "bg-[#FAC3FF] text-black"; // Light pink
      case "In-Progress":
        return "bg-[#85D9F1] text-black"; // Light blue
      case "Completed":
        return "bg-[#A2D6A0] text-black"; // Light green
      default:
        return "bg-gray-300 text-gray-900"; // Default gray
    }
  };

  return (
    <div
      ref={drop}
      className={`w-1/3 p-4 rounded shadow  border-gray-300 border ${
        isOver ? "bg-gray-300" : "bg-gray-200"
      }`}
    >
      {/* Apply the color only to the text, using inline-block to prevent full width */}
      <h2 className="font-sm text-xl mb-2 py-1 ">
        <span className={`px-2 py-1 rounded-lg ${getStatusColor(status)}`}>
          {status}
        </span>
      </h2>
      <div className="space-y-2">
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            openUpdateModal={openUpdateModal}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
