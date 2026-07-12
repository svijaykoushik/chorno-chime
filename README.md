<p align="center">
  <img src="chrono-chime-icon-192.png" alt="ChronoChime Logo" width="128" height="128">
</p>

<h1 align="center">ChronoChime Landing Page</h1>

<p align="center">
  The official, high-performance landing page for the <strong><a href="https://github.com/svijaykoushik/chrono-chime-desktop">ChronoChime Desktop</a></strong> application. Built for lightning-fast loading speeds (FCP & LCP optimized) and styled under the signature <em>Aesthetic Bubblegum Pink</em> brand guidelines.
</p>

---

## ⏰ About ChronoChime Desktop

ChronoChime is a calm, local-first temporal notification companion. It helps users stay aware of time passing by answering two simple questions: *When should the user be notified?* and *How should the user be notified?*

*   **Reliable Timing:** Precise scheduling, drift prevention, and recovery from sleep/system interruptions.
*   **Custom Sounds:** Built-in chimes or support for custom device audio.
*   **Composite Routines:** Multi-step temporal workflows (e.g., Pomodoro sessions, study/workout intervals) handled as first-class composite entities.
*   **Quiet Hours:** Focus windows that automatically suppress notification sounds.
*   **Local-First & Private:** Powered by a local SQLite database with zero cloud connections and zero telemetry tracking.

---

## ⚡ Landing Page Features

This repository hosts the static landing page (`index.html`) engineered to showcase and distribute the desktop application:

*   **Fast First Contentful Paint (FCP):** Critical CSS is inlined directly in the `<head>` of `index.html`. External assets and Google Fonts (`Poppins`, `Outfit`) are loaded progressively with `font-display: swap` to prevent render blocking and text flickering.
*   **Fast Largest Contentful Paint (LCP):** The main hero image uses `fetchpriority="high"`. Images below the fold are lazy-loaded to optimize initial load times.
*   **Zero Layout Shift (CLS):** Every visual element has pre-allocated layout space using precise sizes and aspect-ratios.
*   **Smart OS Detection:** Simple client-side script detects if the visitor is on Linux or Windows, instantly highlighting the corresponding installer action button.

---

## 🚀 Deployment

The landing page is hosted using **Firebase Hosting** and is configured to auto-deploy.

### Automated CI/CD
A GitHub Action workflow is configured in `.github/workflows/deploy-firebase.yml`. Every push or merge to the `main` branch automatically deploys the latest version of the landing page to Firebase Hosting.

### Local Development
To preview the landing page locally:
1. Clone the repository:
   ```bash
   git clone https://github.com/svijaykoushik/chorno-chime.git
   cd chorno-chime
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the preview server:
   ```bash
   npm run preview
   ```
   This will serve the site at `http://localhost:8000`.

Alternatively, open `index.html` directly in your browser for a quick preview without a server.

---

## 📁 Repository Structure

*   `index.html` - The single-page landing website.
*   `firebase.json` & `.firebaserc` - Firebase Hosting configurations.
*   `chrono-chime-icon-*.png` - App logo icons.
*   `screenshot*.jpeg` - Desktop screenshots showing the UI.

---

## 📄 License

This project is licensed under the MIT License.
