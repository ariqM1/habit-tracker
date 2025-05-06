import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
	const [habits, setHabits] = useState([]);
	const [habitInput, setHabitInput] = useState("");

	const today = new Date().toISOString().split("T")[0]; // e.g., '2025-05-06'

	// Load from localStorage on mount
	useEffect(() => {
		const savedHabits = JSON.parse(localStorage.getItem("habits")) || [];
		setHabits(savedHabits);
	}, []);

	// Save to localStorage whenever habits change
	useEffect(() => {
		localStorage.setItem("habits", JSON.stringify(habits));
	}, [habits]);

	const addHabit = () => {
		if (habitInput.trim() === "") return;
		const newHabit = {
			id: Date.now(),
			text: habitInput,
			completedToday: false,
			lastCompletedDate: null,
		};
		setHabits([newHabit, ...habits]);
		setHabitInput("");
	};

	const toggleHabit = (id) => {
		setHabits(
			habits.map((habit) => {
				if (habit.id === id) {
					// If already completed today, uncheck it; else check it
					const isCompleted = habit.lastCompletedDate === today;
					return {
						...habit,
						completedToday: !isCompleted,
						lastCompletedDate: !isCompleted ? today : null,
					};
				}
				return habit;
			})
		);
	};

	const deleteHabit = (id) => {
		setHabits(habits.filter((habit) => habit.id !== id));
	};

	const clearCompleted = () => {
		setHabits(
			habits.map((habit) => ({
				...habit,
				completedToday: false,
				lastCompletedDate: null,
			}))
		);
	};

	return (
		<div className="container">
			<h1>Habit Tracker</h1>
			<p className="date">{new Date().toLocaleDateString()}</p>

			<div className="form">
				<input
					type="text"
					value={habitInput}
					onChange={(e) => setHabitInput(e.target.value)}
					placeholder="Enter a daily habit"
				/>
				<button onClick={addHabit}>Add</button>
			</div>

			{habits.length === 0 ? (
				<p>No habits yet. Add one above!</p>
			) : (
				<ul>
					{habits.map((habit) => {
						const isCompletedToday =
							habit.lastCompletedDate === today;
						return (
							<li
								key={habit.id}
								className={isCompletedToday ? "completed" : ""}
							>
								{habit.text}
								<div>
									<button
										onClick={() => toggleHabit(habit.id)}
									>
										✅
									</button>
									<button
										onClick={() => deleteHabit(habit.id)}
									>
										🗑️
									</button>
								</div>
							</li>
						);
					})}
				</ul>
			)}

			{habits.length > 0 && (
				<button className="clear-btn" onClick={clearCompleted}>
					Reset All for Tomorrow
				</button>
			)}
		</div>
	);
}

export default App;
