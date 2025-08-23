import pool from '../db.js';

// 전체 주문 조회
export const getAllOrders = async (req, res, next) => {
	try {
		const [rows] = await pool.query('SELECT * FROM orders');
		if(rows.length===0)
		{
			return res.status(500).json({message: 'DB 조회 실패'});
		}
		res.json({ data: rows });
	} catch (err) {
		next(err);
	}
};

// 주문 생성
export const createOrder = async (req, res, next) => {
	const { user_id, product_id } = req.body;
	if (!user_id || !product_id) {
			return res.status(400).json({ message: 'Bad Request' });
		}
	try {
		const [userRows] = await pool.query('SELECT id FROM users WHERE id = ?',[user_id]);
		const [productRows] = await pool.query('SELECT id FROM products WHERE id = ?',[product_id]);
		if (userRows.length === 0 || productRows.length === 0) {
			return res.status(404).json({ message: '404 not found' });
		}

		const [result] = await pool.execute(
			'INSERT INTO orders (user_id, product_id) VALUES (?, ?)',
			[user_id, product_id]
		);
		
		res.status(201).json({
			data: { id: result.insertId, user_id, product_id },
		});
	} catch (err) {
		next(err);
	}
};

// 사용자+상품 JOIN 조회
export const getJoinedOrders = async (req, res, next) => {
	try {
		const sql = `
        SELECT o.id AS order_id,
                u.name AS user_name,
                p.name AS product_name,
                o.order_date
        FROM orders o
        JOIN users u       ON o.user_id    = u.id
        JOIN products p    ON o.product_id = p.id
    `;
		const [rows] = await pool.query(sql);
		if(rows.length===0)
		{
			return res.status(200).json({data: []});
		}
		res.json({ data: rows });
	} catch (err) {
		next(err);
	}
};

// 특정 사용자 주문 조회
export const getUserOrders = async (req, res, next) => {
	const { userId } = req.params;
	try {
		const sql = `
		SELECT 	ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY o.order_date) AS id,
				u.id AS user_id,
				u.name AS user_name,
				p.name AS product_name,	
				o.order_date
		FROM orders o
        JOIN users u       ON o.user_id    = u.id
        JOIN products p    ON o.product_id = p.id
		WHERE u.id = ? 
		`;
		const [rows] = 	await pool.query(sql, [userId]);

		const [userRows] = await pool.query('SELECT user_id FROM orders WHERE user_id = ?',[userId]);
		if(userRows.length===0)
		{
			return res.status(404).json({message: 'user not found'});
		}

		res.json({ data: rows });
	} catch (err) {
		next(err);
	}
};
