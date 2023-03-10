import { useContext, useEffect, useRef } from "react";
import { SocketContext, SocketContextProps } from "../context/SocketContext";
import ring from "../assets/ring.wav";

type Props = {};
const Notifications = (props: Props) => {
	const { answerCall, setCall, call, callAccepted } = useContext(SocketContext) as SocketContextProps;
	const audioRef = useRef<null | HTMLAudioElement>(null);

	useEffect(() => {
		if (call?.isReceivedCall && audioRef.current) {
			audioRef.current.volume = 0.3;
			audioRef.current.play();
		}
	}, [call?.isReceivedCall]);

	const handleAnswerCall = () => {
		answerCall();
		if (audioRef.current) {
			audioRef.current.pause();
		}
	};

	const handleReject = () => {
		//todo add proper reject
		if (audioRef.current) {
			audioRef.current.pause();
			setCall(null);
		}
	};

	return (
		<>
			<audio src={ring} ref={audioRef} />
			{call?.isReceivedCall && !callAccepted && (
				<div className="alert shadow-lg mb-8 mt-2">
					<div>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
						<div>
							<h3 className="font-bold">{call.name || "Someone"} is calling</h3>
						</div>
					</div>
					<div className="flex-none">
						<button className="btn btn-error btn-sm" onClick={handleReject}>
							Reject
						</button>
						<button className="btn btn-sm" onClick={handleAnswerCall}>
							Pick Up
						</button>
					</div>
				</div>
			)}
		</>
	);
};
export default Notifications;
