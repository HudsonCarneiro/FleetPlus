FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência primeiro para aproveitar o cache
COPY package*.json ./

# Instala dependências do projeto
RUN npm install

# Copia o restante dos arquivos da aplicação
COPY . .

# Expõe a porta da API
EXPOSE 3333

CMD ["node", "server.js"]

