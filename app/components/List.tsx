"use client"
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchTasks, addTask, updateTask, deleteTask, updateTasksStatus } from '../redux/tasksSlice';
import AddTaskModal from './AddTaskModal';
import UpdateTaskModal from './UpdateTaskModal';
import TaskFilters from './TaskFilters';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../FirebaseConfig';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  category?: string;
  date?: string;
  attachmentData?: {
    base64: string;
    type: string;
    name: string;
  };
}

const List: React.FC = () => {
  const [user] = useAuthState(auth);
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    'To-Do': true,
    'In-Progress': true,
    'Completed': false
  });
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState('');

  useEffect(() => {
    if (user) {
      dispatch(fetchTasks(user.uid));
    }
  }, [dispatch, user]);

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  const handleAddTask = (task: Omit<Task, "id">) => {
    if (!user) return;
    dispatch(addTask({ userId: user.uid, task })).then(() => {
      dispatch(fetchTasks(user.uid));
      setIsAddModalOpen(false);
    });
  };

  const handleUpdateTask = (updatedTask: Task) => {
    if (!user) return;
    dispatch(updateTask({ userId: user.uid, taskId: updatedTask.id, updates: updatedTask }))
      .then(() => {
        setIsUpdateModalOpen(false);
        dispatch(fetchTasks(user.uid));
      })
      .catch((error) => {
        console.error("Failed to update task:", error);
      });
  };

  const handleDeleteSelected = () => {
    if (!user) return;
    selectedTasks.forEach(taskId => {
      dispatch(deleteTask({ userId: user.uid, taskId }));
    });
    setSelectedTasks([]);
    dispatch(fetchTasks(user.uid));
  };

  const handleBulkStatusUpdate = () => {
    if (!user || !bulkStatus || selectedTasks.length === 0) return;
    dispatch(updateTasksStatus({ 
      userId: user.uid, 
      taskIds: selectedTasks, 
      newStatus: bulkStatus 
    })).then(() => {
      setSelectedTasks([]);
      setBulkStatus('');
      dispatch(fetchTasks(user.uid));
    });
  };

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId) 
        : [...prev, taskId]
    );
  };

  const openUpdateModal = (task: Task) => {
    setEditTask(task);
    setIsUpdateModalOpen(true);
  };

  const toggleAllTasksInSection = (status: string, checked: boolean) => {
    const tasksInSection = filteredTasks.filter(task => task.status === status);
    if (checked) {
      const newSelectedTasks = [...new Set([...selectedTasks, ...tasksInSection.map(task => task.id)])];
      setSelectedTasks(newSelectedTasks);
    } else {
      setSelectedTasks(prev => prev.filter(id => !tasksInSection.some(task => task.id === id)));
    }
  };

  const areAllTasksInSectionSelected = (status: string) => {
    const tasksInSection = filteredTasks.filter(task => task.status === status);
    return tasksInSection.every(task => selectedTasks.includes(task.id));
  };

  return (
    <div className="p-4">
      {selectedTasks.length > 0 && (
        <div className="flex justify-between bg-gray-100 p-3 rounded-lg mb-4">
          <span>{selectedTasks.length} tasks selected</span>
          <div className="flex space-x-4">
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="p-2 border rounded-lg"
            >
              <option value="">Change Status</option>
              <option value="To-Do">To-Do</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <button 
              onClick={handleBulkStatusUpdate}
              disabled={!bulkStatus}
              className={`px-4 py-2 rounded ${
                bulkStatus 
                  ? 'bg-[#7B1984] text-white hover:bg-purple-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Update Status
            </button>
            <button 
              onClick={handleDeleteSelected} 
              className="text-red-600 hover:text-red-900"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <TaskFilters tasks={tasks} onFilterChange={setFilteredTasks} />
        <button 
          onClick={() => setIsAddModalOpen(true)} 
          className="p-2 px-6 bg-[#7B1984] text-white rounded-full hover:bg-purple-700"
        >
          Add Task
        </button>
      </div>
      {['To-Do', 'In-Progress', 'Completed'].map(status => (
  <div key={status} className="mb-4">
    <div 
      className={`p-3 rounded-t-lg flex justify-between items-center cursor-pointer ${
        status === 'To-Do' ? 'bg-pink-200' :
        status === 'In-Progress' ? 'bg-blue-200' :
        status === 'Completed' ? 'bg-green-200' : 'bg-gray-200'
      }`}
      onClick={() => setExpandedSections(prev => ({ ...prev, [status]: !prev[status] }))}
    >
      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          className="rounded border-gray-300"
          checked={areAllTasksInSectionSelected(status)}
          onChange={(e) => {
            e.stopPropagation();
            toggleAllTasksInSection(status, e.target.checked);
          }}
          onClick={(e) => e.stopPropagation()}
        />
        <span className="font-medium">{status}</span>
        <span className="text-sm text-gray-600">
          ({filteredTasks.filter(task => task.status === status).length})
        </span>
      </div>
      {expandedSections[status] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </div>

    <div 
      className={`border border-t-0 rounded-b-lg overflow-hidden transition-all duration-700 ${
        expandedSections[status] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      {filteredTasks
        .filter(task => task.status === status)
        .map(task => (
          <div key={task.id} className="grid grid-cols-4 p-3 hover:bg-gray-50">
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                className="rounded border-gray-300" 
                checked={selectedTasks.includes(task.id)} 
                onChange={() => toggleTaskSelection(task.id)}
              />
              <span className="truncate">{task.title}</span>
            </div>
            <div>{task.date ? new Date(task.date).toLocaleDateString('en-US') : 'No due date'}</div>
            <div>{task.status}</div>
            <div className="flex space-x-2">
              <button 
                onClick={() => openUpdateModal(task)} 
                className="text-gray-600 hover:text-gray-900"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
    </div>
  </div>
))}


      {isAddModalOpen && (
        <AddTaskModal 
          onClose={() => setIsAddModalOpen(false)} 
          onSave={handleAddTask} 
        />
      )}
      
      {isUpdateModalOpen && editTask && (
        <UpdateTaskModal 
          task={editTask} 
          onClose={() => setIsUpdateModalOpen(false)} 
          onSave={handleUpdateTask} 
        />
      )}
    </div>
  );
};

export default List;