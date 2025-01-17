import './App.css'
import {UserDashboard} from "./components/UserDashboard.tsx";
import {useEffect} from "react";
import {abortController} from "./api/userApi.ts";

function App() {

    useEffect(() => {
        return () => {
            abortController.abort()
        }
    }, [])

    return (
        <div>
            <UserDashboard/>
        </div>
    )
}

export default App
