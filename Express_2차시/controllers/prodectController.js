export const getProducts = (req, res) => {
    const { productName, price } = req.query;
    res.json({
        message: "Product List",
        filters: { productName, price }
    });
}

export const createProduct = (req, res) => {
    const { productName, price } = req.body;
    res.status(201).json({
        message: "Product Created",
        data: {
            productName: productName,
            price: price
        }
    });
}