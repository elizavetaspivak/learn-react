import {useCallback, useState} from 'react';
import {User} from '../types/User';
import {useUsers} from "../hooks/useUsers.ts";
import {Modal} from "./Modal.tsx";

/**
 * Компонент для отображения и управления списком пользователей.
 *
 * TODO: Реализуйте следующий функционал:
 * 1. Загрузка и отображение списка пользователей
 * 2. Отображение состояния загрузки
 * 3. Обработка ошибок
 * 4. Просмотр деталей пользователя
 * 5. Редактирование пользователя
 * 6. Оптимистичные обновления
 */
export function UserDashboard() {
    const {state, fetchUserById, updateUser, clearSelectedUser} = useUsers()
    const [modalOpen, setModalOpen] = useState(false)
    // TODO: Используйте хук useUsers для получения данных и функций

    // TODO: Добавьте состояние для редактирования пользователя

    // TODO: Реализуйте обработчики событий

    const viewDetailsHandler = async (userId: number) => {
        await fetchUserById(userId)
        setModalOpen(true)
    }

    const closeModalHandler = useCallback(() => {
        clearSelectedUser()
        setModalOpen(false)
    }, [])

    const updateUserHandler = useCallback(async (user: User) => {
        await updateUser(user)
    }, [])


    return (
        <div className="user-dashboard">
            <h1>User Dashboard</h1>
            {modalOpen && state.selectedUser && <Modal selectedUser={state.selectedUser} closeModal={closeModalHandler}
                                                       updateUserHandleSubmit={updateUserHandler}/>}
            {state.loading && 'Loading db.json...'}
            {state.error && 'error'}
            {state.saveError && 'error'}
            {state.users.map(u => (
                <div>
                    {u.name}
                    <button onClick={() => viewDetailsHandler(u.id)}>View Details</button>
                </div>
            ))}

            {/* TODO: Добавьте отображение состояния загрузки */}

            {/* TODO: Добавьте отображение ошибок */}

            {/* TODO: Добавьте список пользователей */}

            {/* TODO: Добавьте отображение деталей пользователя */}

            {/* TODO: Добавьте форму редактирования */}
        </div>
    );
}