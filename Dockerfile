FROM node:10.15.3-alpine
EXPOSE 3000 9229 3030
COPY . /home/app
WORKDIR /home/app
RUN npm install -g typescript
RUN npm install -g concurrently
RUN npm install -g docsify-cli
RUN npm install
RUN DATABASE_URL=postgres://blockchain:testuser@postgres:5432/blockchain npm run migrate up
ENTRYPOINT ["sh", "./scripts/start.sh"]
CMD ./scripts/start.sh