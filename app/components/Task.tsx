import React from "react";
import { useDrag } from "react-dnd";
import parse from "html-react-parser";

interface TaskProps {
  task: Task;
  deleteTask: (taskId: string) => void;
  openUpdateModal: (task: Task) => void;
}

const Task: React.FC<TaskProps> = ({ task, deleteTask, openUpdateModal }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { task },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-3 bg-white rounded shadow cursor-move ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <h3 className="font-bold">{task.title}</h3>
      <div className="mt-1">{parse(task.description)}</div>
      <div className="mt-2 flex justify-between items-center">
        <div className="text-sm text-gray-600">Due: {task.date}</div>
        <div className="flex gap-2">
          <button
            onClick={() => openUpdateModal(task)}
            className="text-blue-500 hover:text-blue-700"
          >
            Update
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Task;