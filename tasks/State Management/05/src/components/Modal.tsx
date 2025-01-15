import styles from './modal.module.css'
import {RiCloseLine} from "react-icons/ri";
import React, {useState} from "react";
import {Task, TaskPriority, TaskStatus} from "../types/TaskManager.ts";

type ModalProps = {
    closeModal: () => void
    addTaskHandleSubmit: (task: Task) => void
    updateTaskHandleSubmit: (task: Task) => void
    modalData: Task | null
}

export const Modal: React.FC<ModalProps> = React.memo(({closeModal, addTaskHandleSubmit, updateTaskHandleSubmit, modalData}) => {
    const [task, setTask] = useState<Task>(modalData ?? {
        id: new Date().toString(),
        createdAt: new Date(),
        title: '',
        description: '',
        priority: 'high',
        status: 'done'
    })

    const onSaveChanges = () => {
        closeModal()
        modalData === null && addTaskHandleSubmit(task)

        task && updateTaskHandleSubmit(task)
    }


    const updateTask = (key: keyof Task, value: string | TaskPriority | TaskStatus) => {
        setTask((prevState) => ({...prevState, [key]: value}))
    }

    return (
        <>
            <div className={styles.darkBG} onClick={closeModal}/>
            <div className={styles.centered}>
                <div className={styles.modal}>
                    <div className={styles.modalHeader}>
                        <h5 className={styles.heading}>Add task</h5>
                    </div>
                    <button className={styles.closeBtn} onClick={closeModal}>
                        <RiCloseLine style={{marginBottom: "-3px"}}/>
                    </button>
                    <div className={styles.modalContent}>
                        <label htmlFor="title">Title</label>
                        <input id="title" role={'textbox'} name={'title'} type="text" value={task.title}
                               onChange={e => updateTask('title', e.currentTarget.value)}/>
                        <label htmlFor="description">Description</label>
                        <input id={'description'} role={'textbox'} name={'description'} type="text"
                               value={task.description}
                               onChange={e => updateTask('description', e.currentTarget.value)}/>
                        <label htmlFor="status">Status</label>
                        <select id={'status'} value={task.status}
                                onChange={(e) => updateTask('status', e.currentTarget.value as TaskStatus)}>
                            <option value="todo">todo</option>
                            <option value="in-progress">in-progress</option>
                            <option value="done">done</option>
                        </select>
                        <label htmlFor="priority">Priority</label>
                        <select id={'priority'} value={task.priority}
                                onChange={(e) => updateTask('priority', e.currentTarget.value as TaskPriority)}>
                            <option value="low">low</option>
                            <option value="medium">medium</option>
                            <option value="high">high</option>
                        </select>
                    </div>
                    <div className={styles.modalActions}>
                        <div className={styles.actionsContainer}>
                            <button
                                className={styles.cancelBtn}
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button className={styles.saveBtn} onClick={onSaveChanges}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
})