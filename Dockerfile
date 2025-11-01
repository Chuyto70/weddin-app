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

# Create the uploads and weddingPhotos directories and set permissions
RUN mkdir -p uploads/weddingPhotos && chmod 777 uploads/weddingPhotos

# Expose the port that the app will run on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Build the application for production (force no cache)
RUN --mount=type=cache,target=/root/.npm \
    npm run build

# Create a volume for persistent photo storage
VOLUME ["/app/public/weddingPhotos"] 

# Run as root for volume write access (simplified for this use case)

# Start the application
CMD ["npm", "start"]