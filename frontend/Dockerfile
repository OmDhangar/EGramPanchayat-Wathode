# Use a lightweight Node.js image for building the frontend
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application code
COPY . .

# Build the frontend
RUN npm run build

# Use a lightweight web server for serving the frontend
FROM nginx:alpine

# Copy built files to the web server
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the port Nginx listens on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]