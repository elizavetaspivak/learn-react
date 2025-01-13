import {useState} from "react";

interface ExerciseCounterProps {
  exerciseName: string;
}

export function ExerciseCounter({ exerciseName }: ExerciseCounterProps) {
    const [count, setCount] = useState<number>(0)
  // TODO: Implement state management using useState hook
  // The counter should:
  // 1. Track count starting from 0
  // 2. Provide increment functionality
  // 3. Provide decrement functionality (not going below 0)
  // 4. Provide reset functionality

    const incrementCountHandle = () => {
        setCount((prevState) => prevState + 1)
    }

    const decrementCountHandle = () => {
        setCount((prevState) => prevState - 1)
    }

    const resetCountHandle = () => {
        setCount(0)
    }
  
  return (
    <div className="exercise-counter">
      <h3>{exerciseName}</h3>
        <div>
            <button onClick={decrementCountHandle} disabled={count === 0}>decrement</button>
            {count}
            <button onClick={incrementCountHandle}>increment</button>
            <button onClick={resetCountHandle}>reset</button>
        </div>
        {/* TODO: Implement the counter UI with:
          - Display for current count
          - Increment button
          - Decrement button (should be disabled when count is 0)
          - Reset button
      */}
    </div>
  );
}
