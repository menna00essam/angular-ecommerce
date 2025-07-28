# 👷 Step 1: Build Angular App
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration=production --project=ecommerce-app

# 🚀 Step 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/ecommerce-app/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
