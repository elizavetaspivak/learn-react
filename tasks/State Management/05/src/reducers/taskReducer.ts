import {TaskAction, TaskState} from '../types/TaskManager';

// TODO: Implement the reducer function
// 1. Handle ADD_TASK action
// 2. Handle UPDATE_TASK action
// 3. Handle DELETE_TASK action
// 4. Handle SET_FILTER action
// 5. Handle SET_SORT action
// Remember to keep the reducer pure!

export const initialState: TaskState = {
    tasks: [],
    filters: {
        status: undefined,
        priority: undefined,
    },
    sort: {
        by: 'createdAt',
        order: 'desc',
    },
};

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
    switch (action.type) {
        case 'ADD_TASK':
            return {
                ...state,
                tasks: [...state.tasks, {...action.payload, createdAt: new Date(), id: new Date().toString()}],
            };
        case 'UPDATE_TASK':
            return {
                ...state,
                tasks: state.tasks.map(t => t.id === action.payload.id ? {
                    ...t,
                    title: action.payload.title ?? t.title,
                    description: action.payload.description ?? t.description,
                    status: action.payload.status ?? t.status,
                    priority: action.payload.priority ?? t.priority
                } : t),
            };
        case 'DELETE_TASK':
            return {
                ...state,
                tasks: state.tasks.filter((t) => t.id !== action.payload.id),
            };
        case 'SET_FILTER':
            return {
                ...state,
                filters: action.payload,
            };
        case 'SET_SORT':
            return {
                ...state,
                sort: action.payload,
            };
        default:
            return state;
    }
}
