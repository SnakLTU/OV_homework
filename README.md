# OV_homework

## Dependencies

- Playwright v1.58.2
- Node v24.13.0
- npm v11.6.2

## packages

- dotenv v17.2.4
- csv-parse v6.1.0
- faker-js v10.3.0

## Setting up project

Create your .env file following the [.env.example](.env.example)

Install playwright with dependencies
`npx playwright install --with-deps`

## Run the project
- `npm run test-ui` runs all ui tests with all projects
- `npm run test-ui-c` runs all ui tests only on chromium browser
- `npm run test-ui-f` runs all ui tests only on firefix browser
- `npm run test-api` run all api tests with api project
- `npm run test-ci-cd-ui` run all ui tests for github actions
- `npm run test-ci-cd-api` run all api tests for github actions
- `npm run test-ci-cd-all` run all api and ui tests for github actions