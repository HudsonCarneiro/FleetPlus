# Etapa 1: build do frontend
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build com tsconfig.app.json
RUN npm run build

# Etapa 2: usar nginx para servir o build
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
