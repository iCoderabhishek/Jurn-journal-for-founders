import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
const express = require("express");
const app = express();

app.use(express.json());

const prisma = new PrismaClient();

app.get("/api/v1/user", (req: Request, res: Response) => {
    const userId = req.query.userId as string | undefined;
    const user = prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
});


app.get("/api/v1/quote", (req: Request, res: Response) => {
    const quoteId = req.query.id as string | undefined;
    const quote = prisma.quote.findUnique({
        where: {
            id: quoteId,
        },
    });
    if (!quote) {
        res.status(404).json({ message: "Quote not found" });
        return;
    }
    res.json(quote);
});

app.get("/api/v1/summary", (req: Request, res: Response) => {
    const summaryId = req.query.id as string | undefined;
    const summary = prisma.summary.findUnique({
        where: {
            id: summaryId,
        },
    });
    if (!summary) {
        res.status(404).json({ message: "Summary not found" });
        return;
    }
    res.json(summary);
})

app.post("/api/v1/quote", (req: Request, res: Response) => {
    const quote = prisma.quote.create({
        data: {
            text: req.body.text,
            author: req.body.author,
            type: req.body.type,
        },
    });
    res.json(quote);
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});