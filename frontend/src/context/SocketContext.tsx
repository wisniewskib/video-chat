import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const socket = io(import.meta.env.VITE_SOCKET_IO_URL);

export interface SocketContextProps {
	call: {
		isReceivedCall: boolean;
		from: string;
		name: string;
		signal: any;
	} | null;
	callAccepted: boolean;
	myVideo: React.MutableRefObject<{ srcObject: null | MediaStream }>;
	userVideo: React.MutableRefObject<{ srcObject: null | MediaStream }>;
	mediaStream: null | MediaStream;
	name: string;
	setName: React.Dispatch<React.SetStateAction<string>>;
	callEnded: boolean;
	myId: string;
	callUser: (id: string) => void;
	leaveCall: () => void;
	answerCall: () => void;
}

export const SocketContext = createContext<SocketContextProps | null>(null);

const SocketContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [mediaStream, setMediaStream] = useState<null | MediaStream>(null);
	const [myId, setMyId] = useState<string>("");
	const [call, setCall] = useState<{ isReceivedCall: boolean; from: string; name: string; signal: any } | null>(null);
	const [callAccepted, setCallAccepted] = useState<boolean>(false);
	const [callEnded, setCallEnded] = useState<boolean>(false);
	const [name, setName] = useState<string>("");

	const myVideo = useRef<{ srcObject: null | MediaStream }>({ srcObject: null });
	const userVideo = useRef<{ srcObject: null | MediaStream }>({ srcObject: null });
	const connectionRef = useRef<null | Peer.Instance>(null);

	useEffect(() => {
		(async () => {
			try {
				const currentMediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
				setMediaStream(currentMediaStream);
				myVideo.current.srcObject = currentMediaStream;
			} catch (err) {
				console.error(err);
			}
		})();

		socket.on("me", (id) => setMyId(id));

		socket.on("calluser", ({ signalData, from, name }) => setCall({ isReceivedCall: true, from, name, signal: signalData }));
	}, []);

	const answerCall = () => {
		setCallAccepted(true);

		if (mediaStream && call) {
			const peer = new Peer({ initiator: false, trickle: false, stream: mediaStream });

			peer.on("signal", (data) => {
				socket.emit("answercall", { signal: data, to: call.from });
			});

			peer.on("stream", (currentStream) => {
				userVideo.current.srcObject = currentStream;
			});

			peer.signal(call.signal);

			connectionRef.current = peer;
		}
	};

	const callUser = (id: string) => {
		if (mediaStream && call) {
			const peer = new Peer({ initiator: true, trickle: false, stream: mediaStream });

			peer.on("signal", (data) => {
				socket.emit("calluser", { userToCall: id, signalData: data, from: myId, name: name });
			});

			peer.on("stream", (currentStream) => {
				userVideo.current.srcObject = currentStream;
			});

			socket.on("callaccepted", (signal) => {
				setCallAccepted(true);

				peer.signal(signal);
			});

			connectionRef.current = peer;
		}
	};

	const leaveCall = () => {
		setCallEnded(true);
		connectionRef.current?.destroy();
		window.location.reload();
	};

	return (
		<SocketContext.Provider
			value={{
				call,
				callAccepted,
				myVideo,
				userVideo,
				mediaStream,
				name,
				setName,
				callEnded,
				myId,
				callUser,
				leaveCall,
				answerCall,
			}}>
			{children}
		</SocketContext.Provider>
	);
};

export default SocketContextProvider;
