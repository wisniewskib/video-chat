import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

const PORT = process.env.PORT || 5000;

type User = {
	id: string;
	name?: string;
};

const activeUsers: User[] = [];

app.get("/", (req: Request, res: Response) => {
	res.send("Server is running");
});

io.on("connection", (socket: Socket) => {
	socket.emit("me", socket.id);
	activeUsers.push({ id: socket.id });
	io.emit("users", activeUsers);

	socket.on("disconnect", () => {
		activeUsers.splice(
			activeUsers.findIndex((user) => user.id === socket.id),
			1
		);
		io.emit("users", activeUsers);
		socket.broadcast.emit("callended");
	});

	socket.on("calluser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("calluser", { signal: signalData, from, name });
	});

	socket.on("answercall", (data) => {
		io.to(data.to).emit("callaccepted", data.signal);
	});

	socket.on("update-name", ({ id, name }) => {
		const index = activeUsers.findIndex((user) => user.id === id);
		activeUsers[index].name = name;
		io.emit("users", activeUsers);
	});
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
