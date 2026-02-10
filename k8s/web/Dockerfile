FROM nginx:alpine

COPY ./client/ /usr/share/nginx/html/
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./backend/static/ /usr/share/nginx/doc/
COPY ./backend/storage/ /storage/