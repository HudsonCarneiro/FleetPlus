## docker
1. caso altere algo dos volumes
```bash
docker compose restart backend 
```
reconstruir a imagem backend
```bash
docker compose down
docker compose up --build


docker-compose exec backend bash
NODE_ENV=test npm test
