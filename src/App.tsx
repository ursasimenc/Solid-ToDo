import { Component, createSignal, createEffect, Show, For } from "solid-js";
import { createStore } from "solid-js/store";
import "./App.scss";

const App: Component = () => {
	const [theme, setTheme] = createSignal("");
	const [todos, setTodos] = createStore([]);
	const [undone, setUndone] = createSignal(0);

	createEffect(() => {
		const themeConf = window.matchMedia("(prefers-color-scheme: dark)").matches;
		themeConf ? setTheme("dark") : setTheme("light");
		let todosStorage = localStorage.getItem("todos") as any;
		todosStorage = JSON.parse(todosStorage);
		const undoneTasks = todosStorage.filter((todo: any) => todo.checked === false);
		setTodos(todosStorage);
		setUndone(undoneTasks.length);
	});

	const toggleTheme = () => {
		theme() === "light" ? setTheme("dark") : setTheme("light");

		const items = document.querySelectorAll(".adaptive");

		items.forEach((element: any) => {
			element.classList.remove("dark");
			element.classList.remove("light");
			element.classList.add(`${theme()}`);
		});
	};

	const addTask = (e: any) => {
		if (e.key === "Enter") {
			const checkbox = document.querySelector("#add-check") as HTMLInputElement;

			const obj = {
				id: todos.length + 1,
				task: e.target.value,
				checked: checkbox.checked,
			};

			checkbox.checked ? setUndone(undone()) : setUndone(undone() + 1);

			e.target.value = "";
			checkbox.checked = false;

			setTodos([...todos, obj]);

			localStorage.setItem("todos", JSON.stringify(todos));
		}
	};

	const removeTask = (id: any) => {
		const newTodos = todos.filter((todo: any) => todo.id !== id);
		setTodos(newTodos);
		localStorage.setItem("todos", JSON.stringify(todos));
	};

	const removeCompletedTasks = () => {
		const newTodos = todos.filter((todo: any) => todo.checked === false);
		setTodos(newTodos);
		localStorage.setItem("todos", JSON.stringify(todos));
	};

	const filterTasks = (id: any) => {
		let todosStorage = localStorage.getItem("todos") as any;
		todosStorage = JSON.parse(todosStorage);

		switch (id) {
			case 1:
				setTodos(todosStorage);
				break;
			case 2:
				const notDoneTodos = todosStorage.filter((todo: any) => todo.checked === false);
				setTodos(notDoneTodos);
				break;
			case 3:
				const doneTodos = todosStorage.filter((todo: any) => todo.checked === true);
				setTodos(doneTodos);
				break;
		}

		document.querySelectorAll(".filter")?.forEach((filter: any) => filter.classList.remove("selected"));
		document.querySelector(`#filter-${id}`)?.classList.add("selected");
	};

	const checkTask = (id: any, checked: boolean) => {
		setTodos(
			(todos) => todos.id === id,
			"checked",
			(checked) => !checked
		);

		checked ? setUndone(undone() + 1) : setUndone(undone() - 1);

		localStorage.setItem("todos", JSON.stringify(todos));
	};

	return (
		<div class="wrapper adaptive">
			<div class="bg-photo adaptive">
				<div class="title_theme">
					<h1 id="title">todo</h1>
					<div class="theme">
						<Show
							when={theme() === "dark"}
							fallback={
								<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" onClick={toggleTheme}>
									<path
										fill="#FFF"
										fill-rule="evenodd"
										d="M13 0c.81 0 1.603.074 2.373.216C10.593 1.199 7 5.43 7 10.5 7 16.299 11.701 21 17.5 21c2.996 0 5.7-1.255 7.613-3.268C23.22 22.572 18.51 26 13 26 5.82 26 0 20.18 0 13S5.82 0 13 0z"
									/>
								</svg>
							}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" onClick={toggleTheme}>
								<path
									fill="#FFF"
									fill-rule="evenodd"
									d="M13 21a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-5.657-2.343a1 1 0 010 1.414l-2.121 2.121a1 1 0 01-1.414-1.414l2.12-2.121a1 1 0 011.415 0zm12.728 0l2.121 2.121a1 1 0 01-1.414 1.414l-2.121-2.12a1 1 0 011.414-1.415zM13 8a5 5 0 110 10 5 5 0 010-10zm12 4a1 1 0 110 2h-3a1 1 0 110-2h3zM4 12a1 1 0 110 2H1a1 1 0 110-2h3zm18.192-8.192a1 1 0 010 1.414l-2.12 2.121a1 1 0 01-1.415-1.414l2.121-2.121a1 1 0 011.414 0zm-16.97 0l2.121 2.12A1 1 0 015.93 7.344L3.808 5.222a1 1 0 011.414-1.414zM13 0a1 1 0 011 1v3a1 1 0 11-2 0V1a1 1 0 011-1z"
								/>
							</svg>
						</Show>
					</div>
				</div>
			</div>
			<main>
				<div class="content">
					<div class="input adaptive">
						<div class="checkbox-div">
							<input type="checkbox" name="add-check" id="add-check" />
						</div>
						<input type="text" name="add" id="add" onKeyPress={addTask} />
					</div>

					<div class="list adaptive">
						<div class="stats adaptive">
							<div class="uncompleted">
								{undone()}{" "}
								<Show when={undone() === 1} fallback={<>items</>}>
									item
								</Show>{" "}
								left
							</div>
							<div class="filters">
								<div class="filter selected" id="filter-1" onClick={() => filterTasks(1)}>
									All
								</div>
								<div class="filter" id="filter-2" onClick={() => filterTasks(2)}>
									Active
								</div>
								<div class="filter" id="filter-3" onClick={() => filterTasks(3)}>
									Completed
								</div>
							</div>
							<div class="clear" onClick={removeCompletedTasks}>
								Clear completed
							</div>
						</div>
						<For
							each={todos}
							fallback={
								<div class="item">
									{" "}
									<span class="item-task">No tasks!</span>
								</div>
							}
						>
							{(todo) => {
								return (
									<div class="item">
										<div class="checkbox-div">
											<input type="checkbox" name="add-check" id="add-check" onChange={() => checkTask(todo.id, todo.checked)} checked={todo.checked} />
										</div>
										<span class="item-task">{todo.task}</span>
										<div id="cross">
											<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" onClick={() => removeTask(todo.id)}>
												<path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z" />
											</svg>
										</div>
									</div>
								);
							}}
						</For>
					</div>
				</div>
			</main>
		</div>
	);
};

export default App;
