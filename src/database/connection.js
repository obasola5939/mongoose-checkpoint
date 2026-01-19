// src/database/connection.js
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

/**
 * Database Connection Manager
 * Handles MongoDB connection using Mongoose with proper error handling
 */
class DatabaseConnection {
  constructor() {
    this.isConnected = false;
    this.connection = null;
  }

  /**
   * Establishes connection to MongoDB Atlas
   * Uses environment variable MONGO_URI for connection string
   * @returns {Promise<mongoose.Connection>} MongoDB connection instance
   */
  async connect() {
    try {
      // Validate that MONGO_URI is set in environment variables
      if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not defined in environment variables');
      }

      // Remove quotes if they exist in the URI (common .env issue)
      const mongoUri = process.env.MONGO_URI.replace(/['"]+/g, '');

      console.log('🔌 Connecting to MongoDB...');
      
      // Connection options for better performance and compatibility
      const connectionOptions = {
        useNewUrlParser: true,      // Use new URL string parser
        useUnifiedTopology: true,   // Use new server discovery and monitoring engine
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
        socketTimeoutMS: 45000,     // Close sockets after 45 seconds of inactivity
        family: 4,                  // Use IPv4, skip trying IPv6
        maxPoolSize: 10,            // Maintain up to 10 socket connections
        minPoolSize: 5              // Maintain at least 5 socket connections
      };

      // Establish connection
      await mongoose.connect(mongoUri, connectionOptions);
      
      this.connection = mongoose.connection;
      this.isConnected = true;

      // Set up event listeners for connection status
      this.setupEventListeners();

      console.log('✅ MongoDB connected successfully!');
      console.log(`📊 Database: ${this.connection.db.databaseName}`);
      console.log(`👤 Host: ${this.connection.host}`);
      
      return this.connection;
      
    } catch (error) {
      console.error('❌ MongoDB connection error:', error.message);
      process.exit(1); // Exit process with failure
    }
  }

  /**
   * Sets up event listeners for the database connection
   */
  setupEventListeners() {
    this.connection.on('connected', () => {
      console.log('📡 Mongoose connected to DB');
    });

    this.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err.message);
    });

    this.connection.on('disconnected', () => {
      console.log('🔌 Mongoose disconnected from DB');
      this.isConnected = false;
    });

    // Close the connection when Node process ends
    process.on('SIGINT', async () => {
      await this.connection.close();
      console.log('👋 Mongoose connection closed due to app termination');
      process.exit(0);
    });
  }

  /**
   * Closes the database connection
   * @returns {Promise<void>}
   */
  async disconnect() {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('🔌 MongoDB connection closed');
    }
  }

  /**
   * Returns the current connection status
   * @returns {boolean} Connection status
   */
  getStatus() {
    return this.isConnected;
  }

  /**
   * Returns the Mongoose connection instance
   * @returns {mongoose.Connection}
   */
  getConnection() {
    return this.connection;
  }
}

// Export a singleton instance
module.exports = new DatabaseConnection();
