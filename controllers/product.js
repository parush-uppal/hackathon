const product = require('../models/product');
const Product = require('../models/product')
const cloudinary = require('cloudinary').v2;
const ExcelJS = require('exceljs');

cloudinary.config({
    cloud_name: "dklbcplh0",
    api_key: "356539712994955",
    api_secret: "Ldcp1IEN72XcntCalOGe3RSfUuY"
});

exports.create = async (req, res) => {
    const { name, description, price,discount,attributes,image } = req.body
    const uploadedImages = [];
    if(image){
        try {
            
        
            // Iterate over the array of image paths
            for (const imagePath of images) {
              // Upload each image to Cloudinary
              const result = await cloudinary.uploader.upload(imagePath);
        
              // Add the uploaded image's URL to the array
              uploadedImages.push(result.secure_url);
            }
        
            // Return array of uploaded image URLs
            return uploadedImages;
          } catch (error) {
            console.error('Error uploading images:', error);
            throw error;
          }
    }
    const newProduct = new Product({ name,description, price,discount,attributes,image:uploadedImages});
    await newProduct.save()
    res.json({
        product: newProduct,
      });
};

exports.all = async (req, res) => {
  const { name, description, price,discount,attributes,image } = req.body
  const uploadedImages = [];
  if(image){
      try {
          
      
          // Iterate over the array of image paths
          for (const imagePath of images) {
            // Upload each image to Cloudinary
            const result = await cloudinary.uploader.upload(imagePath);
      
            // Add the uploaded image's URL to the array
            uploadedImages.push(result.secure_url);
          }
      
          // Return array of uploaded image URLs
          return uploadedImages;
        } catch (error) {
          console.error('Error uploading images:', error);
          throw error;
        }
  }
  const newProduct = new Product({ name,description, price,discount,attributes,image:uploadedImages});
  await newProduct.save()
  res.json({
      product: newProduct,
    });
};


exports.excel = async (req, res) => {
  try {
    // Find all products
    const products = await Product.find().lean().exec();

    if (products.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    // Define headers
    const headers = ['name','description','price','attributes','discount'];
    worksheet.addRow(headers);

    // Add data to worksheet
    products.forEach(product => {
      const rowData = [
        product.name,
        product.description,
        product.price,
        product.attributes,
        product.discount
      ];
      worksheet.addRow(rowData);
    });

    // Save Excel file
    await workbook.xlsx.writeFile('output.xlsx');

    console.log('Excel file saved successfully');

    res.json({
      message: "Success",
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while generating Excel file.' });
  }
};
