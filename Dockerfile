FROM node:14-alpine

ENV NODE_ENV=production
ENV PUBLIC_URL='/'
ENV PORT=8081

WORKDIR /usr/src/app

RUN apk add --update g++ make tzdata ca-certificates git \
    && cp /usr/share/zoneinfo/Europe/Paris /etc/localtime \
    && echo "Europe/Paris" > /etc/timezone \
    && apk del --purge tzdata \
    && rm -rf /usr/share/vim/vim74/doc/* /usr/share/vim/vim74/tutor/* /var/cache/apk/*

COPY . .

RUN yarn install
RUN yarn build

EXPOSE 8081
CMD [ "yarn", "start" ]
