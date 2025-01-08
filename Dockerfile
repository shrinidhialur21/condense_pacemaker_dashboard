# # Use the official Node.js image for the build stage
FROM node:18-alpine as build

# Set the working directory
WORKDIR /app

# Copy package files (ensure these files exist in the build context)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the application for production
RUN npm run build

# Use a lightweight image for the production stage
FROM nginx:alpine as production

# Set working directory in the container
WORKDIR /usr/share/nginx/html

# Copy the built application files from the build stage
COPY --from=build /app/dist .

# Expose port 80
EXPOSE 80

# Default command to serve the app with Nginx
CMD ["nginx", "-g", "daemon off;"]
