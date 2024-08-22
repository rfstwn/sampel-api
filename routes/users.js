import express from 'express';
const userRouter = express.Router();
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

// Mock Database
const data = [
    /**
     * * Data Example
     * ! {name : string, age: number, id: string}
     */
];

const userSchema = z.object({
    name: z.string().min(3),
    age: z.number().positive(),
});

const patchUserSchema = z.object({
    name: z.string().min(3).optional(),
    age: z.number().positive().optional(),
});

userRouter.post('/data-dummy', (req, res) => {
    const dummyData = [
        { name: 'Edison Conrad', age: 10, id: uuidv4() },
        { name: 'Kelly Webster', age: 15, id: uuidv4() },
        { name: 'Kelli Russell', age: 21, id: uuidv4() },
        { name: 'Jan Bush', age: 30, id: uuidv4() },
        { name: 'Selma Friedman', age: 24, id: uuidv4() },
    ];
    dummyData.map((user) => data.push(user));
    res.status(200).json({
        data: dummyData,
        message: 'success',
    });
});

/**
 * * This endpoint can be use to :
 *  1. Get all data with /users
 *  2. pagination with @param {page} and @param {limit} /users?page=1&limit=2
 *  3. filter with @param {minAge} and @param {searchName} /users?minAge=20&searchName=edison
 */
userRouter.get('/', (req, res) => {
    let dataResult = [...data];
    const { minAge, searchName, page, limit } = req.query;

    if (minAge) dataResult = dataResult.filter((user) => user.age >= minAge);
    if (searchName)
        dataResult = dataResult.filter((user) =>
            user.name.toLowerCase().includes(searchName.toLowerCase())
        );
    console.log(searchName);
    const pageLimit = limit ? parseInt(limit) : 3;
    const offset = (page - 1) * pageLimit;
    const result = page ? dataResult.slice(offset, offset + pageLimit) : dataResult;

    res.status(200).json({
        data: {
            users: result,
            count: dataResult.length,
        },
        message: 'success',
    });
});

userRouter.get('/:id', (req, res) => {
    const id = req.params.id;
    const result = data.find((user) => user.id === id);

    if (result === undefined) {
        return res.status(404).json({
            message: 'Data Not Found',
        });
    }
    res.status(200).json({
        data: result,
        message: 'success',
    });
});

userRouter.post('/', (req, res) => {
    const validatedUser = userSchema.safeParse(req.body);
    if (!validatedUser.success) {
        return res.status(403).json({
            message: 'Invalid Format',
            error: validatedUser.error,
        });
    } else {
        data.push({ ...req.body, id: uuidv4() });
        res.status(200).json({
            data: `${req.body.name} has been added`,
            message: 'success',
        });
    }
});

userRouter.delete('/:id', (req, res) => {
    const { id } = req.params;

    if (id === 'all') {
        data = [];
        return res.status(200).json({
            message: 'success',
        });
    }

    const index = data.findIndex((user) => user.id === id);
    if (index === -1) {
        return res.status(404).json({
            message: 'Data Not Found',
        });
    }
    data.splice(index, 1);
    res.status(200).json({
        message: 'success',
    });
});

userRouter.patch('/:id', (req, res) => {
    const id = req.params.id;
    const validatedUser = patchUserSchema.safeParse(req.body);
    const index = data.findIndex((user) => user.id === id);
    if (index === -1) {
        return res.status(404).json({
            message: 'Data Not Found',
        });
    }

    if (!validatedUser.success) {
        return res.status(403).json({
            message: 'Invalid Format',
            error: validatedUser.error,
        });
    }

    const { name, age } = req.body;
    data[index]['name'] = name ? name : data[index]['name'];
    data[index]['age'] = age ? age : data[index]['age'];
    res.status(200).json({
        message: 'success',
    });
});

export default userRouter;
