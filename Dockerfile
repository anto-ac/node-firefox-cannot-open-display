FROM node:8.11.4-jessie

    # Install the required packages
# RUN apt-get update && apt-get install -y curl

# RUN apt-get install -y apt-transport-https

# RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
# RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

# RUN apt-get update && apt-get install -y yarn

# RUN curl -sL https://deb.nodesource.com/setup_8.x | \
#     apt-get update && apt-get install -y --no-install-recommends nodejs

#     # Do cleanup to reduce base image size
# RUN rm -rf /var/lib/apt/lists/* \
# RUN apt-get clean

RUN useradd -ms /bin/bash test

USER test
WORKDIR /home/test

# Install npm modules.
COPY ./package.json package.json
COPY ./package-lock.json package-lock.json
COPY ./docker-compose.yml ./docker-compose.yml
RUN cd /home/test && npm install --frozen-lockfile

COPY ./src src