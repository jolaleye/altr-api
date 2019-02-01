# use latest nginx
FROM nginx:alpine

# use our custom config
COPY nginx.conf /etc/nginx/nginx.conf

# start nginx
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]