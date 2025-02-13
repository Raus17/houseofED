import React, { useEffect, useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { fetchTasks, addTask, updateTask, deleteTask } from "../redux/tasksSlice";
import AddTaskModal from "./AddTaskModal";
import UpdateTaskModal from "./UpdateTaskModal";
import Column from "./Column";
import TaskFilters from "./TaskFilters";
import { auth } from "../../FirebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

// Task interface
interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  category?: string;
  dueDate?: string;
}

const Board: React.FC = () => {
  const [user] = useAuthState(auth);
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchTasks(user.uid));
    }
  }, [dispatch, user]);

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  const handleFilterChange = (filtered: Task[]) => {
    setFilteredTasks(filtered);
  };

  const handleAddTask = (task: Omit<Task, "id">) => {
    if (!user) return;
    dispatch(addTask({ userId: user.uid })).then(() => {
      dispatch(fetchTasks(user.uid));
      setIsAddModalOpen(false);
    });
  };

  const handleUpdateTask = (updatedTask: Task) => {
    if (!user) return;
    dispatch(updateTask({ 
      userId: user.uid, 
      taskId: updatedTask.id, 
      updates: updatedTask 
    })).unwrap()
      .then(() => {
        setIsUpdateModalOpen(false);
        dispatch(fetchTasks(user.uid));
      })
      .catch((error) => {
        console.error("Failed to update task:", error);
      });
  };

  const handleMoveTask = useCallback(
    (task: Task, newStatus: string) => {
      if (!user || task.status === newStatus) return;
      const updatedTask = { ...task, status: newStatus };
      dispatch(updateTask({ 
        userId: user.uid, 
        taskId: task.id, 
        updates: updatedTask 
      })).then(() => {
        dispatch(fetchTasks(user.uid));
      });
    },
    [dispatch, user]
  );

  const handleDeleteTask = (taskId: string) => {
    if (!user) return;
    dispatch(deleteTask({ userId: user.uid, taskId })).then(() => {
      dispatch(fetchTasks(user.uid));
    });
  };

  const openUpdateModal = (task: Task) => {
    setEditTask(task);
    setIsUpdateModalOpen(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
  <div className="p-4">
    {user ? (
      <>
        <div className="flex justify-between items-center mb-4">
          {/* Task Filters and Add Task Button on the same line */}
          <div className="flex items-center gap-4">
            <TaskFilters 
              tasks={tasks} 
              onFilterChange={handleFilterChange} 
            />
          </div>

          <div className="flex items-center">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="p-2 px-6 bg-[#7B1984] text-white rounded-full hover:bg-purple-700"
            >
              Add Task
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          {["To-Do", "In-Progress", "Completed"].map((status) => (
            <Column
              key={status}
              status={status}
              tasks={filteredTasks.filter((task) => task.status === status)}
              moveTask={handleMoveTask}
              deleteTask={handleDeleteTask}
              openUpdateModal={openUpdateModal}
            />
          ))}
        </div>
        
        {isAddModalOpen && (
          <AddTaskModal
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleAddTask}
          />
        )}
        {isUpdateModalOpen && editTask && (
          <UpdateTaskModal
            onClose={() => setIsUpdateModalOpen(false)}
            onSave={handleUpdateTask}
            task={editTask}
          />
        )}
      </>
    ) : (
      <p className="text-center text-red-500">Please log in to manage tasks.</p>
    )}
  </div>
</DndProvider>

  );
};

export default Board;
