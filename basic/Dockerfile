from node:16
workdir /var/app
copy package.json .
copy tsconfig.json .
run yarn install
copy index.ts .
copy models/ ./models
cmd ["yarn", "try"]