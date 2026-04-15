const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "Smart Coach API is UP! 🚀" });
});

app.listen(5000, () => console.log("Backend khdam f port 5000"));