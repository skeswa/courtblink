FROM node:8

# Sets the timezone to the east coast.
RUN echo "America/New_York" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

RUN echo "deb http://deb.torproject.org/torproject.org jessie main" >> /etc/apt/sources.list \
    && echo "deb-src http://deb.torproject.org/torproject.org jessie main" >> /etc/apt/sources.list \
    && gpg --keyserver keys.gnupg.net --recv A3C4F0F979CAA22CDBA8F512EE8CBC9E886DDD89 \
    && gpg --export A3C4F0F979CAA22CDBA8F512EE8CBC9E886DDD89 | apt-key add - \
    && apt update \
    && apt install -y tor deb.torproject.org-keyring

COPY code/backend /code/backend
COPY code/common /code/common
WORKDIR /code/backend
RUN yarn
EXPOSE 3000

ENV NODE_ENV production
ENV PORT 3000
ENV TOR_EXE tor

CMD ["yarn", "start"]
