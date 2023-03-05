import { useContext, useMemo } from "react";
import { SocketContext, SocketContextProps } from "../context/SocketContext";

type Props = {};
const VideoPlayer = (props: Props) => {
	const { myVideo, name, callAccepted, userVideo, callEnded, mediaStream, call } = useContext(SocketContext) as SocketContextProps;

	const myVideoElement = useMemo(() => {
		if (mediaStream) {
			return (
				<video
					ref={(video) => {
						if (video) video.srcObject = myVideo.current.srcObject;
					}}
					muted
					playsInline
					autoPlay
					width="640"
					height="480"
				/>
			);
		}
		return null;
	}, [myVideo, mediaStream]);

	const userVideoElement = useMemo(() => {
		if (callAccepted && !callEnded) {
			return (
				<video
					ref={(video) => {
						if (video && userVideo.current) video.srcObject = userVideo.current.srcObject;
					}}
					playsInline
					autoPlay
					muted
				/>
			);
		}
		return null;
	}, [callAccepted, userVideo.current.srcObject]);

	return (
		<div className="flex mb-8">
			<div className={`card w-96 bg-base-100 shadow-xl ${callAccepted && "mr-4"}`}>
				<div className="card-body items-center ">
					<h3 className="mb-4 text-2xl">{name || "Your Video"}</h3>
					{myVideoElement}
				</div>
			</div>
			{callAccepted && (
				<div className="card w-96 bg-base-100 shadow-xl">
					<div className="card-body items-center">
						<h3 className="mb-4 text-2xl">{call?.name || "Caller"}</h3>
						{userVideoElement}
					</div>
				</div>
			)}
		</div>
	);
};
export default VideoPlayer;
