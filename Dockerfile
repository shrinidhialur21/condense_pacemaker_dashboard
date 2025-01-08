# Build stage
FROM node:18-alpine as build
 
# Set working directory
WORKDIR /app
 
# Copy package files
COPY package.json package-lock.json ./
 
# Install dependencies
RUN npm ci
 
# Copy project files
COPY . .
 
# Build the app
RUN npm run build
 
# Install serve globally
RUN npm install -g serve
 
# Expose port 4173 (default Vite preview port)
EXPOSE 4173
 
# Start the app using Vite preview
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]