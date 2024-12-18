const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const PORT = 3000;

// Handle YouTube video download
app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;

    // Validate the URL
    if (!videoUrl || !ytdl.validateURL(videoUrl)) {
        return res.status(400).send('Invalid YouTube URL.');
    }

    try {
        const videoInfo = await ytdl.getInfo(videoUrl);
        const title = videoInfo.videoDetails.title.replace(/[^a-zA-Z0-9 ]/g, ''); // Sanitize title

        // Set headers for file download
        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
        ytdl(videoUrl, { format: 'mp4' }).pipe(res);
    } catch (error) {
        console.error('Error downloading video:', error);
        res.status(500).send('Failed to download video.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});