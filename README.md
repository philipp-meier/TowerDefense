# TowerDefense
A simple Tower Defense Game written in Typescript.

<kbd><img src="https://static.p-meier.dev/TowerDefense.png" alt="Preview"></kbd>

## Current state
Work in progress. Currently, the game images are being reworked.

## Getting started
```bash
git clone https://github.com/philipp-meier/TowerDefense.git
cd TowerDefense
# run in dev-container with "npm run dev" or local with:
npm install
npm run dev
```

## Docker
```bash
npm run build
docker build -t tower-defense-2d .
docker run -it -d -p 80:80 tower-defense-2d
```

## Contributing
Feel free to fork and modify this project as you like.  
If you want to contribute directly to this project, please consider the rules mentioned [here](docs/CONTRIBUTING.md).

## License
This project is under the [MIT license](LICENSE).
