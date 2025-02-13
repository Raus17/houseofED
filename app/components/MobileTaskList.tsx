"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { fetchTasks, addTask } from "../redux/tasksSlice";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../FirebaseConfig";
import TaskDrawer from "./TaskDrawer";

interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  status: string;
  category: string;
  attachment?: File;
  attachmentURL?: string;
}

const MobileTaskList: React.FC = () => {
  const [user] = useAuthState(auth);
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [expandedSections, setExpandedSections] = useState({
    "To-Do": true,
    "In-Progress": true,
    "Completed": false,
  });

  useEffect(() => {
    if (user) {
      dispatch(fetchTasks(user.uid));
    }
  }, [dispatch, user]);

  const handleAddTask = useCallback(
    async (taskData: {
      title: string;
      description: string;
      date: string;
      status: string;
      category: string;
      attachment?: File;
    }) => {
      if (!user) return;

      try {
        const newTask: Task = {
          id: "", // Firebase will set this
          ...taskData,
        };

        await dispatch(addTask({ userId: user.uid, task: newTask })).unwrap();
      } catch (error) {
        console.error("Error adding task:", error);
      }
    },
    [user, dispatch]
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const renderSection = (status: string, color: string) => {
    const tasksInSection = tasks.filter((task) => task.status === status);
    const isExpanded = expandedSections[status];

    return (
      <div key={status} className="mb-4">
        <div
          className={`p-3 ${color} rounded-lg flex justify-between items-center cursor-pointer`}
          onClick={() => toggleSection(status)}
        >
          <span className="font-medium">
            {status} ({tasksInSection.length})
          </span>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        {isExpanded && (
          <div className="bg-white p-3 rounded-lg shadow-md">
            {tasksInSection.length === 0 ? (
              <p className="text-gray-500 text-center">No tasks</p>
            ) : (
              <ul>
                {tasksInSection.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center gap-2 p-2 border-b"
                  >
                    <input type="checkbox" className="rounded" />
                    <span className="flex-1 truncate">{task.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 max-w-md mx-auto pt-20">
      <TaskDrawer onSave={handleAddTask} />
      {renderSection("To-Do", "bg-pink-200 mt-4")}
      {renderSection("In-Progress", "bg-blue-200")}
      {renderSection("Completed", "bg-green-200")}

    </div>
  );
};

export default MobileTaskList;
