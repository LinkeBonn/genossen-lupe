# Genossen-Lupe

## Setup

Make sure to install the dependencies:

```bash
# docker-compose needs to be running on your machine
just install
```

## Development

The environment starts the web-app.

```bash
# npm
just start
```
The web-appcan be accessed in your browser:
http://localhost:3000/

### Code Checks
```bash

# check linting
just lint-check

# check formatting
just format-check

# fixes linting
just lint-fix

# fixes formatting
just format-fix
```