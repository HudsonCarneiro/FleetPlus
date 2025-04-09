FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência primeiro para aproveitar o cache
COPY package*.json ./

# Instala dependências do projeto
RUN npm install

# Instala nodemon globalmente (melhor evitar se não for necessário)
# Alternativa: instale como dev dependency no package.json
RUN npm install -g nodemon

# Copia o restante dos arquivos da aplicação
COPY . .

# Expõe a porta da API
EXPOSE 3333

# Comando padrão do container
CMD ["npx", "nodemon", "server.js"]
