import { useToast } from "@joltzrewards/toast";
import { useEffect, useState } from "react";

function App() {
	const toast = useToast();
	const [count, setCount] = useState(0);

	useEffect(() => {
		toast.info(`count is ${count}`);
	}, [count]);

	return (
		<>
			<h1>Count: {count}</h1>
			<button onClick={() => setCount(count + 1)}>Add</button>
		</>
	);
}

export default App;
