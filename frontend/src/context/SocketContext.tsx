import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const socket = io(import.meta.env.VITE_SOCKET_IO_URL);

export interface User {
	id: string;
	name?: string;
}

interface Call {
	isReceivedCall: boolean;
	from: string;
	name: string;
	signal: any;
}

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
	handleNameChange: (newName: string) => void;
	callEnded: boolean;
	myId: string;
	callUser: (id: string) => void;
	leaveCall: () => void;
	answerCall: () => void;
	activeUsers: User[];
	setCall: React.Dispatch<React.SetStateAction<Call | null>>;
}

export const SocketContext = createContext<SocketContextProps | null>(null);

const SocketContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [mediaStream, setMediaStream] = useState<null | MediaStream>(null);
	const [myId, setMyId] = useState<string>("");
	const [call, setCall] = useState<Call | null>(null);
	const [callAccepted, setCallAccepted] = useState<boolean>(false);
	const [callEnded, setCallEnded] = useState<boolean>(false);
	const [name, setName] = useState<string>("");
	const [activeUsers, setActiveUsers] = useState<User[]>([]);

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

		socket.on("calluser", ({ signal, from, name }) => setCall({ isReceivedCall: true, from, name, signal: signal }));

		socket.on("callended", () => {
			leaveCall();
		});

		socket.on("users", (users) => {
			setActiveUsers(users);
		});
	}, []);

	const handleNameChange = (newName: string) => {
		setName(newName);
		socket.emit("update-name", { name: newName, id: myId });
	};

	const answerCall = () => {
		if (mediaStream && call) {
			const peer = new Peer({ initiator: false, trickle: false, stream: mediaStream });

			peer.on("signal", (data) => {
				socket.emit("answercall", { signal: data, to: call.from });
			});

			peer.on("stream", (currentStream) => {
				userVideo.current.srcObject = currentStream;
				setCallAccepted(true);
			});

			peer.signal(call.signal);

			connectionRef.current = peer;
		}
	};

	const callUser = (id: string) => {
		if (mediaStream) {
			const peer = new Peer({ initiator: true, trickle: false, stream: mediaStream });

			peer.on("signal", (data) => {
				socket.emit("calluser", { userToCall: id, signalData: data, from: myId, name: name });
			});

			peer.on("stream", (currentStream) => {
				userVideo.current.srcObject = currentStream;
				setCallAccepted(true);
			});

			socket.on("callaccepted", (signal) => {
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
				handleNameChange,
				callEnded,
				myId,
				callUser,
				leaveCall,
				answerCall,
				activeUsers,
				setCall,
			}}>
			{children}
		</SocketContext.Provider>
	);
};

export default SocketContextProvider;
