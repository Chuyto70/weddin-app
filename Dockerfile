# Use the official Node.js 18 Alpine image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Create the weddingPhotos directory and set permissions
RUN mkdir -p public/weddingPhotos && chmod 755 public/weddingPhotos

# Build the Next.js application
RUN npm run build

# Expose the port that the app will run on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory and weddingPhotos to the nodejs user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Start the application
CMD ["npm", "start"]