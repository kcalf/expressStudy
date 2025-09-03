import pool from '../db.js';

export const createItem = async (req, res, next) => {

    const {name, description, price} = req.body;

    if(!name){
        return res.status(400).json({message: '이름은 필수 입력입니다.'});
    }
    if(!Number.isInteger(price) || price < 0)
    {
        return res.status(400).json({message: '가격은 0 이상 숫자로 기입하십시오.'});
    }

    try {
        const [result] = await pool.execute(
        'INSERT INTO items (name, description, price) VALUES (?, ?, ?)',
        [name, Math.floor(Number(description)), price]
    );
        res.status(201).json({ data: { id: result.insertId, name, description, price } });
    } 

    catch (err) {
        next(err);
    }
};

export const listItems  = async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM items ORDER BY id DESC');

        if(rows.length===0)
            {
                return res.status(500).json({message: 'DB 조회 실패'});
            }

        res.json({ data: rows });
    } 
    catch (err) {
        next(err);
    }
};

export const getItem    = async (req, res, next) => {
    const { id } = req.params;

    try {
        if(!Number.isInteger(Number(id)))
        {
            return res.status(400).json({message: 'id는 정수로 입력해주세요.'})
        }

        const [rows] = await pool.execute(
        'SELECT * FROM items WHERE id = ?',
        [id]
        );

        if (rows.length === 0) return res.status(404).json({ error: '존재하지 않는 아이템입니다.' });

        res.json({ data: rows });
    } 
    catch (err) {
        next(err);
    }
};

export const updateItem = async (req, res, next) => {
    try {
        const itemId = req.params.id;
        const { name, description, price } = req.body;

        const [rows] = await pool.query('SELECT * FROM items WHERE id = ?', [itemId]);

        if (rows.length === 0) {
        return res.status(404).json({ error: 'Item not found' });
        }

        const [result] = await pool.execute(
        'UPDATE items SET name = ?, description = ?, price = ? WHERE id = ?',
        [name, description, price, itemId]
        );

        res.status(200).json({
        data: { id: itemId, name, description, price }
        });
    } catch (err) {
        next(err);
    }
};


export const deleteItem = async (req, res, next) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query('DELETE FROM items WHERE id=?',[id]);

        if(rows.length===0)
        {
            res.status(404).send();
        }
        res.status(204).json({message: '204 No Content'});
    } 
    catch (err) {
        next(err);
    }
};