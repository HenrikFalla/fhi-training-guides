import CodeBlock from '#/components/code-block/code-block'
import Confetti from '#/components/confetti/confetti'
import GuideBanner from '#/components/guide-banner/guide-banner'
import StepCard from '#/components/step-card/step-card'
import StepTracker, { type Step } from '#/components/step-tracker/step-tracker'
import { useGuideSteps } from '#/hooks/use-guide-steps'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import styles from './github-pages-pipeline.module.css'

export const Route = createFileRoute('/github-pages-pipeline/')({
  component: RouteComponent,
})

const initialSteps: Step[] = [
  {
    title: 'Klargjør ditt eget prosjekt',
    order: 1,
    optional: false,
    completed: false,
  },
  {
    title: 'Aktiver GitHub Pages',
    order: 2,
    optional: false,
    completed: false,
  },
  {
    title: 'Opprett GitHub Actions-workflow',
    order: 3,
    optional: false,
    completed: false,
  },
  {
    title: 'Test automatisk publisering',
    order: 4,
    optional: false,
    completed: false,
  },
  {
    title: 'Byggesteg med npm/Vite',
    order: 5,
    optional: true,
    completed: false,
  },
]

const STEP_1_GIT_CODE = `git add .
git commit -m "Første versjon av nettsiden"
git branch -M main
git push -u origin main`

const STEP_3_YAML_CODE = `name: Publiser til GitHub Pages

# Når skal denne workflowen kjøre?
on:
  # Kjør automatisk ved push til main-branchen
  push:
    branches: ["main"]

  # Gjør det mulig å starte workflowen manuelt fra Actions-fanen på GitHub
  workflow_dispatch:

# Tillatelser som trengs for å publisere til GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Sikrer at kun én publisering kjører om gangen
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Sjekk ut koden fra repositoriet
        uses: actions/checkout@v4

      - name: Konfigurer GitHub Pages
        uses: actions/configure-pages@v5

      - name: Last opp filer som Pages-artifact
        uses: actions/upload-pages-artifact@v4
        with:
          # '.' betyr rotmappen i repositoriet ditt.
          # Hvis index.html ligger i en undermappe (f.eks. 'src/'), endrer du '.' til './src'
          path: "."

      - name: Publiser til GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`

const STEP_3_GIT_CODE = `git add .github/workflows/deploy.yml
git commit -m "Legg til GitHub Actions workflow for GitHub Pages"
git push origin main`

const STEP_4_GIT_CODE = `git add .
git commit -m "Oppdater innhold på nettsiden"
git push origin main`

const STEP_5_VITE_CODE = `import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
});`

const STEP_5_YAML_CODE = `name: Bygg og publiser til GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Sjekk ut koden fra repositoriet
        uses: actions/checkout@v4

      - name: Sett opp Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "npm"

      - name: Installer avhengigheter
        run: npm ci

      - name: Bygg prosjektet
        run: npm run build

      - name: Konfigurer GitHub Pages
        uses: actions/configure-pages@v5

      - name: Last opp dist-mappen som Pages-artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: "./dist"

      - name: Publiser til GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`

const STEP_5_SUBFOLDER_YAML_CODE = `jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    # 1. Kjør kommandoer (npm ci, npm run build) i undermappen:
    defaults:
      run:
        working-directory: ./min-undermappe
    steps:
      - name: Sjekk ut koden fra repositoriet
        uses: actions/checkout@v4

      - name: Sett opp Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "npm"
          # 2. Pek til package-lock.json i undermappen:
          cache-dependency-path: "./min-undermappe/package-lock.json"

      - name: Installer avhengigheter
        run: npm ci

      - name: Bygg prosjektet
        run: npm run build

      - name: Konfigurer GitHub Pages
        uses: actions/configure-pages@v5

      - name: Last opp dist-mappen som Pages-artifact
        uses: actions/upload-pages-artifact@v4
        with:
          # 3. Last opp dist-mappen fra undermappen:
          path: "./min-undermappe/dist"

      - name: Publiser til GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`

function RouteComponent() {
  const { steps, celebrationCount, setStepCompleted, resetSteps } =
    useGuideSteps('github-pages-pipeline', initialSteps)

  useEffect(() => {
    import('@folkehelseinstituttet/designsystem/fhi-callout')
    import('@folkehelseinstituttet/designsystem/fhi-icon-circle-info')
    import('@folkehelseinstituttet/designsystem/fhi-link')
  }, [])

  const isCompleted = (order: number) =>
    Boolean(steps.find((s) => s.order === order)?.completed)

  return (
    <div className={styles.pageWrapper}>
      <GuideBanner
        tag="GitHub Actions + Pages"
        title="Publisering til GitHub Pages med GitHub Actions"
        lead="En steg-for-steg-guide for å sette opp automatisk publisering (CI/CD) av ditt eget HTML, CSS og JavaScript-prosjekt til GitHub Pages."
      />

      <div className={styles.guideLayout}>
        <StepTracker
          steps={steps}
          title="Steg i guiden"
          reset={resetSteps}
          extraLinks={[
            { href: '#feilsoking', label: 'Vanlige feil og feilsøking' },
          ]}
        />

        <main className={styles.guideContent}>
          <StepCard
            id="steg-1"
            title="Steg 1: Klargjør ditt eget HTML/CSS/JS-prosjekt"
            badgeText="Steg 1"
            badgeColor="accent"
            completed={isCompleted(1)}
            checkboxLabel="Marker steg 1 som fullført: Prosjektet mitt ligger på GitHub"
            onToggleComplete={(done) => setStepCompleted(1, done)}
          >
            <p className={styles.paragraph}>
              Start med ditt eget nettsideprosjekt (eller lag en ny mappe med en
              enkel <code className={styles.inlineCode}>index.html</code>). For
              at GitHub Pages skal fungere på en gratis GitHub-konto, må
              repositoriet ditt på GitHub være satt til <strong>Public</strong>.
            </p>

            <ol className={styles.instructionList}>
              <li>
                Sørg for at prosjektet ditt har en{' '}
                <code className={styles.inlineCode}>index.html</code>-fil i
                rotmappen (eller i en kjent undermappe).
              </li>
              <li>
                Opprett et nytt, <strong>Public</strong> repository på{' '}
                <a
                  className={styles.link}
                  href="https://github.com/new"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/new
                </a>{' '}
                dersom du ikke allerede har et.
              </li>
              <li>
                Koble prosjektmappen din til GitHub og push koden til{' '}
                <code className={styles.inlineCode}>main</code>-branchen:
              </li>
            </ol>

            <CodeBlock
              label="Terminal ( i ditt eget prosjekt )"
              code={STEP_1_GIT_CODE}
            />
          </StepCard>

          <StepCard
            id="steg-2"
            title="Steg 2: Aktiver GitHub Pages i innstillingene"
            badgeText="Steg 2"
            badgeColor="accent"
            completed={isCompleted(2)}
            checkboxLabel="Marker steg 2 som fullført: Source er satt til GitHub Actions"
            onToggleComplete={(done) => setStepCompleted(2, done)}
          >
            <p className={styles.paragraph}>
              Før en GitHub Actions-workflow får lov til å publisere nettsiden
              din, må du fortelle GitHub at <strong>GitHub Actions</strong> skal
              brukes som kilde for GitHub Pages.
            </p>

            <ol className={styles.instructionList}>
              <li>Gå til repositoriet ditt på GitHub i nettleseren.</li>
              <li>
                Klikk på <strong>Settings</strong> i toppmenyen.
              </li>
              <li>
                I menyen til venstre (under{' '}
                <em>Code, planning, and automation</em>), klikk på{' '}
                <strong>Pages</strong>.
              </li>
              <li>
                Under <strong>Build and deployment</strong> &rarr;{' '}
                <strong>Source</strong>, bytt fra <em>Deploy from a branch</em>{' '}
                til <strong>GitHub Actions</strong>.
              </li>
            </ol>

            <fhi-callout color="neutral" variant="bordered">
              <fhi-icon-circle-info slot="icon" />
              <p className={styles.paragraph}>
                <strong>Tips:</strong> Innstillingen lagres automatisk så snart
                du velger <strong>GitHub Actions</strong> i nedtrekksmenyen.
                Ignorer forslagene til ferdige workflows som GitHub viser på
                siden — vi lager vår egen fil i neste steg.
              </p>
            </fhi-callout>
          </StepCard>

          <StepCard
            id="steg-3"
            title="Steg 3: Opprett GitHub Actions-workflow"
            badgeText="Steg 3"
            badgeColor="accent"
            completed={isCompleted(3)}
            checkboxLabel="Marker steg 3 som fullført: deploy.yml er opprettet og pushet"
            onToggleComplete={(done) => setStepCompleted(3, done)}
          >
            <p className={styles.paragraph}>
              GitHub Actions ser etter YAML-filer i mappen{' '}
              <code className={styles.inlineCode}>.github/workflows/</code> i
              roten av repositoriet ditt. For en vanlig statisk nettside med ren
              HTML, CSS og JavaScript trenger vi <strong>ikke</strong> noe
              byggesteg — vi kan laste opp filene direkte.
            </p>

            <fhi-callout
              color="neutral"
              heading="Hva er YAML?"
              variant="bordered"
            >
              <fhi-icon-circle-info slot="icon" />
              <p className={styles.paragraph}>
                YAML (YAML Ain&apos;t Markup Language) er et menneskelesbart
                dataserialiseringsspråk, designet for datautveksling mellom
                språk med ulike datastrukturer.{' '}
                <fhi-link href="https://yaml.com/" target="_blank">
                  Lær mer
                </fhi-link>
              </p>
            </fhi-callout>

            <ol className={styles.instructionList}>
              <li>
                I ditt eget prosjekt, opprett mappen{' '}
                <code className={styles.inlineCode}>.github/workflows</code>{' '}
                (husk punktumet foran{' '}
                <code className={styles.inlineCode}>.github</code>).
              </li>
              <li>
                Opprett filen{' '}
                <code className={styles.inlineCode}>
                  .github/workflows/deploy.yml
                </code>{' '}
                og lim inn følgende oppsett:
              </li>
            </ol>

            <CodeBlock
              label=".github/workflows/deploy.yml"
              code={STEP_3_YAML_CODE}
            />

            <h3 className={styles.subheading}>
              Hva betyr de viktigste delene i filen?
            </h3>
            <ul className={styles.explanationList}>
              <li>
                <code className={styles.inlineCode}>
                  on: push: branches: [&quot;main&quot;]
                </code>
                : Starter workflowen automatisk hver gang du pusher til{' '}
                <code className={styles.inlineCode}>main</code>.
              </li>
              <li>
                <code className={styles.inlineCode}>workflow_dispatch</code>:
                Gir deg en <em>&quot;Run workflow&quot;</em>-knapp under{' '}
                <strong>Actions</strong>-fanen på GitHub.
              </li>
              <li>
                <code className={styles.inlineCode}>permissions</code>: Gir
                jobben lesetilgang til koden (
                <code className={styles.inlineCode}>contents: read</code>) og
                tillatelse til å rulle ut til GitHub Pages (
                <code className={styles.inlineCode}>pages: write</code> og{' '}
                <code className={styles.inlineCode}>id-token: write</code>).
              </li>
              <li>
                <code className={styles.inlineCode}>
                  actions/upload-pages-artifact@v4
                </code>
                : Pakker sammen alle filene i{' '}
                <code className={styles.inlineCode}>path: &quot;.&quot;</code>{' '}
                til en pakke klar for publisering.
              </li>
              <li>
                <code className={styles.inlineCode}>
                  actions/deploy-pages@v4
                </code>
                : Publiserer pakken og gjør nettsiden tilgjengelig på din{' '}
                <code className={styles.inlineCode}>github.io</code>-adresse.
              </li>
            </ul>

            <fhi-callout
              color="neutral"
              heading="Hva hvis prosjektet ligger i en undermappe?"
              variant="bordered"
            >
              <fhi-icon-circle-info slot="icon" />
              <p className={styles.paragraph}>
                Dersom HTML-, CSS- og JS-filene dine ligger i en undermappe i
                repositoriet (for eksempel{' '}
                <code className={styles.inlineCode}>./min-undermappe</code>):
              </p>
              <ol className={styles.instructionList}>
                <li>
                  Workflow-filen{' '}
                  <code className={styles.inlineCode}>
                    .github/workflows/deploy.yml
                  </code>{' '}
                  må <strong>alltid ligge i rotmappen</strong> av
                  Git-repositoriet (ikke inne i undermappen).
                </li>
                <li>
                  Endre{' '}
                  <code className={styles.inlineCode}>path: &quot;.&quot;</code>{' '}
                  under{' '}
                  <code className={styles.inlineCode}>
                    actions/upload-pages-artifact@v4
                  </code>{' '}
                  til stien for undermappen din, f.eks.{' '}
                  <code className={styles.inlineCode}>
                    path: &quot;./min-undermappe&quot;
                  </code>
                  .
                </li>
              </ol>
            </fhi-callout>

            <p className={styles.paragraph}>
              Commit og push{' '}
              <code className={styles.inlineCode}>
                .github/workflows/deploy.yml
              </code>{' '}
              til GitHub:
            </p>

            <CodeBlock label="Terminal" code={STEP_3_GIT_CODE} />
          </StepCard>

          <StepCard
            id="steg-4"
            title="Steg 4: Test automatisk publisering (CI/CD i praksis)"
            badgeText="Steg 4"
            badgeColor="accent"
            completed={isCompleted(4)}
            checkboxLabel="Marker steg 4 som fullført: Nettsiden min oppdateres automatisk ved push"
            onToggleComplete={(done) => setStepCompleted(4, done)}
          >
            <p className={styles.paragraph}>
              Nå skal du sjekke at nettsiden din er publisert og teste at nye
              endringer ruller ut automatisk.
            </p>

            <ol className={styles.instructionList}>
              <li>
                Gå til <strong>Actions</strong>-fanen i repositoriet ditt på
                GitHub.
              </li>
              <li>
                Klikk på kjøringen for{' '}
                <strong>Publiser til GitHub Pages</strong>. Når steget{' '}
                <strong>deploy</strong> har fått en grønn hake, står
                nettadressen til siden din rett under jobben (f.eks.{' '}
                <code className={styles.inlineCode}>
                  https://&lt;brukernavn&gt;.github.io/&lt;repo-navn&gt;/
                </code>
                ).
              </li>
              <li>
                Åpne nettadressen i nettleseren og bekreft at siden din vises.
              </li>
              <li>
                Gjør en synlig endring i din egen{' '}
                <code className={styles.inlineCode}>index.html</code> eller{' '}
                <code className={styles.inlineCode}>styles.css</code> lokalt, og
                push endringen til GitHub:
              </li>
            </ol>

            <CodeBlock label="Terminal" code={STEP_4_GIT_CODE} />

            <p className={styles.paragraph}>
              Vent til den nye kjøringen under <strong>Actions</strong> blir
              grønn, og last inn nettsiden på nytt (
              <code className={styles.inlineCode}>Ctrl + F5</code> /{' '}
              <code className={styles.inlineCode}>Cmd + Shift + R</code>).
            </p>
          </StepCard>

          <StepCard
            id="steg-5"
            title="Steg 5 (Valgfritt): Byggesteg med npm og Vite"
            badgeText="Valgfritt"
            badgeColor="info"
            completed={isCompleted(5)}
            checkboxLabel="Marker steg 5 som fullført (valgfritt byggesteg)"
            onToggleComplete={(done) => setStepCompleted(5, done)}
          >
            <p className={styles.paragraph}>
              Bruker prosjektet ditt npm-pakker (som f.eks.{' '}
              <code className={styles.inlineCode}>
                @folkehelseinstituttet/designsystem
              </code>
              ) eller et byggeverktøy som <strong>Vite</strong>? Da kan ikke
              nettleseren lese{' '}
              <code className={styles.inlineCode}>node_modules</code> direkte. I
              stedet må GitHub Actions installere pakkene og kjøre{' '}
              <code className={styles.inlineCode}>npm run build</code> før den
              ferdigbygde <code className={styles.inlineCode}>dist/</code>
              -mappen publiseres.
            </p>

            <h3 className={styles.subheading}>
              1. Sett relativ base-sti i Vite
            </h3>
            <p className={styles.paragraph}>
              På GitHub Pages ligger prosjektet gjerne på en undermappe i URL-en
              (<code className={styles.inlineCode}>/&lt;repo-navn&gt;/</code>).
              Legg til <code className={styles.inlineCode}>vite.config.js</code>{' '}
              med{' '}
              <code className={styles.inlineCode}>base: &quot;./&quot;</code>{' '}
              slik at lenker til CSS- og JS-filer fungerer uansett hva
              repositoriet heter:
            </p>

            <CodeBlock label="vite.config.js" code={STEP_5_VITE_CODE} />

            <h3 className={styles.subheading}>
              2. Utvid workflowen med Node.js og byggesteg
            </h3>
            <p className={styles.paragraph}>
              Bytt ut innholdet i{' '}
              <code className={styles.inlineCode}>
                .github/workflows/deploy.yml
              </code>{' '}
              med denne versjonen som kjører{' '}
              <code className={styles.inlineCode}>npm ci</code> og{' '}
              <code className={styles.inlineCode}>npm run build</code>, og
              laster opp <code className={styles.inlineCode}>./dist</code>:
            </p>

            <CodeBlock
              label=".github/workflows/deploy.yml (med npm build)"
              code={STEP_5_YAML_CODE}
            />

            <h3 className={styles.subheading}>
              3. Ligger npm/Vite-prosjektet i en undermappe?
            </h3>
            <p className={styles.paragraph}>
              Hvis <code className={styles.inlineCode}>package.json</code> og{' '}
              <code className={styles.inlineCode}>package-lock.json</code> ikke
              ligger i rotmappen av repositoriet, men inne i en undermappe
              (f.eks.{' '}
              <code className={styles.inlineCode}>./min-undermappe</code>), må
              du gjøre tre tilpasninger i{' '}
              <code className={styles.inlineCode}>
                .github/workflows/deploy.yml
              </code>
              :
            </p>

            <ol className={styles.instructionList}>
              <li>
                Legg til{' '}
                <code className={styles.inlineCode}>
                  defaults.run.working-directory
                </code>{' '}
                på jobben slik at{' '}
                <code className={styles.inlineCode}>npm ci</code> og{' '}
                <code className={styles.inlineCode}>npm run build</code> kjøres
                inne i undermappen.
              </li>
              <li>
                Legg til{' '}
                <code className={styles.inlineCode}>cache-dependency-path</code>{' '}
                under{' '}
                <code className={styles.inlineCode}>actions/setup-node@v4</code>{' '}
                slik at den finner{' '}
                <code className={styles.inlineCode}>package-lock.json</code> i
                undermappen.
              </li>
              <li>
                Oppdater <code className={styles.inlineCode}>path</code> under{' '}
                <code className={styles.inlineCode}>
                  actions/upload-pages-artifact@v4
                </code>{' '}
                til{' '}
                <code className={styles.inlineCode}>
                  &quot;./min-undermappe/dist&quot;
                </code>
                .
              </li>
            </ol>

            <CodeBlock
              label=".github/workflows/deploy.yml (npm build i undermappe)"
              code={STEP_5_SUBFOLDER_YAML_CODE}
            />
          </StepCard>

          <StepCard
            id="feilsoking"
            title="Vanlige feil og feilsøking"
            badgeText="Tips"
            badgeColor="warning"
          >
            <ul className={styles.explanationList}>
              <li>
                <strong>Workflowen starter ikke når jeg pusher:</strong>{' '}
                Kontroller at filen heter nøyaktig{' '}
                <code className={styles.inlineCode}>
                  .github/workflows/deploy.yml
                </code>{' '}
                (plassert i rotmappen av repositoriet) og at branchen din heter{' '}
                <code className={styles.inlineCode}>main</code> (hvis den heter{' '}
                <code className={styles.inlineCode}>master</code>, endre{' '}
                <code className={styles.inlineCode}>
                  branches: [&quot;main&quot;]
                </code>{' '}
                i YAML-filen).
              </li>
              <li>
                <strong>Jobben feiler på Configure eller Deploy Pages:</strong>{' '}
                Dobbeltsjekk <strong>Steg 2</strong> — under{' '}
                <em>Settings &rarr; Pages &rarr; Source</em> må det stå{' '}
                <strong>GitHub Actions</strong>, og repositoriet må være{' '}
                <strong>Public</strong>. Pass også på at du bruker{' '}
                <code className={styles.inlineCode}>
                  actions/upload-pages-artifact@v4
                </code>{' '}
                (og ikke vanlig{' '}
                <code className={styles.inlineCode}>
                  actions/upload-artifact
                </code>
                ).
              </li>
              <li>
                <strong>Nettsiden viser 404 Not Found:</strong> Sjekk at{' '}
                <code className={styles.inlineCode}>index.html</code> ligger i
                mappen som <code className={styles.inlineCode}>path</code> peker
                til i{' '}
                <code className={styles.inlineCode}>
                  actions/upload-pages-artifact@v4
                </code>{' '}
                (<code className={styles.inlineCode}>&quot;.&quot;</code> for
                rotmappen,{' '}
                <code className={styles.inlineCode}>&quot;./dist&quot;</code>{' '}
                ved bruk av Vite, eller{' '}
                <code className={styles.inlineCode}>
                  &quot;./min-undermappe&quot;
                </code>{' '}
                dersom prosjektet ligger i en undermappe).
              </li>
              <li>
                <strong>
                  Feilen{' '}
                  <code className={styles.inlineCode}>
                    Dependencies lock file is not found
                  </code>{' '}
                  (i Steg 5):
                </strong>{' '}
                Pass på at{' '}
                <code className={styles.inlineCode}>package-lock.json</code> er
                committet og pushet. Hvis prosjektet ligger i en undermappe, må
                du legge til{' '}
                <code className={styles.inlineCode}>cache-dependency-path</code>{' '}
                under{' '}
                <code className={styles.inlineCode}>actions/setup-node@v4</code>{' '}
                og{' '}
                <code className={styles.inlineCode}>
                  defaults.run.working-directory
                </code>{' '}
                på jobben (se punkt 3 i Steg 5).
              </li>
            </ul>
          </StepCard>
        </main>
      </div>

      <footer className={styles.siteFooter}>
        <div className={styles.footerContainer}>
          <p className={styles.paragraph}>
            Laget for leksjonen{' '}
            <strong>Publisering til GitHub Pages med GitHub Actions</strong> med{' '}
            <fhi-link
              href="https://www.npmjs.com/package/@folkehelseinstituttet/designsystem"
              target="_blank"
            >
              <strong>@folkehelseinstituttet/designsystem</strong>
            </fhi-link>
            .
          </p>
        </div>
      </footer>

      <Confetti triggerKey={celebrationCount} />
    </div>
  )
}
