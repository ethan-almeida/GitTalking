FROM node:20-bookworm-slim
WORKDIR /app
COPY git-talking/package*.json ./
RUN npm ci
COPY git-talking ./
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]