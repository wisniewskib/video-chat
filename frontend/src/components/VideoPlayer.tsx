import { useContext } from "react";
import { SocketContext, SocketContextProps } from "../context/SocketContext";

type Props = {};
const VideoPlayer = (props: Props) => {
	const { myVideo, name, callAccepted, userVideo, callEnded, mediaStream, call } = useContext(SocketContext) as SocketContextProps;

	return (
		<div>
			<div>
				<h3>{name || "Name"}</h3>
				{myVideo.current && <video playsInline muted autoPlay />}
			</div>
			<div>
				<h3>not my video</h3>
				{myVideo.current && <video playsInline muted autoPlay />}
			</div>
		</div>
	);
};
export default VideoPlayer;
