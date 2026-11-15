#!/bin/sh
set -eu

prisma migrate deploy
exec node server.js
