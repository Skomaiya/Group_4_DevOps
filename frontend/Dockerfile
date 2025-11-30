# ---- BUILD STAGE ----
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Build the frontend
COPY . .
RUN npm run build

# ---- PRODUCTION STAGE ----
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Expose production port
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
