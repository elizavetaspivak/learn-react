import {fireEvent, render, screen} from '@testing-library/react';
import {TaskManager} from '../TaskManager';
import {taskReducer} from '../../reducers/taskReducer';
import {Task} from '../../types/TaskManager';
import {describe, expect, it, vi} from 'vitest';
import {Modal} from "../Modal.tsx";
import {userEvent} from "@testing-library/user-event";

const closeModal = vi.fn();
const updateTask = vi.fn();
const onSaveChanges = vi.fn();

const initialTasks: Task[] = [{
    id: '1',
    title: 'test task',
    description: 'some task',
    status: 'todo',
    priority: 'low',
    createdAt: new Date()
}]

const mockTasks: Task[] = [
    {
        id: '1',
        title: 'Task 1',
        description: 'Description 1',
        status: 'todo',
        priority: 'high',
        createdAt: new Date('2023-01-01T10:00:00'),
    },
    {
        id: '2',
        title: 'Task 2',
        description: 'Description 2',
        status: 'todo',
        priority: 'medium',
        createdAt: new Date('2023-02-01T11:00:00'),
    },
    {
        id: '3',
        title: 'Task 3',
        description: 'Description 3',
        status: 'done',
        priority: 'low',
        createdAt: new Date('2023-03-01T12:00:00'),
    },
];

describe('TaskManager', () => {
    // Test reducer
    describe('taskReducer', () => {
        it('should handle ADD_TASK action', () => {
            const newTask: Task = {
                id: new Date().toString(),
                status: 'done',
                priority: 'low',
                title: 'fs',
                description: 'fd',
                createdAt: new Date()
            }

            const addTaskAction = {
                type: "ADD_TASK",
                payload: newTask,
            };

            expect(taskReducer({
                tasks: initialTasks,
                filters: {},
                sort: {
                    by: "createdAt",
                    order: "asc"
                }
            }, addTaskAction)).toEqual({
                tasks: [...initialTasks, newTask], filters: {},
                sort: {by: 'createdAt', order: 'asc'}
            });

            // TODO: Test that all form fields are rendered correctly
            // TODO: Test ADD_TASK action
        });

        it('should handle UPDATE_TASK action', () => {
            const updatedTask: Task = {
                ...initialTasks[0],
                title: 'updated',
            }

            const updateTaskAction = {
                type: "UPDATE_TASK",
                payload: updatedTask,
            };

            expect(taskReducer({
                tasks: initialTasks,
                filters: {},
                sort: {
                    by: "createdAt",
                    order: "asc"
                }
            }, updateTaskAction)).toEqual({
                tasks: [{
                    ...initialTasks[0],
                    id: '1',
                    title: 'updated',
                    description: 'some task',
                    status: 'todo',
                    priority: 'low',
                }], filters: {},
                sort: {by: 'createdAt', order: 'asc'}
            });
            // TODO: Test UPDATE_TASK action
        });

        it('should handle DELETE_TASK action', () => {
            const deleteTaskAction = {
                type: "DELETE_TASK",
                payload: {id: '1'},
            };

            expect(taskReducer({
                tasks: initialTasks,
                filters: {},
                sort: {
                    by: "createdAt",
                    order: "asc"
                }
            }, deleteTaskAction)).toEqual({
                tasks: [], filters: {},
                sort: {by: 'createdAt', order: 'asc'}
            });
            // TODO: Test DELETE_TASK action
        });

        it('should handle SET_FILTER action', () => {
            const setFilerAction = {
                type: "SET_FILTER",
                payload: {status: 'todo', priority: 'low'},
            };

            expect(taskReducer({
                tasks: [],
                filters: {},
                sort: {
                    by: "createdAt",
                    order: "asc"
                }
            }, setFilerAction)).toEqual({
                tasks: [], filters: {status: 'todo', priority: 'low'},
                sort: {by: 'createdAt', order: 'asc'}
            });
            // TODO: Test SET_FILTER action
        });

        it('should handle SET_SORT action', () => {
            const setSortAction = {
                type: "SET_SORT",
                payload: {by: 'priority', order: 'asc'},
            };

            expect(taskReducer({
                tasks: [],
                filters: {},
                sort: {
                    by: "createdAt",
                    order: "asc"
                }
            }, setSortAction)).toEqual({
                tasks: [], filters: {},
                sort: {by: 'priority', order: 'asc'}
            });
            // TODO: Test SET_SORT action
        });
    });

    // Test component
    describe('TaskManager Component', () => {
        it('renders empty state correctly', () => {
            render(<TaskManager initialTasks={[]}/>);

            const tablist = screen.getByRole('tablist', {name: /item/i});
            expect(tablist).toBeEmptyDOMElement();
            // TODO: Test initial render
        });

        it('can add a new task', async () => {
            render(<Modal
                modalData={null}
                closeModal={closeModal}
                updateTaskHandleSubmit={updateTask}
                addTaskHandleSubmit={onSaveChanges}
            />);

            const titleInput = screen.getByRole('textbox', {name: /title/i});
            const descriptionInput = screen.getByRole('textbox', {name: /description/i});
            const statusSelect = screen.getByRole('combobox', {name: /status/i});
            const prioritySelect = screen.getByRole('combobox', {name: /priority/i});
            const saveButton = screen.getByRole('button', {name: /save/i});

            fireEvent.change(titleInput, {target: {value: 'New Task Title'}});
            fireEvent.change(descriptionInput, {target: {value: 'New Task Description'}});
            fireEvent.change(statusSelect, {target: {value: 'in-progress'}});
            fireEvent.change(prioritySelect, {target: {value: 'high'}});

            fireEvent.click(saveButton);

            expect(onSaveChanges).toHaveBeenCalled();
            expect(onSaveChanges).toHaveBeenCalledWith(expect.objectContaining({
                title: 'New Task Title',
                description: 'New Task Description',
                priority: 'high',
                status: 'in-progress',
            }));
            // TODO: Test adding task
        });

        it('can update task status', async () => {
            render(<Modal
                modalData={initialTasks[0]}
                closeModal={closeModal}
                updateTaskHandleSubmit={updateTask}
                addTaskHandleSubmit={onSaveChanges}
            />);

            const statusSelect = screen.getByRole('combobox', {name: /status/i});
            const saveButton = screen.getByRole('button', {name: /save/i});

            fireEvent.change(statusSelect, {target: {value: 'in-progress'}});

            fireEvent.click(saveButton);

            expect(updateTask).toHaveBeenCalled();
            expect(updateTask).toHaveBeenCalledWith(expect.objectContaining({
                title: 'test task',
                description: 'some task',
                status: 'in-progress',
                priority: 'low',
            }));
            // TODO: Test updating task
        });

        it('can delete a task', async () => {
            render(<TaskManager initialTasks={initialTasks}/>);

            const removeButton = screen.getByRole('button', {name: /remove/i});
            await userEvent.click(removeButton);

            const tablist = screen.getByRole('tablist', {name: /item/i});
            expect(tablist).toBeEmptyDOMElement();
            // TODO: Test deleting task
        });

        it('filters tasks correctly', async () => {
            render(<TaskManager initialTasks={mockTasks}/>);

            const priorityFilter = screen.getByLabelText(/priority/i);
            expect(priorityFilter).toBeInTheDocument();

            fireEvent.change(priorityFilter, {target: {value: 'high'}});

            expect(screen.getByText(/task 1/i)).toBeInTheDocument();
            expect(screen.queryByText(/task 2/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/task 3/i)).not.toBeInTheDocument();
            // TODO: Test filtering
        });

        it('sorts tasks correctly', async () => {
            const initialTasks: Task[] = [
                {id: '1', title: 'Task 1', priority: 'low', description: '', status: 'done', createdAt: new Date('2023-01-01')},
                {id: '2', title: 'Task 2', priority: 'high', description: '', status: 'done', createdAt: new Date('2023-01-02')},
                {id: '3', title: 'Task 3', priority: 'medium', description: '', status: 'done', createdAt: new Date('2023-01-03')},
            ];

            render(<TaskManager initialTasks={initialTasks}/>);

            fireEvent.change(screen.getByLabelText(/sort by/i), {target: {value: 'createdAt'}});
            fireEvent.change(screen.getByLabelText(/sort order/i), {target: {value: 'desc'}});

            const taskTitles = screen.getAllByRole('task').map((task) => task.textContent);

            expect(taskTitles[0]).toContain('Task 3');
            expect(taskTitles[1]).toContain('Task 2');
            expect(taskTitles[2]).toContain('Task 1');
            // TODO: Test sorting
        });

        it('displays correct statistics', async () => {
            const initialTasks = [
                { id: '1', title: 'Task 1', description: 'Description 1', priority: 'low', status: 'todo', createdAt: new Date('2023-01-01') },
                { id: '2', title: 'Task 2', description: 'Description 2', priority: 'medium', status: 'in-progress', createdAt: new Date('2023-01-02') },
                { id: '3', title: 'Task 3', description: 'Description 3', priority: 'high', status: 'done', createdAt: new Date('2023-01-03') },
                { id: '4', title: 'Task 4', description: 'Description 4', priority: 'medium', status: 'todo', createdAt: new Date('2023-01-04') },
            ];

            render(<TaskManager initialTasks={initialTasks} />);

            expect(screen.getByText(/tasks - 4/i)).toBeInTheDocument();

            expect(screen.getByText(/todo - 2/i)).toBeInTheDocument();
            expect(screen.getByText(/in-progress - 1/i)).toBeInTheDocument();
            expect(screen.getByText(/done - 1/i)).toBeInTheDocument();

            expect(screen.getByText(/low - 1/i)).toBeInTheDocument();
            expect(screen.getByText(/medium - 2/i)).toBeInTheDocument();
            expect(screen.getByText(/high - 1/i)).toBeInTheDocument();
            // TODO: Test statistics
        });
    });
});
