// src/index.js
const database = require('./database/connection');
const personService = require('./services/personService');

/**
 * Main Application
 * Demonstrates all Mongoose CRUD operations
 */
async function main() {
  try {
    console.log('🚀 Starting Mongoose CRUD Application');
    console.log('='.repeat(50));

    // 1. Connect to MongoDB
    await database.connect();
    
    // 2. Demonstrate CRUD Operations
    await demonstrateAllOperations();

    console.log('='.repeat(50));
    console.log('✅ All operations completed successfully!');

    // Optional: Keep server running or exit
    // process.exit(0);

  } catch (error) {
    console.error('❌ Application error:', error.message);
    process.exit(1);
  }
}

/**
 * Demonstrates all required CRUD operations
 */
async function demonstrateAllOperations() {
  console.log('\n📚 DEMONSTRATING ALL CRUD OPERATIONS');
  console.log('-'.repeat(40));

  // Operation 1: Create and Save a Single Person
  console.log('\n1. 📝 CREATE AND SAVE A SINGLE PERSON');
  const person1 = await personService.createAndSavePerson({
    name: 'John Doe',
    age: 30,
    favoriteFoods: ['pizza', 'pasta'],
    email: 'john@example.com'
  });
  console.log(`   Created: ${person1.name} (ID: ${person1._id})`);

  // Operation 2: Create Multiple People
  console.log('\n2. 📝 CREATE MULTIPLE PEOPLE');
  const people = await personService.createManyPeople([
    {
      name: 'Jane Smith',
      age: 25,
      favoriteFoods: ['sushi', 'salad'],
      email: 'jane@example.com'
    },
    {
      name: 'Bob Johnson',
      age: 35,
      favoriteFoods: ['burger', 'fries', 'burrito'],
      email: 'bob@example.com'
    },
    {
      name: 'Alice Brown',
      age: 28,
      favoriteFoods: ['tacos', 'burrito', 'nachos'],
      email: 'alice@example.com'
    },
    {
      name: 'Mary Wilson',
      age: 40,
      favoriteFoods: ['steak', 'potatoes'],
      email: 'mary@example.com'
    },
    {
      name: 'Mary Johnson', // Second Mary for deleteMany demonstration
      age: 32,
      favoriteFoods: ['salad', 'yogurt']
    }
  ]);
  console.log(`   Created ${people.length} people`);

  // Operation 3: Find People by Name
  console.log('\n3. 🔍 FIND PEOPLE BY NAME');
  const johns = await personService.findPeopleByName('John Doe');
  console.log(`   Found ${johns.length} person(s) named "John Doe"`);

  // Operation 4: Find One by Favorite Food
  console.log('\n4. 🔍 FIND ONE BY FAVORITE FOOD');
  const pizzaLover = await personService.findOneByFood('pizza');
  if (pizzaLover) {
    console.log(`   Pizza lover found: ${pizzaLover.name}`);
  }

  // Operation 5: Find Person by ID
  console.log('\n5. 🔍 FIND PERSON BY ID');
  const foundPerson = await personService.findPersonById(person1._id);
  if (foundPerson) {
    console.log(`   Found by ID: ${foundPerson.name}`);
  }

  // Operation 6 & 7: Add Hamburger to Favorites (Classic Update)
  console.log('\n6. ✏️ CLASSIC UPDATE: ADD HAMBURGER TO FAVORITES');
  const updatedPerson = await personService.addHamburgerToFavorites(person1._id);
  if (updatedPerson) {
    console.log(`   Updated favorites: ${updatedPerson.favoriteFoods.join(', ')}`);
  }

  // Operation 8: Find One and Update Age
  console.log('\n7. ✏️ FIND ONE AND UPDATE AGE');
  const agedPerson = await personService.findOneAndUpdateAge('Jane Smith', 26);
  if (agedPerson) {
    console.log(`   Updated ${agedPerson.name}'s age to ${agedPerson.age}`);
  }

  // Operation 9: Delete One by ID
  console.log('\n8. 🗑️ DELETE ONE BY ID');
  // First create a person to delete
  const tempPerson = await personService.createAndSavePerson({
    name: 'Temp Person',
    age: 99,
    favoriteFoods: ['test food']
  });
  const deleted = await personService.deletePersonById(tempPerson._id);
  if (deleted) {
    console.log(`   Deleted: ${deleted.name}`);
  }

  // Operation 10: Delete Many by Name
  console.log('\n9. 🗑️ DELETE MANY BY NAME');
  const deleteResult = await personService.deleteManyByName('Mary');
  console.log(`   Deleted ${deleteResult.deletedCount} person(s) named "Mary"`);

  // Operation 11: Chain Search Query Helpers
  console.log('\n10. 🔗 CHAINED QUERY: FIND BURRITO LOVERS');
  const burritoLovers = await personService.findBurritoLovers();
  console.log(`   Found ${burritoLovers.length} burrito lover(s)`);
  burritoLovers.forEach((person, index) => {
    console.log(`   ${index + 1}. ${person.name} likes: ${person.favoriteFoods.join(', ')}`);
  });

  // Bonus: Get Statistics
  console.log('\n📊 DATABASE STATISTICS');
  const stats = await personService.getStats();
  console.log(`   Total People: ${stats.totalPeople}`);
  console.log(`   Active People: ${stats.activePeople}`);
  console.log(`   Average Age: ${stats.averageAge.toFixed(1)}`);

  // Final: Show all remaining people
  console.log('\n👥 ALL REMAINING PEOPLE');
  const allPeople = await personService.getAllPeople();
  allPeople.forEach((person, index) => {
    console.log(`   ${index + 1}. ${person.name}, Age: ${person.age || 'N/A'}, Foods: ${person.favoriteFoods.join(', ') || 'None'}`);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Run the application
if (require.main === module) {
  main();
}

module.exports = {
  main,
  demonstrateAllOperations
};
