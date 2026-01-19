// src/models/Person.js
const mongoose = require('mongoose');

/**
 * Person Schema Definition
 * Defines the structure and validation rules for Person documents
 */
const personSchema = new mongoose.Schema({
  /**
   * Person's full name - Required field
   * @type {String}
   */
  name: {
    type: String,
    required: [true, 'Name is required'], // Custom error message
    trim: true, // Remove whitespace from both ends
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
    // Custom validator to ensure name is not just whitespace
    validate: {
      validator: function(v) {
        return /^[a-zA-Z\s]{2,100}$/.test(v);
      },
      message: props => `${props.value} is not a valid name!`
    }
  },

  /**
   * Person's age - Optional field with constraints
   * @type {Number}
   */
  age: {
    type: Number,
    min: [0, 'Age cannot be negative'], // Minimum age constraint
    max: [120, 'Age cannot exceed 120 years'], // Reasonable maximum age
    default: null // Default value if not provided
  },

  /**
   * Array of favorite foods - Optional field
   * @type {Array<String>}
   */
  favoriteFoods: {
    type: [{
      type: String,
      trim: true,
      minlength: [2, 'Food name must be at least 2 characters'],
      maxlength: [50, 'Food name cannot exceed 50 characters']
    }],
    default: [], // Default to empty array
    // Custom validator for array length
    validate: {
      validator: function(array) {
        return array.length <= 20; // Limit to 20 favorite foods
      },
      message: 'Cannot have more than 20 favorite foods'
    }
  },

  /**
   * Person's email - Optional unique field
   * @type {String}
   */
  email: {
    type: String,
    unique: true, // Ensures no duplicate emails
    sparse: true, // Allows null values while maintaining uniqueness for non-null values
    lowercase: true, // Store emails in lowercase
    trim: true,
    // Email format validation
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 
            'Please enter a valid email address']
  },

  /**
   * Date when the person record was created
   * @type {Date}
   */
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to current date
    immutable: true // Cannot be modified after creation
  },

  /**
   * Date when the person record was last updated
   * @type {Date}
   */
  updatedAt: {
    type: Date,
    default: Date.now // Automatically set to current date
  },

  /**
   * Indicates if the person is active
   * @type {Boolean}
   */
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  // Schema options
  timestamps: true, // Automatically manage createdAt and updatedAt
  versionKey: false, // Disable __v field
  toJSON: { virtuals: true }, // Include virtuals in JSON output
  toObject: { virtuals: true } // Include virtuals in Object output
});

/**
 * Virtual property: Full name with age
 * Not stored in the database, calculated on the fly
 */
personSchema.virtual('fullNameWithAge').get(function() {
  return `${this.name} (${this.age || 'Age not specified'})`;
});

/**
 * Instance method: Add a favorite food
 * @param {String} food - Food to add to favorites
 * @returns {Promise<Person>} Updated person document
 */
personSchema.methods.addFavoriteFood = function(food) {
  if (!this.favoriteFoods.includes(food)) {
    this.favoriteFoods.push(food);
    return this.save();
  }
  return Promise.resolve(this);
};

/**
 * Instance method: Remove a favorite food
 * @param {String} food - Food to remove from favorites
 * @returns {Promise<Person>} Updated person document
 */
personSchema.methods.removeFavoriteFood = function(food) {
  const index = this.favoriteFoods.indexOf(food);
  if (index > -1) {
    this.favoriteFoods.splice(index, 1);
    return this.save();
  }
  return Promise.resolve(this);
};

/**
 * Static method: Find active people
 * @returns {Promise<Array<Person>>} Array of active people
 */
personSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

/**
 * Static method: Find people by age range
 * @param {Number} minAge - Minimum age
 * @param {Number} maxAge - Maximum age
 * @returns {Promise<Array<Person>>} Array of people within age range
 */
personSchema.statics.findByAgeRange = function(minAge, maxAge) {
  return this.find({ 
    age: { 
      $gte: minAge, 
      $lte: maxAge 
    } 
  });
};

/**
 * Middleware: Runs before saving a document
 * Updates the updatedAt timestamp
 */
personSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

/**
 * Middleware: Runs after saving a document
 * Logs successful save operation
 */
personSchema.post('save', function(doc) {
  console.log(`✅ Person saved: ${doc.name} (ID: ${doc._id})`);
});

/**
 * Middleware: Runs before removing a document
 * Can be used for cleanup operations
 */
personSchema.pre('remove', function(next) {
  console.log(`🗑️ Removing person: ${this.name}`);
  next();
});

// Create and export the Person model
const Person = mongoose.model('Person', personSchema);

module.exports = Person;
