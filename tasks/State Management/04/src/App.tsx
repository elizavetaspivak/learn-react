import './App.css'
import {NotificationPreferences} from "./components/NotificationPreferences.tsx";
import {NotificationPreferencesForm} from "./types/NotificationPreferences.ts";

const initialValues: NotificationPreferencesForm = {
    email: 'ttt@gmail.com',
    frequency: 'daily' ,
    time: '09:00',
    categories: ['news', 'updates'],
    maxNotifications: 5,
}

function App() {

    const handleSubmin = (form: NotificationPreferencesForm) => {
        console.log(form)
    }

  return (
    <>
      <div>
          <NotificationPreferences initialValues={initialValues} onSubmit={handleSubmin}/>
      </div>
    </>
  )
}

export default App
