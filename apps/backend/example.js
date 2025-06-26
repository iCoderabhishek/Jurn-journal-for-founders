require("dotenv").config()

const config = require("./config.json")
const mongoose = require("mongoose")
const conn = mongoose.connect(config.connectionString)
const jwt = require("jsonwebtoken")
const { authenticatedToken, generateEmbedding } = require("./utils")

const bcrypt = require('bcrypt');
const saltRounds = 10;



const User = require("./models/user.model.js")
const Note = require("./models/note.model.js")
const express = require("express")
const cors = require("cors")

const app = express()

app.use(express.json())

app.use( 
    cors({origin: "*"})
)

app.get("/", (req, res) => {
    res.json({data: "hello express"})
})


app.post("/create-account", async(req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res.status(400).json({error: true, message: "Full name is required"})
    }
    if (!email) {
        return res.status(400).json({error: true, message: "email is required"})
    }
    if (!password) {
        return res.status(400).json({error: true, message: "password is required"})
    }

    const isUser = await User.findOne({ email: email })
    if (isUser) {
        return res.json({error: true, message: "User already exists"})
    }



  const hashedPassword = await bcrypt.hash(password, saltRounds);

    //user password must be hashed before saving
    const user = new User({
        fullName,
        email, password: hashedPassword
    });

    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "3600m"
    })

    return res.json({
        error: false,
        user,
        accessToken, 
        message: "Registration Successful"
    })
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body

    if (!email) {
        return res.status(400).json({ error: true, message: "email is required" })
    }
    if (!password) {
        return res.status(400).json({ error: true, message: "password is required" })
    }

    const userInfo = await User.findOne({
        email: email

    })

    if (!userInfo) {
        return res.status(404).json("user not found in db")
    }


    const passwordMatch = await bcrypt.compare(password, userInfo.password);

    if (!passwordMatch) {
        return res.status(400).json({ error: true, message: "Invalid credentials" });
    }



    const user = { user: userInfo }
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "3600m"
    })
    return res.json({
        error: false,
        message: "Login successful",
        email,
        accessToken
    })

       

    
});


app.get("/get-user", authenticatedToken, async (req, res) => {
    
    const { user } = req.user;

    const isUser = await User.findOne({ _id: user._id })
    if (!isUser) return res.json({ error: true, message: "user not found in db" })
    
    return res.status(200)
        .json({ fullName: isUser.fullName, email: isUser.email, "_id": isUser._id, createdOn: isUser.createdOn,  message: '' })
    
})

app.post("/add-note", authenticatedToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const { user } = req.user;

    if (!title || !content) {
        return res.status(400).json({ error: true, message: "Title and content are required" });
    }

    try {
        // Generate the embedding
        const embedding = await generateEmbedding(title + " " + content);

        // Validate that the embedding is an array of 768 numbers
        if (!Array.isArray(embedding) || embedding.length !== 768 || !embedding.every(num => typeof num === "number")) {
            return res.status(500).json({ error: true, message: "Invalid embedding format!" });
        }

        // Create new note
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
            embedding
        });

        console.log("Saving note to DB...");
        await note.save();
        console.log("Note saved successfully!");

        return res.status(201).json({ error: false, note, message: "Note added successfully" });
    } catch (error) {
        console.error("Error adding note:", error);
        return res.status(500).json({ error: true, message: "Error adding note, internal error" });
    }
});


app.put("/edit-note/:noteId", authenticatedToken, async (req, res) => {

    const noteId = req.params.noteId

    const { title, content, tags, isPinned } = req.body
    const { user } = req.user;
    if (!title & !content & !tags) {
        return res.status(400).json({error: true, message: "No changes provided"})
    }

    try {
        
        const note = await Note.findOne({ _id: noteId, userId: user._id })
        
        if (!note) {
            return res.status(400).json({
                error: true, message: "Note not found"
            })
        }
        if(title) note.title = title
        if(content) note.content = content
        if (tags) note.tags = tags
        if (isPinned) note.isPinned = isPinned
        
        await note.save()
        return res.status(200).json({
            error: false, 
            note,
            message: "Note updated successfully"
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Error saving note, internal error"
        });
    };
})

app.get("/get-all-notes/", authenticatedToken, async (req, res) => {

    const { user } = req.user
    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 })
        return res.status(200).json({
            error: false,
            notes,
            message: "All notes retrived successfully"
        })

        
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "error fetching all notes"
        })
    }
})


app.delete("/delete-notes/:noteId", authenticatedToken, async (req, res) => {

    const noteId = req.params.noteId
    const { user } = req.user
    
    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id })
        if (!note) {
            return res.status(404).json({
                error: true,
                message: "Note not found"
            })
        }

        await Note.deleteOne({ _id: noteId, userId: user._id })
        
        res.status(200).json({
            error: false,
            message: "Note deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "error deleting note, internal error"
        })
    }
});

app.put("/update-note-pinned/:noteId", authenticatedToken, async (req, res) => {

    const noteId = req.params.noteId

    const { isPinned } = req.body
    const { user } = req.user;
    if (!isPinned) {
        return res.status(400).json({error: true, message: "No changes provided"})
    }

    try {
        
        const note = await Note.findOne({ _id: noteId, userId: user._id })
        
        // if (!note) {
        //     return res.status(400).json({
        //         error: true, message: "Note not found"
        //     })
        // }

        if (isPinned) note.isPinned = isPinned || false;
        
        await note.save()
        return res.status(200).json({
            error: false, 
            note,
            message: "Note updated successfully"
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Error saving note, internal error"
        });
    };
})

app.get("/search-notes/", authenticatedToken, async (req, res) => {

    const { user } = req.user;
    const { query } = req.query;

    if (!query) {
        res.json(400).status({
            error: true, message: "Search query is required"
        })
    }

    try {
        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } }
            ]
        });
        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes matching search query, retrived successfully"
        });
        
    } catch (error) {
         res.json(500).status({
            error: true, message: "error searching, internal error"
        })
    }
})




app.listen(8000, () => console.log("server is @8000"))

module.exports = app;