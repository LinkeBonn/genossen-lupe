# Use the standard node LTS image
FROM node:lts AS base
RUN mkdir -p /tmp/.cache/yarn
RUN chown -R node:node /tmp/.cache/yarn

# enable corepack
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

# Install Yarn v3
RUN corepack prepare yarn@stable --activate
RUN yarn set version 3.x

# Continue with the development stage
FROM base AS dev
# Update the package list and install dependencies with apt-get
RUN apt-get update && apt-get install -y python3 openssl ca-certificates
# Install build dependencies
RUN apt-get install -y build-essential

# Continue with the production stage
FROM base AS prod
COPY --from= /web-app /web-app
