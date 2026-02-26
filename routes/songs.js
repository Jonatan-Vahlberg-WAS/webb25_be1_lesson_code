import { Router } from 'express';
const songRouter = Router();

let songs = [
    { id: 1, title: 'Espresso', artist: 'Sabrina Carpenter', deleted: false },
    { id: 2, title: 'Creep', artist: 'Radiohead', deleted: false },
    { id: 3, title: 'Tití Me Preguntó', artist: 'Bad Bunny', deleted: true },
];

songRouter.get("/", (req, res) => {
    const activeSongs = songs.filter(song => song.deleted === false)
    return res.json(activeSongs)
})

songRouter.get("/:id", (req, res) => {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).json({
            message: "Id has to be a valid number"
        })
    }
    const song = songs.find(song => song.id === id && song.deleted === false)
    if (!song) {
        return res.status(404).json({
            message: "Song does not exist"
        })
    }
    return res.json(song)
})

songRouter.post("/", (req, res) => {
    const { title, artist } = req.body
    if (!title || typeof title !== "string" || !artist || typeof artist !== "string") {
        return res.status(400).json({
            message: "Title and artist are required"
        })
    }
    const lastId = Math.max(...songs.map(song => song.id))
    const song = {
        title,
        artist,
        id: lastId + 1,
        deleted: false   // Ändra till false
    }

    songs.push(song)
    return res.status(201).json(song)
})

// Uppgift 1
songRouter.put('/:id', (req, res) => {
    const id = Number(req.params.id)

    if (isNaN(id)) {
        return res.status(400).json({
            message: "Id has to be a valid number"
        })
    }

    const { title, artist } = req.body

    if (!title || typeof title !== "string" || 
        !artist || typeof artist !== "string") {
        return res.status(400).json({
            message: "New song title and artist are required"
        })
    }

    const song = songs.find(song => song.id === id)

    if (!song || song.deleted) {
        return res.status(404).json({
            message: "Song does not exist"
        })
    }

    song.title = title
    song.artist = artist

    return res.status(200).json(song)
})

// UPPGIFT 2
songRouter.delete('/:id', (req, res) => {
    const id = Number(req.params.id)

    if (isNaN(id)) {
        return res.status(400).json({
            message: "Id has to be a valid number"
        })
    }

    const song = songs.find(song => song.id === id)

    if (!song || song.deleted) {
        return res.status(404).json({
            message: "Song does not exist"
        })
    }

    song.deleted = true

    return res.status(204).send()
})

export default songRouter; 