import styles from './modal.module.css'
import {RiCloseLine} from "react-icons/ri";
import React, {useState} from "react";
import {User} from "../types/User.ts";

type ModalProps = {
    selectedUser: User
    closeModal: () => void
    updateUserHandleSubmit: (user: User) => void
}
type ModalErrors = Partial<Record<keyof User, string>>;

export const Modal: React.FC<ModalProps> = React.memo(({closeModal, selectedUser, updateUserHandleSubmit}) => {
    const [user, setUser] = useState<User>(selectedUser)
    const [modalType, setModalType] = useState<'details' | 'edit'>('details')
    const [modalErrors, setModalErrors] = useState<ModalErrors | null>(null)

    const onSaveChanges = () => {
        closeModal()
        updateUserHandleSubmit(user)
    }


    const updateUser = (key: keyof User, value: string) => {
        validate(key, value)
        setUser((prevState) => ({...prevState, [key]: value}))
    }

    const validate = (key: keyof User, value: string ) => {
        setModalErrors(null)

        if (user[key] === value){
            setModalErrors({...modalErrors, [key]: 'Not chanheg'})
        }

        if (key === 'name'){
            if (!user[key] || user[key].length === 0){
                setModalErrors({...modalErrors, [key]: "Shouldn/'t be empty"})
            }
        }
    }

    return (
        <>
            <div className={styles.darkBG} onClick={closeModal}/>
            <div className={styles.centered}>
                <div className={styles.modal}>
                    <div className={styles.modalHeader}>
                        <h5 className={styles.heading}>{modalType === 'details' ? 'User Details' : 'Edit User'}</h5>
                    </div>
                    <button className={styles.closeBtn} onClick={closeModal}>
                        <RiCloseLine style={{marginBottom: "-3px"}}/>
                    </button>
                    <div className={styles.modalContent}>
                        {modalType === 'details' ? <div>
                            {user.name}
                            {user.email}
                            <button onClick={() => setModalType('edit')}>Edit</button>
                        </div> : <div>
                            <label htmlFor="name">Name:</label>
                            <input id="name" role={'textbox'} name={'name'} type="text" value={user.name}
                                   onChange={e => updateUser('name', e.currentTarget.value)}/>
                            {modalErrors?.name && <p>{modalErrors.name}</p>}
                            <label htmlFor="email">Email:</label>
                            <input id={'email'} role={'textbox'} name={'email'} type="text"
                                   value={user.email}
                                   onChange={e => updateUser('email', e.currentTarget.value)}/>
                            {modalErrors?.email && <p>{modalErrors.email}</p>}
                            <div className={styles.modalActions}>
                                <div className={styles.actionsContainer}>
                                    <button
                                        className={styles.cancelBtn}
                                        onClick={closeModal}
                                    >
                                        Cancel
                                    </button>
                                    <button className={styles.saveBtn} onClick={onSaveChanges} disabled={!!modalErrors}>
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        </>
    );
})