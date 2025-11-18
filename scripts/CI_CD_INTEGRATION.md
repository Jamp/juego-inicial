# Integración CI/CD - Script de Testing de Repeticiones

Este documento explica cómo integrar el script de testing de repeticiones en diferentes plataformas de CI/CD.

## GitHub Actions

Crear archivo `.github/workflows/test-repetitions.yml`:

```yaml
name: Test Game Repetitions

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-repetitions:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run repetition tests
        run: pnpm test:repetitions

      - name: Upload test logs
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: test-logs
          path: logs/
          retention-days: 7
```

## GitLab CI

Agregar a `.gitlab-ci.yml`:

```yaml
test:repetitions:
  stage: test
  image: node:20-alpine
  before_script:
    - npm install -g pnpm@10
    - pnpm install --frozen-lockfile
  script:
    - pnpm test:repetitions
  artifacts:
    when: on_failure
    paths:
      - logs/
    expire_in: 1 week
  only:
    - main
    - develop
    - merge_requests
```

## Bitbucket Pipelines

Agregar a `bitbucket-pipelines.yml`:

```yaml
pipelines:
  default:
    - step:
        name: Test Repetitions
        image: node:20
        caches:
          - node
        script:
          - npm install -g pnpm@10
          - pnpm install --frozen-lockfile
          - pnpm test:repetitions
        artifacts:
          - logs/**

  pull-requests:
    '**':
      - step:
          name: Test Repetitions
          image: node:20
          script:
            - npm install -g pnpm@10
            - pnpm install --frozen-lockfile
            - pnpm test:repetitions
```

## CircleCI

Agregar a `.circleci/config.yml`:

```yaml
version: 2.1

jobs:
  test-repetitions:
    docker:
      - image: cimg/node:20.11
    steps:
      - checkout
      - run:
          name: Install pnpm
          command: npm install -g pnpm@10
      - restore_cache:
          keys:
            - v1-deps-{{ checksum "pnpm-lock.yaml" }}
      - run:
          name: Install dependencies
          command: pnpm install --frozen-lockfile
      - save_cache:
          key: v1-deps-{{ checksum "pnpm-lock.yaml" }}
          paths:
            - node_modules
      - run:
          name: Run repetition tests
          command: pnpm test:repetitions
      - store_artifacts:
          path: logs/
          destination: test-logs

workflows:
  version: 2
  test:
    jobs:
      - test-repetitions
```

## Travis CI

Agregar a `.travis.yml`:

```yaml
language: node_js
node_js:
  - '20'

before_install:
  - npm install -g pnpm@10

install:
  - pnpm install --frozen-lockfile

script:
  - pnpm test:repetitions

after_failure:
  - tar -czf logs.tar.gz logs/

deploy:
  provider: releases
  skip_cleanup: true
  file: logs.tar.gz
  on:
    all_branches: true
    condition: $TRAVIS_TEST_RESULT = 1
```

## Azure Pipelines

Crear archivo `azure-pipelines.yml`:

```yaml
trigger:
  - main
  - develop

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '20.x'
    displayName: 'Install Node.js'

  - script: |
      npm install -g pnpm@10
    displayName: 'Install pnpm'

  - script: |
      pnpm install --frozen-lockfile
    displayName: 'Install dependencies'

  - script: |
      pnpm test:repetitions
    displayName: 'Run repetition tests'

  - task: PublishBuildArtifacts@1
    condition: failed()
    inputs:
      PathtoPublish: 'logs'
      ArtifactName: 'test-logs'
    displayName: 'Upload test logs on failure'
```

## Pre-commit Hook (Local)

Para ejecutar antes de cada commit, crear `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "Running repetition tests..."
pnpm test:repetitions

if [ $? -ne 0 ]; then
  echo "❌ Repetition tests failed. Commit aborted."
  exit 1
fi

echo "✅ Repetition tests passed!"
```

Instalar husky:

```bash
pnpm add -D husky
pnpm husky install
pnpm husky add .husky/pre-commit "pnpm test:repetitions"
```

## Pre-push Hook (Recomendado)

Más rápido que pre-commit, ejecuta antes de push:

```bash
#!/bin/sh

echo "Running repetition tests before push..."
pnpm test:repetitions

if [ $? -ne 0 ]; then
  echo "❌ Repetition tests failed. Push aborted."
  echo "Fix the issues or use --no-verify to skip (not recommended)."
  exit 1
fi

echo "✅ Repetition tests passed! Pushing..."
```

## Docker

Si usas Docker para desarrollo, agregar al `Dockerfile` o crear un script separado:

```dockerfile
# Dockerfile.test
FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@10 && pnpm install --frozen-lockfile

COPY . .

CMD ["pnpm", "test:repetitions"]
```

Ejecutar:

```bash
docker build -f Dockerfile.test -t juego-inicial-test .
docker run --rm juego-inicial-test
```

## Configuración Opcional: Ajustar Número de Rondas

Para CI/CD, puedes querer ejecutar menos rondas para ahorrar tiempo:

### Opción 1: Variable de entorno

Modificar `test-repetitions.js`:

```javascript
const ROUNDS = process.env.CI_ROUNDS ? parseInt(process.env.CI_ROUNDS) : 500
```

Luego en CI:

```yaml
script:
  - CI_ROUNDS=100 pnpm test:repetitions
```

### Opción 2: Script separado

Crear `package.json`:

```json
{
  "scripts": {
    "test:repetitions": "node scripts/test-repetitions.js",
    "test:repetitions:ci": "CI_ROUNDS=100 node scripts/test-repetitions.js"
  }
}
```

## Notificaciones de Fallos

### Slack (GitHub Actions)

```yaml
- name: Notify Slack on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Repetition tests failed! Check logs for details.'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Email (GitLab)

GitLab envía emails automáticamente. Configurar en:
Settings → Integrations → Pipeline emails

## Best Practices

### 1. Ejecutar solo en cambios relevantes

```yaml
# GitHub Actions - solo si cambian archivos de juegos
on:
  push:
    paths:
      - 'src/components/games/**'
      - 'scripts/test-repetitions.js'
```

### 2. Cache de dependencias

```yaml
# Ejemplo para GitHub Actions
- uses: actions/cache@v3
  with:
    path: ~/.pnpm-store
    key: ${{ runner.os }}-pnpm-${{ hashFiles('pnpm-lock.yaml') }}
```

### 3. Paralelización

Si tienes más tests, ejecutarlos en paralelo:

```yaml
# GitHub Actions
jobs:
  test-repetitions:
    # ...
  test-unit:
    # ...
  test-e2e:
    # ...
```

### 4. Reportes automáticos

Usar GitHub Actions para comentar en PRs:

```yaml
- name: Comment PR
  if: failure() && github.event_name == 'pull_request'
  uses: actions/github-script@v6
  with:
    script: |
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: '❌ Repetition tests failed. Check the logs for details.'
      })
```

## Troubleshooting CI/CD

### Error: pnpm no encontrado

**Solución**: Instalar pnpm globalmente en el CI:

```bash
npm install -g pnpm@10
```

### Error: permisos de scripts

**Solución**: Asegurarse de que el script sea ejecutable:

```bash
chmod +x scripts/test-repetitions.js
```

O ejecutar con node directamente:

```bash
node scripts/test-repetitions.js
```

### Error: out of memory

**Solución**: Reducir el número de rondas para CI:

```javascript
const ROUNDS = process.env.CI ? 100 : 500
```

### Los colores no se ven en CI

Esto es normal. Los códigos ANSI no se renderizan en la mayoría de logs de CI. Los tests funcionan igual.

---

**Última actualización**: 2025-11-17
