import express from 'express';
import cors from 'cors';
import scrapRoutes from './routes/scraping.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/", scrapRoutes);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
