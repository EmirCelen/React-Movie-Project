import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

console.log("Backend started ✅");

const JWT_SECRET = process.env.JWT_SECRET;

app.get("/ping", (req, res) => {
    res.json({ message: "Server is alive!" });
});
// Register
app.post("/register", async (req, res) => {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: { email, username, password: hashedPassword },
        });
        res.json({ message: "User registered successfully", user: { id: user.id, email: user.email, username: user.username } });
    } catch (error) {
        res.status(400).json({ error: "Email or username already exists" });
    }
});

// Login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ error: "Invalid username or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid username or password" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
});

// Middleware
const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Unauthorized: No token provided" });

    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.userId = payload.userId;
        next();
    } catch {
        res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};

// Add to My List
app.post("/mylist", auth, async (req, res) => {
    const { movieId, mediaType } = req.body;
    try {
        const item = await prisma.myList.create({
            data: { userId: req.userId, movieId, mediaType },
        });
        res.json(item);
    } catch (error) {
        res.status(400).json({ error: "Already in list" });
    }
});
// Get My List
app.get("/mylist", auth, async (req, res) => {
    const list = await prisma.myList.findMany({
        where: { userId: req.userId },
    });
    res.json(list);
});

// 🔹 Remove from My List
app.delete("/mylist/:movieId", auth, async (req, res) => {
    const movieId = parseInt(req.params.movieId);
    if (!movieId) return res.status(400).json({ error: "Invalid movieId" });

    try {
        await prisma.myList.deleteMany({
            where: { userId: req.userId, movieId },
        });
        res.json({ message: "Removed from My List" });
    } catch (err) {
        res.status(400).json({ error: "Could not remove movie" });
    }
});

app.listen(process.env.PORT || 5001, () =>
    console.log(`Server running on http://localhost:${process.env.PORT || 5001}`)
);
