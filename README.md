# Hexa Online Ordering Web UI

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and [Type Script](https://www.typescriptlang.org/).

## Prerequsites

- [React](https://reactjs.org/)
- [React Redux](https://react-redux.js.org/)
- [React Bootstrap](https://react-bootstrap.github.io/)

## Installation

```
cd hexa-online-ordering-webui
npm install
```
## How to run

```
npm run start
```

Open your browser on : [http://localhost:3001](http://localhost:3001)

## Setup environment

Copy file `local.env` and change name to `.env`

```
REACT_APP_API_URL={the api absolute path}
REACT_APP_MARKETING_URL={the marketing website url}
REACT_APP_DEFAULT_PAGESIZE=25
REACT_APP_HEAX_LINE_URL={the line url}
REACT_APP_HEXA_FACEBOOK_URL={the facebook website url}
REACT_APP_HEXA_PRICE_LIST_URL={the price list url}
REACT_APP_HEXA_RETAINER_GALLERY_URL={the retainer gallery url}
```

## Deploy with script

```bash
# set permission for exec
sudo chmod 766 ./script/deploy.sh

# root project
./script/deploy.sh
```

## References
- [UI Design](https://www.figma.com/file/MQCbiGYRFaEqNLTKMmoKii/HexaCeram)
- [Redux dev tool extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd/related?hl=en)
- [7-1 architecture css](https://sass-guidelin.es/#the-7-1-pattern)