import React from "react";

type FiltersProps = {
    sortBy: 'createdAt' | 'priority';
    sortDirection: 'asc' | 'desc';
    sortHandleSubmit: (sort: {
        by: "createdAt" | "priority", order: "asc" | "desc"
    }) => void
}

export const Sort: React.FC<FiltersProps> = React.memo(({sortBy, sortDirection, sortHandleSubmit}) => {
    const onFiltersChange = (key: 'by' | 'order', value: string) => {
        sortHandleSubmit({by: sortBy, order: sortDirection, [key]: value})
    }

    return (
        <div>
            <label htmlFor="sort by">Sort By</label>
            <select id={'sort by'} value={sortBy} defaultValue={'not selected'}
                    onChange={(e) => onFiltersChange('by', e.currentTarget.value)}>
                <option value="not selected" disabled>not selected</option>
                <option value="createdAt">createdAt</option>
                <option value="priority">priority</option>
            </select>
            <label htmlFor="sort order">Sort order</label>
            <select id={'sort order'} value={sortDirection} defaultValue={'not selected'}
                    onChange={(e) => onFiltersChange('order', e.currentTarget.value)}>
                <option value="not selected" disabled>not selected</option>
                <option value="asc">asc</option>
                <option value="desc">desc</option>
            </select>
        </div>
    )
        ;
})