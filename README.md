# color-amoeba
A color ball eating color balls.

## Compile ##
```bash
$ yum install -y nodejs
$ git clone https://github.com/bill42362/color-amoeba
$ cd color-amoeba
$ npm install
$ npm install -g gulp
$ NODE_ENV=production gulp dist -u
```

## Run web server ##
```bash
$ npm install -g pm2
$ pm2 start app.js
```
