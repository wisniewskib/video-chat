import { useContext, useState } from "react";
import Notifications from "./components/Notifications";
import Options from "./components/Options";
import VideoPlayer from "./components/VideoPlayer";
import { SocketContext } from "./context/SocketContext";

function App() {
	return (
		<div>
			<h1>test</h1>
			<VideoPlayer />
			<Options>
				<Notifications />
			</Options>
		</div>
	);
}

export default App;
