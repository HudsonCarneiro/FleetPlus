FROM node:24-slim

WORKDIR /app

# Instala dependências para compilar pacotes nativos
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3333

CMD ["node", "server.js"]


