export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
}

export interface TaskState {
  tasks: Task[];
  filters: {
    status?: TaskStatus;
    priority?: TaskPriority;
  };
  sort: {
    by: 'createdAt' | 'priority';
    order: 'asc' | 'desc';
  };
}

// Action types using discriminated union
export type TaskAction =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt'> }
  | { type: 'UPDATE_TASK'; payload: { id: string } & Partial<Task> }
  | { type: 'DELETE_TASK'; payload: { id: string } }
  | { type: 'SET_FILTER'; payload: { status?: TaskStatus; priority?: TaskPriority } }
  | { type: 'SET_SORT'; payload: { by: 'createdAt' | 'priority'; order: 'asc' | 'desc' } };

export interface TaskManagerProps {
  initialTasks?: Task[];
}
