import { Router } from 'express';
import { getAllPlaylists, getPlaylistById, createPlaylist, updatePlaylist, deletePlaylist } from '../db/playlists.js';
const router = Router();

router.get('/', async (req, res) => {
    const playlists = await getAllPlaylists();
    res.json(playlists);
});

router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const playlist = await getPlaylistById(id);
    if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
    }
    res.json(playlist);
});

router.post('/', async (req, res) => {
        const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ error: 'name and description are required' });
    }

    const newPlaylist = await createPlaylist(name, description);

    res.status(201).json(newPlaylist);
});

router.put('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ error: 'name and description are required' });
    }
    const playlist = await getPlaylistById(id);
    if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
    }
    const updatedPlaylist = await updatePlaylist(id, name, description);
    res.json(updatedPlaylist);
});

router.post('/:id/songs', async (req, res) => {
    const id = Number(req.params.id);
    const { songId } = req.body;
    const playlist = await getPlaylistById(id);
    if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
    }
    const updatedPlaylist = await addSongToPlaylist(id, songId);
    res.json(updatedPlaylist);
});

router.delete('/:id/songs/:songId', async (req, res) => {
    const id = Number(req.params.id);
    const songId = Number(req.params.songId);
    const playlist = await getPlaylistById(id);
    if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
    }
    const updatedPlaylist = await removeSongFromPlaylist(id, songId);
    res.json(updatedPlaylist);
});

router.delete('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const playlist = await getPlaylistById(id);
    if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
    }
    const deletedPlaylist = await deletePlaylist(id);
    res.json(deletedPlaylist);
});

export default router;