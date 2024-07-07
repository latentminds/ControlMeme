# ControlMeme
Repo for the website meme.koll.ai


# Deploy instructions

## Setup
```bash
npm install -g firebase-tools
firebase login
```

## Test functions locally
```bash
firebase emulators:start --only functions
```
* url pour tester: `http://127.0.0.1:5001/control-meme-67c47/us-central1/flaskwrapper/generate/`


## deploy functions
```bash
firebase deploy --only functions
```

## deploy hosting
```bash
npm run build
firebase deploy --only hosting
```


# TODO:

- [ ] Finir de déplacer le dosser `back` dans `functions`