import express from 'express';
import { fetchUsers, transformData } from './index';

const app = express();
const PORT = 3000;

app.get('/transformed-data', async (req, res) => {
    const users = await fetchUsers();
    const transformedData = transformData(users);
    res.json(transformedData);
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default app;
