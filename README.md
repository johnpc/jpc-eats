# eats.jpc.io

An app for choosing where to go out to eat

## Setup

Clone the repo, install dependencies, deploy backend resources:

```bash
git clone git@github.com:johnpc/jpc-eats.git
cd jpc-eats
npm install
npx amplify sandbox
```

You'll also need to set up your environment variables:

```bash
cp .env.example .env
# Then fill in the values with your own by following instructions in .env
```

Then, to run the frontend app

```bash
# on web
npm run dev
```

or

```bash
# on ios
npm run ios
```

## Deploying

Deploy this application to your own AWS account in one click:

[![amplifybutton](https://oneclick.amplifyapp.com/button.svg)](https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/johnpc/jpc-eats)
