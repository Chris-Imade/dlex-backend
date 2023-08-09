const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Function to create CSV file
const createCsv = (transactions) => {
  const csvWriter = createCsvWriter({
    path: 'transactions.csv',
    header: [
      { id: 'id', title: 'Transaction ID' },
      { id: 'clientName', title: 'Client Name' },
      { id: 'status', title: 'Status' },
      { id: 'priority', title: 'Priority' },
      { id: 'deadline', title: 'Deadline' },
      { id: 'email', title: 'Email' },
      { id: 'phone', title: 'Phone' },
      { id: 'phoneTwo', title: 'Phone Two' },
      { id: 'desc', title: 'Description' },
      { id: 'uniqueIdentifier', title: 'Unique Identifier' },
      { id: 'productName', title: 'Product Name' },
      { id: 'productPrice', title: 'Product Price' },
      { id: 'productDiscountPrice', title: 'Product Discount Price' },
      { id: 'productDesc', title: 'Product Description' },
      { id: 'productUniqueIdentifier', title: 'Product Unique Identifier' },
    ],
  });

  // Map transactions and products data to rows
  const csvRows = [];
  transactions.forEach((transaction) => {
    transaction.products.forEach((product) => {
      const row = {
        id: transaction._id,
        clientName: transaction.clientName,
        status: transaction.status,
        priority: transaction.priority,
        deadline: transaction.deadline,
        email: transaction.email,
        phone: `+${transaction.phone}`,
        phoneTwo: `+${transaction.phoneTwo}`,
        desc: transaction.desc,
        uniqueIdentifier: transaction.uniqueIdentifier,
        productName: product.name,
        productPrice: product.price,
        productDiscountPrice: product.discountPrice,
        productDesc: product.desc,
        productUniqueIdentifier: product.uniqueIdentifier,
      };
      csvRows.push(row);
    });
  });

  // Write the CSV file
  csvWriter.writeRecords(csvRows).then(() => {
    console.log('CSV file was written successfully');
  });
};

module.exports = createCsv;