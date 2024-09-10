const { db } = require('@vercel/postgres');

async function createUsersTable(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `;

    console.log(`Created "users" table`);
  } catch (error) {
    console.error('Error while creating users table:', error);
    throw error;
  }
}

async function createExpensesSummaryTable(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "expenses_summary" table if doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS expenses_summary (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID NOT NULL,
        total_amount NUMERIC(200, 2) NOT NULL
      );
    `;

    console.log(`Created "expenses_summary" table`);
  } catch (error) {
    console.error('Error while creating expenses_summary table:', error);
    throw error;
  }
}

async function createExpensesTable(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "expenses" table if doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS expenses (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID NOT NULL,
        name TEXT NOT NULL,
        amount NUMERIC(100, 2) NOT NULL,
        expense_type TEXT NOT NULL,
        payment_type TEXT NOT NULL,
        payment_duration INT,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE,
      );
    `;

    console.log(`Created "expenses" table`);
  } catch (error) {
    console.error('Error while creating expenses table:', error);
    throw error;
  }
}

async function createSubscriptionsTable(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "subscriptions" table if doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID NOT NULL,
        name TEXT NOT NULL,
        amount NUMERIC(100, 2) NOT NULL,
        expense_type TEXT NOT NULL,
        payment_type TEXT NOT NULL,
        payment_duration INT NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE
      );
    `;

    console.log(`Created "expenses" table`);
  } catch (error) {
    console.error('Error while creating expenses table:', error);
    throw error;
  }
}

async function createBudgetLimitTable(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "budget limit" table if doesn't exist
    const createTable = await client.sql`
       CREATE TABLE IF NOT EXISTS budget (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         user_id UUID NOT NULL,
         budget_limit NUMERIC(200, 2) NOT NULL,
         first_limit NUMERIC(200, 2) NOT NULL,
         created_at TIMESTAMP WITH TIME ZONE NOT NULL,
         updated_at TIMESTAMP WITH TIME ZONE
       );
     `;

    console.log(`Created "budget limit" table`);
  } catch (error) {
    console.error('Error while creating budget table:', error);
    throw error;
  }
}

async function initDatabase() {
  const client = await db.connect();
  await createUsersTable(client);
  await createExpensesTable(client);
  await createSubscriptionsTable(client);
  await createExpensesSummaryTable(client);
  await createBudgetLimitTable(client);

  await client.end();
}

initDatabase().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err
  );
});
