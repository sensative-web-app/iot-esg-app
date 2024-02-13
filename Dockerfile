# Use the official Node.js image with a specific version
FROM node:20.8.0-bullseye-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Set the user to non-root for security
USER node

# Expose the port the app runs on
EXPOSE ${NODE_PORT}

# Define the command to run the app
CMD ["npm", "start"]