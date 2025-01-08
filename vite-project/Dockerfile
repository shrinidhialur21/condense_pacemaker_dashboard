# Build stage
FROM node:18-alpine as build
 
# Set working directory
WORKDIR /app
 
# Copy package files (ensure these files exist in the build context)
COPY package.json package-lock.json ./
 
# Install dependencies
RUN npm ci
 
# Copy all project files (use a .dockerignore to exclude unnecessary files)
COPY . .
 
# Build the app
RUN npm run build
 
# Serve stage
FROM node:18-alpine
 
# Set working directory
WORKDIR /app
 
# Copy only the built files from the build stage
COPY --from=build /app/dist ./dist
 
# Install serve globally
RUN npm install -g serve
 
# Expose port 4173 (default Vite preview port)
EXPOSE 4173
 
# Serve the app
CMD ["serve", "-s", "dist", "-l", "4173"]