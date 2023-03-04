# control-meme-front

## Local development
``` bash
npm install
npm run start
```

## Deploy
``` bash
npm run build && gcloud run deploy controle-meme-back --source . --region us-central1 --project controle-meme
```