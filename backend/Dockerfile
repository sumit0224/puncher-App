FROM node:20-alpine

WORKDIR /app

# Install dependencies specifically for Prisma if needed (openssl)
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm ci

COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "start"]
