# Use the official Node.js 14 image as the base image
FROM --platform=linux/amd64 node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the project files to the working directory
COPY . .

# Build the Svelte Kit project
RUN npm run build

# Expose the port that the Svelte Kit app will run on
EXPOSE 4173

# Start the Svelte Kit app
CMD ["npx", "vite", "preview", "--host"]