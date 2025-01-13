import {useEffect, useState} from 'react';
import {
    NotificationPreferencesForm,
    NotificationPreferencesErrors,
} from '../types/NotificationPreferences';
import {array, mixed, number, object, string} from 'yup'

const schema = object().shape({
    email: string().matches(new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'), 'invalid email').required('invalid email'),
    frequency: mixed()
        .oneOf(['daily', 'weekly', 'monthly'] as const)
        .defined().required(),
    time: string()
        .matches(
            /^([01]\d|2[0-3]):([0-5]\d)$/,
            'invalid time'
        )
        .test(
            'is-in-range',
            'invalid time',
            (value) => {
                if (!value) return false; // Проверка на пустое значение
                const [hours, minutes] = value.split(':').map(Number);

                const timeInMinutes = hours * 60 + minutes;
                const startTime = 9 * 60; // 09:00 в минутах
                const endTime = 21 * 60; // 21:00 в минутах

                return timeInMinutes >= startTime && timeInMinutes <= endTime;
            }
        ),
    categories: array(mixed()
        .oneOf(['news', 'updates', 'marketing', 'security'] as const)
        .defined('categories are required')).required('categories are required'),
    maxNotifications: number().required('invalid maxNotifications').min(1, 'invalid maxNotifications').max(10, 'invalid maxNotifications')
}).required();

export const useFormValidation = (initialValues: Partial<NotificationPreferencesForm> = {}) => {
    // TODO: Implement form validation hook
    // 1. Create state for form values and errors
    // 2. Implement validation functions for each field
    // 3. Create handleChange function
    // 4. Create handleSubmit function
    // 5. Return values, errors, handleChange, handleSubmit, and isValid

    const [values, setValues] = useState<NotificationPreferencesForm>({
        email: '',
        frequency: 'weekly',
        categories: [],
        maxNotifications: 0,
        time: '', ...initialValues
    })

    const [errors, setErrors] = useState<NotificationPreferencesErrors>()
    const [isValid, setIsValid] = useState<boolean>(true)

    const validate = () => {
        try {
            schema.validateSync(values, {abortEarly: false})
            setIsValid(true)
            setErrors({})
        } catch (err) {
            // @ts-ignore
            const formattedErrors: NotificationPreferencesErrors = err.inner.reduce((acc: Record<string, string>, curr) => {
                acc[curr.path] = curr.message;
                return acc;
            }, {});

            setErrors(formattedErrors)
            setIsValid(false)
        }
    }

    useEffect(() => {
        validate()
    }, [values])

    const handleChange = (field: string, value: any) => {
        console.log(value, '')
        setValues((prevState) => ({...prevState, [field]: value}))
    }

    const handleSubmit = (callback: (data: NotificationPreferencesForm) => void) => {
        callback(values)
    }

    return {
        values,
        errors,
        handleChange,
        handleSubmit,
        isValid,
    };
};
