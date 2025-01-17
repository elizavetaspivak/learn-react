import {useReducer, useEffect} from 'react';
import {userReducer, initialState} from '../reducers/userReducer';
import {userApi} from '../api/userApi';
import {User} from "../types/User.ts";

/**
 * Хук для управления данными пользователей.
 *
 * TODO: Реализуйте следующий функционал:
 * 1. Загрузка списка пользователей
 * 2. Получение деталей пользователя
 * 3. Обновление данных пользователя
 * 4. Периодическое обновление данных
 * 5. Отмена запросов при размонтировании
 * 6. Обработка ошибок
 */
export function useUsers() {
    const [state, dispatch] = useReducer(userReducer, initialState)
    // TODO: Инициализируйте useReducer с userReducer

    useEffect(() => {
        fetchUsers()

        const intervalId = setInterval(() => {
            fetchUsers()
        }, 30000)

        return () => {
            clearInterval(intervalId)
        }
    }, []);

    const fetchUsers = async () => {
        try {
            dispatch({type: "FETCH_USERS_START"})
            const users = await userApi.getUsers()
            console.log(users, 'users')
            dispatch({type: 'FETCH_USERS_SUCCESS', payload: users})
        } catch (err: unknown) {
            dispatch({type: "FETCH_USERS_ERROR", payload: 'Server error' as string});
        }
    }

    const fetchUserById = async (id: number) => {
        dispatch({type: "CLEAR_SELECTED_USER"})
        const user = await userApi.getUser(id)
        dispatch({type: 'SELECT_USER', payload: user})
    }

    const clearSelectedUser = () => {
        dispatch({type: "CLEAR_SELECTED_USER"})
    }

    const updateUser = async (user: User) => {
        dispatch({type: 'UPDATE_USER_SUCCESS', payload: user})
        dispatch({type: "UPDATE_USER_ERROR", payload:  null});

        try {
            dispatch({type: "UPDATE_USER_START"})
            const updatedUser = await userApi.updateUser(user)
            dispatch({type: 'UPDATE_USER_SUCCESS', payload: updatedUser})
        } catch (err: unknown) {
            dispatch({type: "UPDATE_USER_ERROR", payload: 'Server error' as string});
        }
    }

    // TODO: Реализуйте функцию загрузки пользователей

    // TODO: Реализуйте функцию получения деталей пользователя

    // TODO: Реализуйте функцию обновления пользователя

    // TODO: Реализуйте функцию очистки выбранного пользователя

    // TODO: Добавьте эффект для начальной загрузки данных

    // TODO: Добавьте эффект для периодического обновления

    return {
        fetchUsers,
        fetchUserById,
        clearSelectedUser,
        updateUser,
        state
        // TODO: Верните необходимые данные и функции
    };
}