const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Endpoint to fetch 4 random nature images from Lorem Picsum
app.get('/nature', async (req, res) => {
    try {
        // Create an array of 4 random image URLs
        const images = [
            'https://picsum.photos/600/400?random=1',
            'https://picsum.photos/600/400?random=2',
            'https://picsum.photos/600/400?random=3',
            'https://picsum.photos/600/400?random=4'
        ];

        // Send back the random image URLs in the response
        res.json({
            message: "Here are 4 random nature images!",
            images: images
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching the random nature images');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
