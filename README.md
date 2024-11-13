# Instructions

## Setup

Install Jupyter (saying using conda), Julia (say using `juliaup`), and `pnpm`,
then run:

```sh
pnpm install
```

## Run

First, start the Jupyter server:

```sh
jupyter server --ServerApp.token="" --ServerApp.disable_check_xsrf=True
```

Then, in a separate terminal:

```sh
pnpm run main
```
