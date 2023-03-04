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

app.get("/", (req: Request, res: Response) => {
	res.send("Server is running");
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
