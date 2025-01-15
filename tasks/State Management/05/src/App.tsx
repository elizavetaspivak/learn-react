import './App.css'
import {TaskManager} from "./components/TaskManager.tsx";
import {Task} from "./types/TaskManager.ts";

const initialTasks: Task[] = [{
    id: '1',
    title: 'test task',
    description: 'some task',
    status: 'todo',
    priority: 'low',
    createdAt: new Date()
}]

function App() {

    return (
        <>
            <div>
                <TaskManager initialTasks={initialTasks}/>
            </div>
        </>
    )
}

export default App
