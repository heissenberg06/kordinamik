require('dotenv').config();
const { sequelize, initModels } = require('../config/db');

async function createCategories() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    const { Category } = initModels();
    if (!Category) {
      console.error('Category model not found');
      return;
    }
    
    // Define the categories we want to create
    const categories = [
      { id: 1, name: 'Kazanlar', description: 'Yüksek verimli katı yakıtlı kalorifer kazanları' },
      { id: 2, name: 'Kuzineler', description: 'Isıtma ve pişirme amaçlı kuzine sobalar' },
      { id: 3, name: 'Pellet Sistemler', description: 'Otomatik beslemeli pellet yakıtlı sistemler' }
    ];
    
    // Create each category
    for (const category of categories) {
      const [cat, created] = await Category.findOrCreate({
        where: { id: category.id },
        defaults: category
      });
      
      if (created) {
        console.log(`Created category: ${category.name}`);
      } else {
        console.log(`Category already exists: ${category.name}`);
      }
    }
    
    console.log('Categories created successfully!');
  } catch (error) {
    console.error('Error creating categories:', error);
  } finally {
    await sequelize.close();
  }
}

createCategories();
