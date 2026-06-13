import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname is not available in ES modules, so we need to construct it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { GoogleGenAI } from '@google/genai';

const app = express();

const ai= new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const gemini_model ='gemini-3.5-flash';

app.use(cors());
app.use(express.json());
// Serve frontend static files from the public directorys
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000;

// Start server and increase socket timeout to allow long-running AI requests
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Increase server timeout to 10 minutes (600000 ms) to avoid automatic socket
// timeouts for long model responses. Adjust as needed.
server.setTimeout(600000);

app.post('/api/chat', async (req, res) => {
    const {conversation} = req.body;
    try{
        if(!Array.isArray(conversation)){
        throw new Error('Conversation must be an array of messages');
        }
        const contents = conversation.map(({role, text}) => ({
            role,
            parts: [{text}]
        }));
        const response = await ai.models.generateContent({
            model: gemini_model,
            contents,
            config:{systemInstruction:'Jawab hanya dengan bahasa Indonesia'}
        });
        res.status(200).json({response: response.text});
    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({error: 'Failed to generate response'});
    }
})

