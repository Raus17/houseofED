import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../FirebaseConfig";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc , writeBatch  } from "firebase/firestore";

interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  status: string;
  category: string;
  attachmentData?: {
    base64: string;
    type: string;
    name: string;
  };
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Fetch tasks
export const fetchTasks = createAsyncThunk<Task[], string>(
  "tasks/fetchTasks",
  async (userId) => {
    const tasksSnapshot = await getDocs(collection(db, `users/${userId}/tasks`));
    return tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task));
  }
);

// Add a new task
export const addTask = createAsyncThunk<Task, { userId: string; task: Task }>(
  "tasks/addTask",
  async ({ userId, task }) => {
    let attachmentData = null;

    if (task.attachment) {
      const base64 = await fileToBase64(task.attachment);
      attachmentData = {
        base64,
        type: task.attachment.type,
        name: task.attachment.name
      };
    }

    const taskData = {
      title: task.title,
      description: task.description,
      date: task.date,
      status: task.status,
      category: task.category,
      attachmentData
    };

    const docRef = await addDoc(collection(db, `users/${userId}/tasks`), taskData);
    return { id: docRef.id, ...taskData };
  }
);

// Update a task
export const updateTask = createAsyncThunk<
  Task,
  { userId: string; taskId: string; updates: Task }
>("tasks/updateTask", async ({ userId, taskId, updates }) => {
  const taskRef = doc(db, `users/${userId}/tasks/${taskId}`);
  const updateData: Partial<Task> = { ...updates };
  delete updateData.id;

  if (updates.attachment instanceof File) {
    const base64 = await fileToBase64(updates.attachment);
    updateData.attachmentData = {
      base64,
      type: updates.attachment.type,
      name: updates.attachment.name
    };
  }

  delete updateData.attachment;
  await updateDoc(taskRef, updateData);

  return {
    id: taskId,
    ...updates,
    attachmentData: updateData.attachmentData || updates.attachmentData,
  };
});

// Delete a task
export const deleteTask = createAsyncThunk<
  string,
  { userId: string; taskId: string }
>("tasks/deleteTask", async ({ userId, taskId }) => {
  await deleteDoc(doc(db, `users/${userId}/tasks/${taskId}`));
  return taskId;
});

export const updateTasksStatus = createAsyncThunk<
  { taskIds: string[]; newStatus: string },
  { userId: string; taskIds: string[]; newStatus: string }
>("tasks/updateTasksStatus", async ({ userId, taskIds, newStatus }) => {
  const batch = writeBatch(db);
  
  taskIds.forEach((taskId) => {
    const taskRef = doc(db, `users/${userId}/tasks/${taskId}`);
    batch.update(taskRef, { status: newStatus });
  });

  await batch.commit();
  return { taskIds, newStatus };
});


const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    changeTaskStatus: (state, action: PayloadAction<{ taskId: string; newStatus: string }>) => {
      const task = state.tasks.find(task => task.id === action.payload.taskId);
      if (task) {
        task.status = action.payload.newStatus;
      }
    }

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tasks";
      })
      .addCase(addTask.pending, (state) => {
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
        state.error = null;
      })
      .addCase(addTask.rejected, (state, action) => {
        state.error = action.error.message || "Failed to add task";
      })
      .addCase(updateTask.pending, (state) => {
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update task";
      })
      .addCase(deleteTask.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete task";
      })
      .addCase(updateTasksStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(updateTasksStatus.fulfilled, (state, action) => {
        const { taskIds, newStatus } = action.payload;
        state.tasks = state.tasks.map(task => 
          taskIds.includes(task.id) ? { ...task, status: newStatus } : task
        );
        state.error = null;
      })
      .addCase(updateTasksStatus.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update tasks status";
      });
      
  },
});

export default tasksSlice.reducer;