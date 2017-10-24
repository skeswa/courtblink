FROM node:8

ENV NODE_ENV production
ENV PORT 3000

COPY code/backend /code/backend
COPY code/common /code/common
WORKDIR /code/backend
RUN yarn
EXPOSE 3000

CMD ["yarn", "start"]
