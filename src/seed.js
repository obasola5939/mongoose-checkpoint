// src/seed.js
/**
 * Seed Database Script
 * Populates the database with initial test data
 */
const database = require('./database/connection');
const Person = require('./models/Person');

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with initial data...');
    
    // Connect to database
    await database.connect();
    
    // Clear existing data
    await Person.deleteMany({});
    console.log('🗑️  Cleared existing data');
    
    // Sample data array
    const samplePeople = [
      {
        name: 'John Smith',
        age: 28,
        favoriteFoods: ['pizza', 'burgers', 'pasta'],
        email: 'john.smith@example.com',
        isActive: true
      },
      {
        name: 'Emma Johnson',
        age: 32,
        favoriteFoods: ['sushi', 'salad', 'burrito'],
        email: 'emma.johnson@example.com',
        isActive: true
      },
      {
        name: 'Michael Brown',
        age: 45,
        favoriteFoods: ['steak', 'potatoes', 'burrito'],
        email: 'michael.brown@example.com',
        isActive: true
      },
      {
        name: 'Sarah Davis',
        age: 22,
        favoriteFoods: ['tacos', 'ice cream', 'pizza'],
        email: 'sarah.davis@example.com',
        isActive: true
      },
      {
        name: 'Robert Wilson',
        age: 38,
        favoriteFoods: ['chicken', 'rice', 'vegetables'],
        email: 'robert.wilson@example.com',
        isActive: false
      },
      {
        name: 'Mary Thompson',
        age: 29,
        favoriteFoods: ['pasta', 'wine', 'cheese'],
        email: 'mary.thompson@example.com',
        isActive: true
      },
      {
        name: 'David Miller',
        age: 51,
        favoriteFoods: ['seafood', 'soup', 'bread'],
        email: 'david.miller@example.com',
        isActive: true
      },
      {
        name: 'Lisa Anderson',
        age: 26,
        favoriteFoods: ['burrito', 'nachos', 'guacamole'],
        email: 'lisa.anderson@example.com',
        isActive: true
      },
      {
        name: 'James Taylor',
        age: 33,
        favoriteFoods: ['bbq', 'corn', 'beans'],
        email: 'james.taylor@example.com',
        isActive: true
      },
      {
        name: 'Mary Johnson',
        age: 41,
        favoriteFoods: ['soup', 'sandwich', 'fruit'],
        email: 'mary.johnson@example.com',
        isActive: true
      }
    ];
    
    // Insert sample data
    const result = await Person.create(samplePeople);
    console.log(`✅ Seeded database with ${result.length} sample people`);
    
    // Show sample query results
    console.log('\n📊 Sample Queries:');
    
    // Find all people
    const allPeople = await Person.find({});
    console.log(`   Total people in DB: ${allPeople.length}`);
    
    // Find active people
    const activePeople = await Person.findActive();
    console.log(`   Active people: ${activePeople.length}`);
    
    // Find by age range
    const youngPeople = await Person.findByAgeRange(20, 30);
    console.log(`   People aged 20-30: ${youngPeople.length}`);
    
    // Find burrito lovers
    const burritoLovers = await Person.find({ favoriteFoods: 'burrito' });
    console.log(`   Burrito lovers: ${burritoLovers.length}`);
    
    console.log('\n🎉 Database seeded successfully!');
    
    // Disconnect from database
    await database.disconnect();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed function
seedDatabase();
