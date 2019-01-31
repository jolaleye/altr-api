# use latest nginx
FROM nginx:alpine

# use our custom config
COPY nginx.conf /etc/nginx/nginx.conf

# start nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]