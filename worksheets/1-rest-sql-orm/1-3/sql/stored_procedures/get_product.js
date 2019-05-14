const massive = require('../../database/massive')

module.exports = massive.then(db => {
    db.query(
        `
        CREATE OR REPLACE FUNCTION get_product (title_param VARCHAR) 
        RETURNS TABLE (
            id INT,
            title VARCHAR(255),
            price NUMERIC,
            created_at timestamp with time zone,
            deleted_at timestamp with time zone,
            tags VARCHAR(255)[]
        ) 
        AS $$
        BEGIN
            RETURN QUERY SELECT
            products.id, products.title, products.price, products.created_at, products.deleted_at, products.tags
            FROM products
            WHERE products.title = title_param
            ORDER BY PRICE ASC ;
        END; $$ 
         
        LANGUAGE 'plpgsql';
        `
    )
})