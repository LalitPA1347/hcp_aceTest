# Step 1: Build environment
FROM node:20.17.0-alpine AS build
 
# Set working directory
WORKDIR /app
 
# Copy package.json and package-lock.json
COPY package*.json ./
 
# Install dependencies
RUN npm install
 
# Copy the rest of the application code
COPY . .
 
# Build the React app
RUN npm run build
 
# Step 2: Production environment
FROM nginx:1.21.0-alpine
 
# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*
 
# Copy build output from build environment to nginx public directory
COPY --from=build /app/build /usr/share/nginx/html
 
# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
 
# Expose port 80
EXPOSE 3000
 
# Start nginx server
CMD ["nginx", "-g", "daemon off;"]