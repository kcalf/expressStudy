import pool from '../db.js';

// 전체 상품 조회
export const getAllProducts = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    if(rows.length===0)
		{
			return res.status(500).json({message: 'DB 조회 실패'});
		}
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
};

// 상품 생성
export const createProduct = async (req, res, next) => {
  const { name, price } = req.body;

  if (!name || !price) {
			return res.status(400).json({ message: 'Bad Request' });
		}
    
  if (!Number.isInteger(price))
  {
    return res.status(400).json({message: 'price는 숫자로만 입력해주세요.'});
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO products (name, price) VALUES (?, ?)',
      [name, price]
    );
    res.status(201).json({ data: { id: result.insertId, name, price } });
  } catch (err) {
    next(err);
  }
};

// 단일 상품 조회
export const getProductById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if(!Number.isInteger(Number(id)))
    {
      return res.status(400).json({message:'유효하지 않은 id 포맷'})
    }

    const [rows] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ data: rows[0] });
  } catch (err) {
    next(err);
  }
};
