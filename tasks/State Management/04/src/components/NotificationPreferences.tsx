import React from 'react';
import {
    NotificationPreferencesProps,
    NotificationCategory,
    NotificationFrequency
} from '../types/NotificationPreferences';
import {useFormValidation} from '../hooks/useFormValidation';
import {Input, Select, TimePicker} from "antd";
import dayjs from 'dayjs';

const NOTIFICATION_CATEGORIES: NotificationCategory[] = ['news', 'updates', 'marketing', 'security'];
const NOTIFICATION_FREQUENCIES: NotificationFrequency[] = ['daily', 'weekly', 'monthly'];
const timeFormat = 'HH:mm';

export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({onSubmit, initialValues}) => {
    // TODO: Implement the component using useFormValidation hook
    // 1. Initialize form validation hook with initialValues
    // 2. Create form JSX with all required fields
    // 3. Add error messages display
    // 4. Implement form submission
    // 5. Style the component

    const {values, errors, isValid, handleSubmit, handleChange} = useFormValidation(initialValues)

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            isValid && handleSubmit(onSubmit);
        }}>
            <h2>Notification Preferences</h2>
            <div className={'container'}>
                <label>
                    email
                    <Input placeholder="Basic usage" value={values.email}
                           onChange={(e) => handleChange('email', e.currentTarget.value)}/>
                    {errors?.email && <p  className={'error'}>{errors.email}</p>}
                </label>
            </div>
            <div className={'container'}>
                <label>
                    frequency
                    <div>
                        <Select value={values.frequency}
                                style={{width: '100%'}}
                                options={NOTIFICATION_FREQUENCIES.map(f => ({value: f, label: <span>{f}</span>}))}
                                onChange={(e) => handleChange('frequency', e)}/>
                        {errors?.frequency && <p className={'error'}>{errors.frequency}</p>}
                    </div>
                </label>
            </div>
            <div className={'container'}>
                <label>
                    categories
                    <Select
                        mode="multiple"
                        style={{width: '100%'}}
                        placeholder="Please select"
                        defaultValue={values.categories}
                        onChange={(categories) => handleChange('categories', categories)}
                        options={values.categories.length === 1 ? NOTIFICATION_CATEGORIES.map(c => ({
                            value: c,
                            label: <span>{c}</span>,
                            disabled: c === values.categories[0]
                        })) : NOTIFICATION_CATEGORIES.map(c => ({value: c, label: <span>{c}</span>}))}
                    />
                    {errors?.categories && <p className={'error'}>{errors.categories}</p>}
                </label>
            </div>
            <div className={'container'}>
                <label>
                    time
                    <div>
                        <TimePicker
                            value={dayjs(values.time, timeFormat)}
                            format={timeFormat}
                            style={{width: '100%'}}
                            allowClear={false}
                            hideDisabledOptions={true}
                            disabledHours={() => [1, 2, 3, 4, 5, 6, 7, 8, 22, 23, 0]}
                            onChange={(_date, dateString) => handleChange('time', dateString)}
                        />
                        {errors?.time && <p className={'error'}>{errors.time}</p>}
                    </div>
                </label>
            </div>
            <div className={'container'}>
                <label>
                    maxNotifications
                    <Input placeholder="Basic usage" value={values.maxNotifications}
                           type='number'
                           onChange={(e) => handleChange('maxNotifications', +e.currentTarget.value)}/>
                    {errors?.maxNotifications && <p className={'error'}>{errors.maxNotifications}</p>}
                </label>
            </div>

            <button type={'submit'} disabled={!isValid}> Save</button>

            {/* TODO: Add form fields */}
        </form>
    );
};
