const { Sequelize } = require('sequelize');

async function addTechnicalDetailsColumns() {
  const sequelize = new Sequelize(
    'kordinamik_admin',
    'postgres',
    '123456528',
    {
      host: 'localhost',
      port: 5432,
      dialect: 'postgres',
      logging: console.log
    }
  );

  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connected successfully.');

    // Check if columns already exist
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      AND column_name IN ('technical_details_image', 'technical_details_image_type')
    `);

    if (results.length === 0) {
      console.log('Adding technical_details_image and technical_details_image_type columns...');
      
      await sequelize.query(`
        ALTER TABLE products 
        ADD COLUMN technical_details_image BYTEA,
        ADD COLUMN technical_details_image_type VARCHAR(50)
      `);
      
      console.log('Columns added successfully!');
    } else {
      console.log('Columns already exist, skipping migration.');
    }

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

// Run the migration
if (require.main === module) {
  addTechnicalDetailsColumns()
    .then(() => {
      console.log('Migration completed.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = addTechnicalDetailsColumns;
