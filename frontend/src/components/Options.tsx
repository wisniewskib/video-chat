import { useContext, useState } from "react";
import { SocketContext, SocketContextProps } from "../context/SocketContext";

const Options = () => {
	const [myName, setMyName] = useState<string>("");
	const [idToCall, setIdToCall] = useState<string>("");
	const { myId, callAccepted, callEnded, leaveCall, handleNameChange, callUser, activeUsers } = useContext(SocketContext) as SocketContextProps;

	return (
		<div className="w-96">
			<div className="form-control">
				<label className="input-group" htmlFor="name">
					<span>Name</span>
					<input className="input input-bordered w-full" type="text" id="name" onChange={(e) => setMyName(e.target.value)} />
				</label>
				<button className="btn mt-2" onClick={() => handleNameChange(myName)}>
					Set Name
				</button>
			</div>
			<br />
			<h3 className="text-center mb-2 text-lg">Select user and click "Call" </h3>
			<ul className="menu bg-base-100 rounded-box">
				{activeUsers.map(
					({ id, name }) =>
						id !== myId && (
							<li key={id} onClick={() => setIdToCall(id)}>
								<a>
									{name || "Anonymous User"}
									<span className="text-xs text-gray-400">{id}</span>
								</a>
							</li>
						)
				)}
			</ul>
			<br />
			<div className="form-control">
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
					<button className="btn btn-success mt-2" onClick={() => callUser(idToCall)}>
						Call
					</button>
				)}
			</div>
		</div>
	);
};
export default Options;
