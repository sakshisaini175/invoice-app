# Invoice Studio

A static invoice generator built with HTML, CSS, and JavaScript.

## Run locally

From this folder, start a local server:

```powershell
python -m http.server 8000
```

Open <http://localhost:8000>.

## Deploy on Vercel

### Option 1: Vercel dashboard

1. Push this project folder to a GitHub, GitLab, or Bitbucket repository.
2. Sign in at <https://vercel.com>.
3. Select **Add New Project** and import the repository.
4. Use these project settings:
   - **Framework Preset:** Other
   - **Root Directory:** `./` (or the folder containing `index.html`)
   - **Build Command:** leave empty
   - **Output Directory:** leave empty
   - **Install Command:** leave empty
5. Select **Deploy**.
6. Open the generated `vercel.app` URL.

Vercel serves `index.html` directly. No API, database, environment variables, or build process is required.

### Option 2: Vercel CLI

Install and sign in once:

```powershell
npm install -g vercel
vercel login
```

From this project folder, deploy:

```powershell
vercel
```

Accept the defaults when prompted. For a production deployment:

```powershell
vercel --prod
```

## Important behavior

- Invoice numbering is stored in each browser's `localStorage`; it is not shared between users or devices.
- The **Download PDF** action opens the browser print dialog. Select **Save as PDF** and turn off **Headers and footers** to keep the invoice page identical to the reference PDF.
- Changes pushed to the connected Git repository automatically create a new Vercel deployment.
