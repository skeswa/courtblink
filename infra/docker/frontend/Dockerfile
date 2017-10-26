FROM nginx

# Sets the timezone to the east coast.
ENV TZ America/New_York
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY code/frontend/build /usr/share/nginx/html
