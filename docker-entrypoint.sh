#!/bin/bash

# Replace environment variables in nginx configuration
envsubst '${API_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Replace environment variables in env.js template
envsubst '${API_URL} ${ENABLE_ANALYTICS} ${ENABLE_LOGGING} ${APP_NAME} ${APP_VERSION}' < /usr/share/nginx/html/env.js.template > /usr/share/nginx/html/env.js

# Execute the CMD from the Dockerfile
exec "$@" 