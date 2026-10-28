# nestjs-email-service

NestJS backend for the [ng-web-portfolio](https://github.com/Sony2k20/ng-web-portfolio)
website. It sends the contact form emails and the workbook (PDF attachment) via
SMTP and stores the workbook recipients in MongoDB.

## API

| Method | Path                  | Description                                                                                       |
| ------ | --------------------- | ------------------------------------------------------------------------------------------------- |
| `GET`  | `/health`             | Health check, returns `{ status: 'ok', timestamp }`                                               |
| `POST` | `/email/send`         | Sends an email                                                                                    |
| `POST` | `/email/sendWorkbook` | Sends an email with `src/assets/workbook.pdf` attached and adds the recipient to MongoDB (`users`) |
| `GET`  | `/assets/*`           | Static files from `src/assets`                                                                    |

Both `POST` endpoints take `{ fromName, to, subject, text, html? }`. The mail is
sent from `SMTP_USER` with `fromName` as display name.

When `NODE_ENV` is unset or `dev`, Swagger UI is available at `/docs`. CORS only
allows the origins listed in `src/main.ts`.

## Configuration

Copy `.env.default` to `.env` and fill it in. The app does not start if a
required variable is missing.

| Variable      | Required | Description                                 |
| ------------- | -------- | ------------------------------------------- |
| `SMTP_HOST`   | yes      | SMTP server (connected via TLS)             |
| `SMTP_PORT`   | no       | SMTP port, default `587`                    |
| `SMTP_USER`   | yes      | SMTP login, also used as sender address     |
| `SMTP_PASS`   | yes      | SMTP password                               |
| `MONGODB_URI` | yes      | MongoDB connection string                   |
| `PORT`        | no       | HTTP port, default `3000`                   |
| `NODE_ENV`    | no       | `dev` (default) enables Swagger UI at `/docs` |

## Development

Requires Node.js >= 24.9.

```bash
npm install
```

```bash
npm run start:dev
```

```bash
npm test
```

```bash
npm run test:e2e
```

The e2e tests mock SMTP and MongoDB, so they need no `.env`. The `CI` workflow
lints, builds and runs both test suites on every pull request.

## Deployment

Every push to `master` releases a new version and deploys it
(`.github/workflows/docker-build.yml`):

1. The next [semantic version](https://semver.org) is derived from the commit
   messages since the last `v*.*.*` tag ([Conventional Commits](https://www.conventionalcommits.org)):

   | Commit message                              | Bump  | Example        |
   | ------------------------------------------- | ----- | -------------- |
   | `feat!: ...` or body with `BREAKING CHANGE` | major | 1.4.2 -> 2.0.0 |
   | `feat: ...` / `feat(scope): ...`            | minor | 1.4.2 -> 1.5.0 |
   | anything else (`fix:`, `chore:`, ...)       | patch | 1.4.2 -> 1.4.3 |

2. The Docker image is pushed as `sony2k20/nestjs-email-service:<version>`
   (plus `<major>.<minor>`, `<major>` and `latest`).
3. A git tag `v<version>` and a GitHub release with generated notes are created.
4. The version is written to `app-of-apps/apps/ng-web-portfolio.yaml` in
   [gitops-deployments](https://github.com/Sony2k20/gitops-deployments); Argo CD
   rolls it out. A rollback is a tag change there.

When merging a pull request, the commit messages of the PR decide the bump, so
name the commits (or the squash commit) accordingly.

## Dependency updates

[Renovate](https://docs.renovatebot.com) (`renovate.json`) runs self-hosted as a
CronJob in [gitops-deployments](https://github.com/Sony2k20/gitops-deployments).
It opens PRs on Monday mornings for updates that are at least 3 days old.
Nothing is merged automatically, since every merge to `master` deploys. NestJS
majors are only opened after approval in the Dependency Dashboard issue.
