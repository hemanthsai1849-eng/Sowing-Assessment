FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY frontend/ .

# Build for production
RUN npm run build

# Expose port
EXPOSE 3000

# Development server
CMD ["npm", "run", "dev"]
