# Memories

<img src="public/assets/logo.svg" alt="Logo" />

Memories is an Instagram-like web application where users can upload, view, and share their memories. The app is built using Next.js with React, server-actions, Prisma ORM for database management, Google Cloud Storage for file uploads, and Clerk for user authentication. It leverages React Suspense for data fetching and caching static data through Next.js pre-rendering techniques to ensure a fast and seamless user experience.

## Features

- **User Authentication**: Users can sign up, log in, and manage their accounts using Clerk.
- **Memory Uploads**: Users can upload images along with titles, descriptions, locations, and dates.
- **Image Storage**: Uploaded images are stored in a Google Cloud Storage bucket.
- **React Suspense**: Used for efficient data fetching and improved loading states.
- **Static Data Caching**: Pre-rendering techniques are utilized to cache static data for optimal performance.
- **Server Actions**: Server-side logic for handling database operations and storage integration using Prisma ORM.
- **Responsive Design**: The app is fully responsive and optimized for mobile devices.

## Technologies Used

- **Next.js**: A React framework for server-rendered and statically generated pages.
- **React**: Frontend framework for building user interfaces.
- **Server Actions**: For handling server-side logic in Next.js without requiring APIs.
- **Prisma ORM**: Used for modeling and querying the database with a schema-based approach.
- **Google Cloud Storage**: Stores uploaded images securely.
- **Clerk**: Provides user authentication and session management.
- **React Suspense**: Handles asynchronous data fetching in React components.
- **Pre-rendering and Caching**: Ensures fast load times by caching static data during the build process.

## Getting Started

### Prerequisites

Make sure you have the following tools installed:

- Node.js (version 14 or higher)
- npm or yarn
- A Google Cloud account with a storage bucket set up
- A Prisma database (PostgreSQL/MySQL/SQLite)
- A Clerk account for authentication

### Installation

1. **Clone the Repository:**

   ```
   git clone https://github.com/your-username/memories.git
   cd memories
   ```

2. **Install Dependencies:**

   Using npm:

   ```
   npm install
   ```

   Or with yarn:

   ```
   yarn install
   ```

3. **Set Up Environment Variables:**

   Create a `.env` file in the root of your project and add the following variables:

   ```
   # Database connection (Prisma)
   DATABASE_URL="your-database-url"

   # Google Cloud Storage
   <!-- GCLOUD_PROJECT_ID="your-google-cloud-project-id"
   GCLOUD_BUCKET_NAME="your-storage-bucket-name"
   GCLOUD_KEY="your-service-account-key-json" -->

   # Clerk
   NEXT_PUBLIC_CLERK_FRONTEND_API="your-clerk-frontend-api"
   CLERK_API_KEY="your-clerk-api-key"
   ```

4. **Set Up Prisma:**

   Run the following command to generate Prisma client:

   ```
   npx prisma generate
   ```

   Then, run the database migrations:

   ```
   npx prisma migrate dev
   ```

5. **Run the Development Server:**

   Start the server in development mode:

   ```
   npm run dev
   ```

   Or with yarn:

   ```
   yarn dev
   ```

   The app should be running at [http://localhost:3000](http://localhost:3000).

### Deployment

To deploy the app to production, follow the platform-specific instructions for deploying Next.js apps (e.g., Vercel, Netlify, or your preferred hosting provider). Ensure you have set up the necessary environment variables for your production environment.

## File Structure

```
├── prisma/                 # Prisma schema and migration files
├── public/                 # Public static files
├── src/
│   ├── app/                # Next.js pages
│   ├── components/         # React components
│   ├── lib/                # Storage bucket implementations
│   ├── prisma/             # Migration and Schema files
│   └── public/             # Assets, etc..
├── .env                    # Environment variables
├── middleware.ts           # Clerk flow configuration middleware
├── tailwind.config.ts      # Define custom styles
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation
```

## Contributing

Contributions are welcome! Please fork the repository, create a new branch, and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
