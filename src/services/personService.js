// src/services/personService.js
const Person = require('../models/Person');

/**
 * Person Service
 * Contains all CRUD operations for Person model
 * Implements best practices for database operations
 */
class PersonService {
  
  /**
   * CREATE OPERATIONS
   */

  /**
   * 1. Create and Save a Single Person Record
   * Creates a document instance and saves it to the database
   * @param {Object} personData - Person data object
   * @param {String} personData.name - Person's name (required)
   * @param {Number} personData.age - Person's age (optional)
   * @param {Array<String>} personData.favoriteFoods - Favorite foods (optional)
   * @returns {Promise<Object>} Created person document
   */
  async createAndSavePerson(personData) {
    try {
      // Validate required fields
      if (!personData.name) {
        throw new Error('Name is required to create a person');
      }

      console.log('📝 Creating new person...');
      
      // Create a new Person document instance
      const person = new Person({
        name: personData.name,
        age: personData.age || null,
        favoriteFoods: personData.favoriteFoods || [],
        email: personData.email || null,
        isActive: personData.isActive !== undefined ? personData.isActive : true
      });

      // Save the document to the database
      // Using callback-style save as per instructions
      return new Promise((resolve, reject) => {
        person.save(function(err, savedPerson) {
          if (err) {
            console.error('❌ Error saving person:', err.message);
            reject(err);
          } else {
            console.log(`✅ Person created successfully: ${savedPerson.name}`);
            resolve(savedPerson);
          }
        });
      });
      
    } catch (error) {
      console.error('❌ Error in createAndSavePerson:', error.message);
      throw error;
    }
  }

  /**
   * 2. Create Multiple People Records
   * Creates multiple person documents in a single operation
   * @param {Array<Object>} arrayOfPeople - Array of person objects
   * @returns {Promise<Array<Object>>} Array of created person documents
   */
  async createManyPeople(arrayOfPeople) {
    try {
      // Validate input
      if (!Array.isArray(arrayOfPeople) || arrayOfPeople.length === 0) {
        throw new Error('arrayOfPeople must be a non-empty array');
      }

      console.log(`📝 Creating ${arrayOfPeople.length} people...`);

      // Create multiple people using Model.create()
      // Model.create() accepts an array of objects and saves them all
      return new Promise((resolve, reject) => {
        Person.create(arrayOfPeople, function(err, createdPeople) {
          if (err) {
            console.error('❌ Error creating multiple people:', err.message);
            reject(err);
          } else {
            console.log(`✅ Successfully created ${createdPeople.length} people`);
            resolve(createdPeople);
          }
        });
      });

    } catch (error) {
      console.error('❌ Error in createManyPeople:', error.message);
      throw error;
    }
  }

  /**
   * READ OPERATIONS
   */

  /**
   * 3. Find All People with a Given Name
   * Searches for all people with a specific name
   * @param {String} name - Name to search for
   * @returns {Promise<Array<Object>>} Array of matching person documents
   */
  async findPeopleByName(name) {
    try {
      if (!name || typeof name !== 'string') {
        throw new Error('Valid name string is required');
      }

      console.log(`🔍 Searching for people named: "${name}"`);

      // Model.find() returns all documents matching the query
      // Returns an array of documents (empty array if no matches)
      return new Promise((resolve, reject) => {
        Person.find({ name: name }, function(err, people) {
          if (err) {
            console.error('❌ Error finding people by name:', err.message);
            reject(err);
          } else {
            console.log(`✅ Found ${people.length} person(s) named "${name}"`);
            resolve(people);
          }
        });
      });

    } catch (error) {
      console.error('❌ Error in findPeopleByName:', error.message);
      throw error;
    }
  }

  /**
   * 4. Find One Person by Favorite Food
   * Finds a single person who has a specific food in their favorites
   * @param {String} food - Food to search for in favoriteFoods
   * @returns {Promise<Object|null>} Single person document or null
   */
  async findOneByFood(food) {
    try {
      if (!food || typeof food !== 'string') {
        throw new Error('Valid food string is required');
      }

      console.log(`🔍 Searching for person who likes: "${food}"`);

      // Model.findOne() returns the first document matching the query
      // Returns null if no document matches
      return new Promise((resolve, reject) => {
        Person.findOne({ favoriteFoods: food }, function(err, person) {
          if (err) {
            console.error('❌ Error finding person by food:', err.message);
            reject(err);
          } else {
            if (person) {
              console.log(`✅ Found person: ${person.name}`);
            } else {
              console.log(`❌ No person found who likes "${food}"`);
            }
            resolve(person);
          }
        });
      });

    } catch (error) {
      console.error('❌ Error in findOneByFood:', error.message);
      throw error;
    }
  }

  /**
   * 5. Find Person by ID
   * Finds a single person by their MongoDB _id
   * @param {String} personId - MongoDB ObjectId string
   * @returns {Promise<Object|null>} Person document or null
   */
  async findPersonById(personId) {
    try {
      if (!personId) {
        throw new Error('personId is required');
      }

      console.log(`🔍 Searching for person with ID: "${personId}"`);

      // Model.findById() is a shortcut for findOne({ _id: id })
      // More efficient for searching by ID
      return new Promise((resolve, reject) => {
        Person.findById(personId, function(err, person) {
          if (err) {
            console.error('❌ Error finding person by ID:', err.message);
            reject(err);
          } else {
            if (person) {
              console.log(`✅ Found person: ${person.name}`);
            } else {
              console.log(`❌ No person found with ID "${personId}"`);
            }
            resolve(person);
          }
        });
      });

    } catch (error) {
      console.error('❌ Error in findPersonById:', error.message);
      throw error;
    }
  }

  /**
   * UPDATE OPERATIONS
   */

  /**
   * 6. Classic Update: Find, Edit, then Save
   * Finds a person by ID, modifies them, and saves the changes
   * @param {String} personId - Person's MongoDB ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated person document
   */
  async updatePersonClassic(personId, updates) {
    try {
      if (!personId) {
        throw new Error('personId is required');
      }

      console.log(`✏️ Classic update for person ID: "${personId}"`);

      // Step 1: Find the person by ID
      return new Promise((resolve, reject) => {
        Person.findById(personId, async function(err, person) {
          if (err) {
            console.error('❌ Error finding person for update:', err.message);
            reject(err);
          } else if (!person) {
            reject(new Error(`Person with ID "${personId}" not found`));
          } else {
            try {
              // Step 2: Apply updates to the document
              if (updates.name) person.name = updates.name;
              if (updates.age !== undefined) person.age = updates.age;
              if (updates.email !== undefined) person.email = updates.email;
              if (updates.isActive !== undefined) person.isActive = updates.isActive;
              
              // Special handling for favoriteFoods array
              if (updates.addToFavorites && Array.isArray(updates.addToFavorites)) {
                updates.addToFavorites.forEach(food => {
                  if (!person.favoriteFoods.includes(food)) {
                    person.favoriteFoods.push(food);
                  }
                });
                // Mark the array as modified for Mongoose to track changes
                person.markModified('favoriteFoods');
              }

              // Step 3: Save the updated document
              person.save(function(saveErr, updatedPerson) {
                if (saveErr) {
                  console.error('❌ Error saving updated person:', saveErr.message);
                  reject(saveErr);
                } else {
                  console.log(`✅ Person updated: ${updatedPerson.name}`);
                  resolve(updatedPerson);
                }
              });

            } catch (updateErr) {
              console.error('❌ Error during update:', updateErr.message);
              reject(updateErr);
            }
          }
        });
      });

    } catch (error) {
      console.error('❌ Error in updatePersonClassic:', error.message);
      throw error;
    }
  }

  /**
   * 7. Add "hamburger" to Favorite Foods (Specific Requirement)
   * Finds a person by ID and adds "hamburger" to their favorite foods
   * @param {String} personId - Person's MongoDB ID
   * @returns {Promise<Object>} Updated person document
   */
  async addHamburgerToFavorites(personId) {
    return this.updatePersonClassic(personId, {
      addToFavorites: ['hamburger']
    });
  }

  /**
   * 8. Modern Update: Find One and Update
   * Finds a person by name and updates their age in a single operation
   * @param {String} personName - Name of the person to update
   * @param {Number} newAge - New age value
   * @returns {Promise<Object>} Updated person document
   */
  async findOneAndUpdateAge(personName, newAge = 20) {
    try {
      if (!personName) {
        throw new Error('personName is required');
      }

      console.log(`✏️ Setting age of "${personName}" to ${newAge}`);

      // Model.findOneAndUpdate() finds and updates in a single operation
      // { new: true } returns the updated document instead of the original
      // { runValidators: true } ensures update respects schema validation
      const updateOptions = {
        new: true, // Return the modified document
        runValidators: true, // Run schema validators on update
        context: 'query' // Required for some validators to work
      };

      return new Promise((resolve, reject) => {
        Person.findOneAndUpdate(
          { name: personName }, // Search criteria
          { age: newAge }, // Update operation
          updateOptions, // Options
          function(err, updatedPerson) {
            if (err) {
              console.error('❌ Error in findOneAndUpdate:', err.message);
              reject(err);
            } else if (!updatedPerson) {
              console.log(`❌ No person found named "${personName}"`);
              resolve(null);
            } else {
              console.log(`✅ Updated ${updatedPerson.name}'s age to ${updatedPerson.age}`);
              resolve(updatedPerson);
            }
          }
        );
      });

    } catch (error) {
      console.error('❌ Error in findOneAndUpdateAge:', error.message);
      throw error;
    }
  }

  /**
   * DELETE OPERATIONS
   */

  /**
   * 9. Delete One Person by ID
   * Finds and removes a single person by their ID
   * @param {String} personId - Person's MongoDB ID
   * @returns {Promise<Object>} The removed person document
   */
  async deletePersonById(personId) {
    try {
      if (!personId) {
        throw new Error('personId is required');
      }

      console.log(`🗑️ Deleting person with ID: "${personId}"`);

      // Model.findByIdAndRemove() finds by ID and removes in one operation
      return new Promise((resolve, reject) => {
        Person.findByIdAndRemove(personId, function(err, removedPerson) {
          if (err) {
            console.error('❌ Error deleting person:', err.message);
            reject(err);
          } else if (!removedPerson) {
            console.log(`❌ No person found with ID "${personId}"`);
            resolve(null);
          } else {
            console.log(`✅ Deleted person: ${removedPerson.name}`);
            resolve(removedPerson);
          }
        });
      });

    } catch (error) {
      console.error('❌ Error in deletePersonById:', error.message);
      throw error;
    }
  }

  /**
   * 10. Delete Many People by Name
   * Removes all people with a specific name
   * Note: Model.remove() is deprecated, using deleteMany() instead
   * @param {String} name - Name of people to delete
   * @returns {Promise<Object>} Operation result object
   */
  async deleteManyByName(name) {
    try {
      if (!name) {
        throw new Error('Name is required for deletion');
      }

      console.log(`🗑️ Deleting all people named: "${name}"`);

      // Model.deleteMany() removes all documents matching the criteria
      // Returns an object with deletion statistics
      return new Promise((resolve, reject) => {
        Person.deleteMany({ name: name }, function(err, result) {
          if (err) {
            console.error('❌ Error deleting people:', err.message);
            reject(err);
          } else {
            console.log(`✅ Deleted ${result.deletedCount} person(s) named "${name}"`);
            resolve(result);
          }
        });
      });

    } catch (error) {
      console.error('❌ Error in deleteManyByName:', error.message);
      throw error;
    }
  }

  /**
   * 11. Advanced Query: Chain Search Query Helpers
   * Finds people who like burritos with chained query helpers
   * @param {String} food - Food to search for (default: "burrito")
   * @returns {Promise<Array<Object>>} Array of matching person documents
   */
  async findBurritoLovers(food = "burrito") {
    try {
      console.log(`🔍 Searching for people who like "${food}"...`);

      return new Promise((resolve, reject) => {
        // Chain query helpers for complex queries
        Person.find({ favoriteFoods: food }) // Find people who like the specified food
          .sort({ name: 1 })                 // Sort by name ascending
          .limit(2)                          // Limit results to 2 documents
          .select('-age')                    // Exclude age field from results
          .select('name favoriteFoods')      // Include only name and favoriteFoods
          .exec(function(err, people) {      // Execute the query
            if (err) {
              console.error('❌ Error in chained query:', err.message);
              reject(err);
            } else {
              console.log(`✅ Found ${people.length} person(s) who like "${food}"`);
              resolve(people);
            }
          });
      });

    } catch (error) {
      console.error('❌ Error in findBurritoLovers:', error.message);
      throw error;
    }
  }

  /**
   * UTILITY METHODS
   */

  /**
   * Get All People
   * Retrieves all person documents from the database
   * @returns {Promise<Array<Object>>} All person documents
   */
  async getAllPeople() {
    try {
      console.log('📋 Retrieving all people...');
      
      return new Promise((resolve, reject) => {
        Person.find({}, function(err, people) {
          if (err) {
            console.error('❌ Error getting all people:', err.message);
            reject(err);
          } else {
            console.log(`✅ Retrieved ${people.length} person(s)`);
            resolve(people);
          }
        });
      });

    } catch (error) {
      console.error('❌ Error in getAllPeople:', error.message);
      throw error;
    }
  }

  /**
   * Get Database Statistics
   * Returns statistics about the Person collection
   * @returns {Promise<Object>} Collection statistics
   */
  async getStats() {
    try {
      const totalCount = await Person.countDocuments();
      const activeCount = await Person.countDocuments({ isActive: true });
      const averageAge = await Person.aggregate([
        { $match: { age: { $ne: null } } },
        { $group: { _id: null, avgAge: { $avg: "$age" } } }
      ]);

      return {
        totalPeople: totalCount,
        activePeople: activeCount,
        averageAge: averageAge[0]?.avgAge || 0
      };
    } catch (error) {
      console.error('❌ Error getting stats:', error.message);
      throw error;
    }
  }
}

// Export service instance
module.exports = new PersonService();
