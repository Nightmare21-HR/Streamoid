const knex=require('knex')({
    client:'sqlite3',
    connection:{
        filename:'./data/products.db',

    },
    useNullAsDefault: true,
});
// database setup
async function setupDatabase() {
    const table=await knex.schema.hasTable('products');
    if(!table){
        console.log('Creating a Table');
       // Inside the setupDatabase function in db.js
await knex.schema.createTable('products', (table) => {
    table.increments('id').primary();
    table.string('sku').unique().notNullable();
    table.string('name').notNullable();
    table.string('brand').notNullable();
    table.float('mrp').notNullable();      
    table.float('price').notNullable();    
    table.integer('quantity').notNullable(); 
    table.string('color');
    table.string('size');
});
        console.log('Table "products" created');
    }
    
    
}

module.exports={knex,setupDatabase};