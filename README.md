# Invoice Studio

Invoice Studio is a static single-page invoice generator for a service business. It is designed to let a user enter invoice details, preview the output live, add or remove line items, and print the final invoice as a PDF using the browser's print dialog.

## Project architecture

This project is intentionally simple and does not use a framework, build step, backend, or database.

- `index.html`  
  Contains the page structure for the invoice editor and the live preview panel. The form includes business information, client details, invoice number, issue date, payment details, and editable line items.

- `styles.css`  
  Holds the entire design system for the app, including the editor layout, preview styling, and print-specific rules for generating a clean A4 invoice.

- `script.js`  
  Handles all dynamic behavior:
  - generates the next invoice number
  - stores the number in `localStorage`
  - creates and removes line items
  - recalculates totals as values change
  - updates the preview in real time
  - resets the form for a new invoice
  - triggers the browser print flow for PDF export

- `Logo/`  
  Contains the branding asset used in the header of the app.

## Core behavior

- Invoice numbering is stored in the browser using `localStorage`, so it increments on the current device only.
- The app updates the invoice preview immediately as the user edits fields.
- Each line item includes a description, quantity, and hourly or fixed rate.
- The total is computed automatically from the line items.
- The "New invoice" action resets the date and invoice number flow for a new document.
- The "Download PDF" button does not export a file directly; it opens the browser print dialog where the user selects "Save as PDF".

## File flow

1. The page loads and initializes the invoice app on `DOMContentLoaded`.
2. `prepareInvoice()` assigns the next invoice number and today's date.
3. The preview is rendered from the current form values via `renderPreview()`.
4. Input listeners keep the preview synchronized with user edits.
5. The PDF action stores the next number and calls `window.print()`.

## Run locally

From the project folder, start a local web server:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Deploy to Vercel

Because this is a static site, deployment is straightforward.

### Option 1: Vercel dashboard

1. Push the project to a GitHub/GitLab/Bitbucket repository.
2. Sign in to Vercel.
3. Select **Add New Project** and import the repository.
4. Use these settings:
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: leave empty
   - Output Directory: leave empty
   - Install Command: leave empty
5. Click **Deploy**.

### Option 2: Vercel CLI

```powershell
npm install -g vercel
vercel login
vercel
```

For a production deployment:

```powershell
vercel --prod
```

## Notes

- There is no backend, database, or API service in this app.
- The invoice is designed for print-first output and is optimized for an A4 portrait layout.
- The current configuration is tailored to a specific HVAC/maintenance business profile but can be adjusted by editing the values in `index.html` and the logic in `script.js`.
