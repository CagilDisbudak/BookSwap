FROM node:16-alpine

# Set work directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy project files
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 