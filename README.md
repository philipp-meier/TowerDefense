# TowerDefense
A simple Tower Defense Game written in Typescript. [Try it!](https://www.p-meier.dev/)

![Preview](https://p-meier.dev/res/TowerDefense.gif)

## Current state
Work in progress. Currently, the game images are being reworked.

## Getting started
```shell
git clone https://github.com/philipp-meier/TowerDefense.git
cd TowerDefense
npm install
npm run dev
# open http://localhost:8080
```

## Docker
```
npm run build
docker build -t tower-defense-2d .
docker run -it -d -p 80:80 tower-defense-2d
```

## Contributing
Feel free to fork and modify this project as you like.  
If you want to contribute directly to this project, please consider the rules mentioned [here](docs/CONTRIBUTING.md).

## License
This project is under the [MIT license](LICENSE).
