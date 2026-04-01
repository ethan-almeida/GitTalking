FROM node:20-alpine
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY git-talking .
RUN npm run build
EXPOSE 3000s
CMD ["npm", "start"]
