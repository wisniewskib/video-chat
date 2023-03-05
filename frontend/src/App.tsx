import { useContext, useState } from "react";
import ActiveUsers from "./components/ActiveUsers";
import Notifications from "./components/Notifications";
import Options from "./components/Options";
import VideoPlayer from "./components/VideoPlayer";
import { SocketContext } from "./context/SocketContext";

function App() {
	const [idToCall, setIdToCall] = useState<string>("");
	return (
		<div className="flex flex-col items-center container">
			<Notifications />
			<div className="flex video-container">
				<VideoPlayer />
				<ActiveUsers setIdToCall={setIdToCall} />
			</div>
			<Options idToCall={idToCall} setIdToCall={setIdToCall} />
		</div>
	);
}

export default App;
