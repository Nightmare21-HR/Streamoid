const csv=require('csv-parser');
const stream = require('stream');
const {knex}= require('../db.js');


// Validate rows
function validateProducts(row){

    const required=['sku','name','brand','mrp','price','quantity'];
    for(const field of required){
        if(!row[field])  throw new Error(`Missing Data ${field}`);
        }

    const mrp=parseFloat(row.mrp);
    const quantity=parseFloat(row.quantity);
    const price=parseFloat(row.price);
    if (isNaN(mrp) || isNaN(price) || isNaN(quantity)) {
    throw new Error('Invalid number format for MRP, price, or quantity.');
  }
  if (price > mrp) throw new Error('Price cannot be greater than MRP.');
  if (quantity < 0) throw new Error('Quantity cannot be negative.');
  return { sku: row.sku, name: row.name, brand: row.brand, color: row.color, size: row.size, mrp, price, quantity };

}


const uploadProducts=(req , res)=>{
if(!req.file){
    return res.status(400).json({message:'Attach the CSV file'});

}

const allproduct=[];
const invalid=[];
let count=0;
const readableStream =new stream.PassThrough();
readableStream.end(req.file.buffer);

readableStream.pipe(csv())
.on('data',(row)=> allproduct.push(row))
.on('end',async()=>{
const existing = await knex('products').pluck('sku');
const existingSet = new Set(existing);

for (const [index, row] of allproduct.entries()) {
  const rowno = index + 2;
  try {
    const productdata = validateProducts(row);
    if (existingSet.has(productdata.sku)) {
      invalid.push({ row: rowno, sku: row.sku, error: 'SKU already exists' });
      continue;
    }

    await knex('products').insert(productdata);
    existingSet.add(productdata.sku);
    count++;
        }
        catch(error){
            invalid.push({row:rowno,sku:row.sku || 'N/A',error:error.message});

        }
    }
    res.status(200).json({stored:count, failed:invalid});
});

};


const getAllProducts=async(req,res)=>{

    try{
        const products=await knex('products').select('*');
        res.json(products);
    }
    catch(error){
        res.status(500).json({message:'Something Went Wrong'});
    }
};


const searchProducts=async(req,res)=>{
    const {brand,color,minPrice,maxPrice}=req.query;
    try{

        let query=knex('products').select('*');
        if(brand) query.where('brand','like',`%${brand}%`);
        if(color) query.where('color','like',`%${color}%`);
        if(minPrice) query.where('price','>=',parseFloat(minPrice));
        if(maxPrice) query.where('price','<=',parseFloat(maxPrice));
        const products=await query;
        res.json(products);
    }
    catch(error){

    res.status(500).json({message:"Something went Wrong"});

    }
};
const getProductCount = async (req, res) => {
    try {
        const result = await knex('products').count('id as count').first();
        res.json({ productCount: result.count });
    } catch (error) {
        res.status(500).json({ message: 'Error checking product count', error: error.message });
    }
};

module.exports={
    uploadProducts,
    getAllProducts,
    searchProducts,
    getProductCount,
};

