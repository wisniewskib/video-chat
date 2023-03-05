import { useContext, useMemo } from "react";
import { SocketContext, SocketContextProps } from "../context/SocketContext";

type Props = {};
const VideoPlayer = (props: Props) => {
	const { myVideo, name, callAccepted, userVideo, callEnded, mediaStream, call } = useContext(SocketContext) as SocketContextProps;

	const myVideoElement = useMemo(() => {
		if (mediaStream) {
			return (
				<video
					className="rounded-lg"
					ref={(video) => {
						if (video) video.srcObject = myVideo.current.srcObject;
					}}
					muted
					playsInline
					autoPlay
				/>
			);
		}
		return null;
	}, [myVideo, mediaStream]);

	const userVideoElement = useMemo(() => {
		if (callAccepted && !callEnded) {
			return (
				<div className="relative ">
					<video
						className="rounded-lg"
						ref={(video) => {
							if (video && userVideo.current) video.srcObject = userVideo.current.srcObject;
						}}
						playsInline
						autoPlay
						muted
					/>
					<div className="absolute bottom-2 right-2 w-32 shadow-md">{myVideoElement}</div>
				</div>
			);
		}
		return null;
	}, [callAccepted, userVideo.current.srcObject]);

	return (
		<div className={`flex mb-8 ${!callAccepted && "video-card"}`}>
			<div className={`card w-full  bg-base-100 shadow-xl  lg:mr-2`}>
				<div className="card-body items-center">
					<h3 className="mb-4 text-2xl">{name || "Your Video"}</h3>
					{callAccepted ? userVideoElement : myVideoElement}
				</div>
			</div>
			{/* {callAccepted && (
				<div className="card w-full  bg-base-100 shadow-xl video-card">
					<div className="card-body items-center">
						<h3 className="mb-4 text-2xl">{call?.name || "Caller"}</h3>
						{userVideoElement}
					</div>
				</div>
			)} */}
		</div>
	);
};
export default VideoPlayer;
