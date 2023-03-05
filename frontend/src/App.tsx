import { useContext, useState } from "react";
import Notifications from "./components/Notifications";
import Options from "./components/Options";
import VideoPlayer from "./components/VideoPlayer";
import { SocketContext } from "./context/SocketContext";

function App() {
	return (
		<div className="flex flex-col items-center container">
			<Notifications />
			<VideoPlayer />
			<Options />
		</div>
	);
}

export default App;
