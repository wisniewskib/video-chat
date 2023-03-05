import { useContext } from "react";
import { SocketContext, SocketContextProps } from "../context/SocketContext";

type Props = {
	setIdToCall: React.Dispatch<React.SetStateAction<string>>;
};

const ActiveUsers = ({ setIdToCall }: Props) => {
	const { myId, callAccepted, activeUsers } = useContext(SocketContext) as SocketContextProps;
	if (callAccepted) {
		return <></>;
	}
	return (
		<div className="card w-full lg:w-96 bg-base-100 shadow-xl mb-8 ">
			<h3 className="text-center my-2 text-xl">Select user and click "Call" </h3>
			<ul className="menu bg-base-100 rounded-box overflow-y-auto max-h-auto flex-nowrap">
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
		</div>
	);
};
export default ActiveUsers;
