Hosted at: https://multitool.pavanct.com
# multi-tool-geo-data

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Deployment Instructions
1. Generate Static files - firs time

```
npm run build
```

2. Install Docker

  https://docs.docker.com/install/

3. Build docker image

```
sudo docker build -t "image-name" .
```

4. Run docker image
```
sudo docker run -d -p 80:80 --name "conatiner-name" image-name
```
