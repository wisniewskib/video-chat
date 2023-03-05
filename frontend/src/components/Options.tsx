import { useContext, useState } from "react";
import { SocketContext, SocketContextProps } from "../context/SocketContext";

type Props = {
	idToCall?: string;
	setIdToCall: React.Dispatch<React.SetStateAction<string>>;
};

const Options = ({ idToCall, setIdToCall }: Props) => {
	const [myName, setMyName] = useState<string>("");

	const { myId, callAccepted, callEnded, leaveCall, handleNameChange, callUser, activeUsers } = useContext(SocketContext) as SocketContextProps;

	return (
		<div className="flex ">
			<div className="form-control w-96 mr-2">
				<label className="input-group" htmlFor="name">
					<span>Name</span>
					<input className="input input-bordered w-full" type="text" id="name" onChange={(e) => setMyName(e.target.value)} />
				</label>
				<button className="btn mt-2" onClick={() => handleNameChange(myName)}>
					Set Name
				</button>
			</div>
			<br />
			<div className="form-control w-96">
				<label className="input-group" htmlFor="id-to-call">
					<span>Recipient</span>
					<input
						className="input input-bordered w-full"
						type="text"
						id="id-to-call"
						value={idToCall}
						onChange={(e) => setIdToCall(e.target.value)}
					/>
				</label>
				{callAccepted && !callEnded ? (
					<button className="btn" onClick={leaveCall}>
						Leave call
					</button>
				) : (
					<button className="btn btn-success mt-2" onClick={() => idToCall && callUser(idToCall)}>
						Call
					</button>
				)}
			</div>
		</div>
	);
};
export default Options;
