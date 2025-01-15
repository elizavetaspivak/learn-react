import React from "react";
import {TaskPriority, TaskStatus} from "../types/TaskManager.ts";

type FiltersProps = {
    status?: TaskStatus;
    priority?: TaskPriority;
    filtersHandleSubmit: (filters: {
        status?: TaskStatus,
        priority?: TaskPriority
    }) => void
}

export const Filters: React.FC<FiltersProps> = React.memo(({filtersHandleSubmit, status, priority}) => {
    const onFiltersChange = (key: 'status' | 'priority', value: TaskPriority | TaskStatus) => {
        filtersHandleSubmit({status, priority, [key]: value})
    }

    const crearFilters = () => {
        filtersHandleSubmit({status: undefined, priority: undefined})
    }

    return (
        <div>
            <label htmlFor="status">Status</label>
            <select id={'status'} value={status} defaultValue={'not selected'}
                    onChange={(e) => onFiltersChange('status', e.currentTarget.value as TaskStatus)}>
                <option value="not selected" disabled>not selected</option>
                <option value="todo">todo</option>
                <option value="in-progress">in-progress</option>
                <option value="done">done</option>
            </select>
            <label htmlFor="priority">Priority</label>
            <select id={'priority'} value={priority} defaultValue={'not selected'}
                    onChange={(e) => onFiltersChange('priority', e.currentTarget.value as TaskPriority)}>
                <option value="not selected" disabled>not selected</option>
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
            </select>
            <button
                onClick={crearFilters}
            >
                Clear
            </button>
        </div>
    )
        ;
})