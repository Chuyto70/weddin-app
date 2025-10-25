# Use the official Node.js 18 Alpine image as the base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Create the weddingPhotos directory and set permissions
RUN mkdir -p public/weddingPhotos && chmod 777 public/weddingPhotos

# Expose the port that the app will run on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3000

# Run as root for volume write access (simplified for this use case)

# Start the application
CMD ["npm", "run", "dev"]