import express from 'express';
import cors from 'cors';
import userRouter from './routes/users.js';
import bodyParser from 'body-parser';

const app = express();
const port = 5000;
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello, this is Sample API for Frontend testing');
});

app.get('/error-500', (req, res) => {
    res.status(500).send({
        message: 'Internal Server Error',
    });
});

app.get('/error-401', (req, res) => {
    res.status(401).send({
        message: 'Unauthorized',
    });
});

app.get('/error-401', (req, res) => {
    res.status(404).send({
        message: 'Data Not Found',
    });
});

//Router
app.use('/users', userRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
