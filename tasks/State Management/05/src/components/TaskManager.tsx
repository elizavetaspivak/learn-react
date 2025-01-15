import React, {useCallback, useMemo, useReducer, useState} from 'react';
import {Task, TaskManagerProps, TaskPriority, TaskStatus} from '../types/TaskManager';
import {initialState, taskReducer} from '../reducers/taskReducer';
import {Modal} from "./Modal.tsx";
import {Filters} from "./Filters.tsx";
import {Sort} from "./Sort.tsx";

export const TaskManager: React.FC<TaskManagerProps> = ({initialTasks = []}) => {
    // TODO: Implement the component
    // 1. Initialize useReducer with taskReducer and initial state
    // 2. Create handlers for all actions
    // 3. Implement filtering and sorting logic
    // 4. Create UI components for:
    //    - Task list
    //    - Add task form
    //    - Filter controls
    //    - Sort controls
    //    - Statistics
    // 5. Optimize performance with useMemo and useCallback

    const [modalOpen, setModalOpen] = useState(false)
    const [modalData, setModalData] = useState<Task | null>(null)

    const [state, dispatch] = useReducer(taskReducer, {...initialState, tasks: initialTasks});

    let filteredTasks = useMemo(() => state.tasks, [state.tasks]);


    const addTaskHandleSubmit = useCallback((task: Task) => {
        dispatch({type: 'ADD_TASK', payload: task})
    }, [])

    const updateTaskHandleSubmit = useCallback((task: Task) => {
        dispatch({type: 'UPDATE_TASK', payload: task})
    }, [])

    const removeTaskHandleSubmit = useCallback((id: string) => {
        dispatch({type: 'DELETE_TASK', payload: {id}})
    }, [])

    const closeModal = useCallback(() => {
        setModalData(null)
        setModalOpen(false)
    }, [])

    const filtersHandleSubmit = useCallback((filters: {
        status?: TaskStatus,
        priority?: TaskPriority
    }) => {
        dispatch({type: 'SET_FILTER', payload: filters})
    },[])

    const sortHandleSubmit = useCallback((sort: { by: 'createdAt' | 'priority', order: 'asc' | 'desc' }) => {
        dispatch({type: 'SET_SORT', payload: sort})
    }, [])

    if (state.filters.status) {
        filteredTasks = filteredTasks.filter(t => t.status === state.filters.status)
    }

    if (state.filters.priority) {
        filteredTasks = filteredTasks.filter(t => t.priority === state.filters.priority)
    }

    filteredTasks.sort((a, b) => {
        if (state.sort.by === 'createdAt') {
            const dateA = new Date(a[state.sort.by]);
            const dateB = new Date(b[state.sort.by]);

            if (state.sort.order === 'asc') {
                return dateA - dateB;
            } else if (state.sort.order === 'desc') {
                return dateB - dateA;
            }

            return 0; // Если значения равны
        } else {
            const valueA = a[state.sort.by];
            const valueB = b[state.sort.by];

            if (state.sort.order === 'asc') {
                if (valueA < valueB) return -1;
                if (valueA > valueB) return 1;
            } else if (state.sort.order === 'desc') {
                if (valueA < valueB) return 1;
                if (valueA > valueB) return -1;
            }

            return 0;
        }
    })

    return (
        <div>
            <h2>Task Manager</h2>
            <div>
                filters
                <Filters priority={state.filters.priority} status={state.filters.status}
                         filtersHandleSubmit={filtersHandleSubmit}/>
            </div>

            <div>
                sorting
                <Sort sortBy={state.sort.by} sortDirection={state.sort.order} sortHandleSubmit={sortHandleSubmit}/>
            </div>

            <button onClick={() => {
                setModalOpen(true)
                setModalData(null)
            }}>Add task
            </button>

            {modalOpen &&
                <Modal modalData={modalData} closeModal={closeModal} addTaskHandleSubmit={addTaskHandleSubmit}
                       updateTaskHandleSubmit={updateTaskHandleSubmit}/>}

            <div>
                Statistics
                <div>
                    tasks - {state.tasks.length}
                </div>
                <div>
                    tasks by statuses
                    <div>
                        todo - {state.tasks.filter(t => t.status === 'todo').length}
                    </div>
                    <div>
                        in-progress - {state.tasks.filter(t => t.status === 'in-progress').length}
                    </div>
                    <div>
                        done - {state.tasks.filter(t => t.status === 'done').length}
                    </div>
                </div>
                <div>
                    tasks by priority
                    <div>
                        low - {state.tasks.filter(t => t.priority === 'low').length}
                    </div>
                    <div>
                        medium - {state.tasks.filter(t => t.priority === 'medium').length}
                    </div>
                    <div>
                        high - {state.tasks.filter(t => t.priority === 'high').length}
                    </div>
                </div>
            </div>

            <div role={'tablist'} aria-label={'item'}>
                {filteredTasks.map(t => (<div key={t.id} className='task' role={'task'}>
                    <div>
                        title - {t.title}
                    </div>
                    <div>
                        description - {t.description}
                    </div>
                    <div>
                        status - {t.status}
                    </div>
                    <div>
                        priority - {t.priority}
                    </div>
                    <div>
                        createdAt
                        - {t.createdAt.getHours()}.{t.createdAt.getMinutes()} {t.createdAt.getDate()}.{t.createdAt.getMonth() + 1}.{t.createdAt.getFullYear()}
                    </div>
                    <div className='taskButtons'>
                        <button onClick={() => {
                            setModalData(t)
                            setModalOpen(true)
                        }}>Update
                        </button>
                        <button onClick={() => removeTaskHandleSubmit(t.id)}>Remove</button>
                    </div>
                </div>))}
            </div>
            {/* TODO: Implement UI */}
        </div>
    );
};
