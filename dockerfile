# Étape 1 : Construire l'application Angular
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Étape 2 : Servir l'application avec NGINX
FROM nginx:1.25
COPY --from=build /app/dist/interface1 /usr/share/nginx/html # Remplacez "interface1" par le dossier build réel
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
