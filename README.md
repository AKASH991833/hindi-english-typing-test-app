# Type Fast - Hindi + English Typing Test

Free Hindi and English typing speed test with WPM, accuracy, Inscript keyboard mode and score history.

**Live app:** https://akash991833.github.io/hindi-english-typing-test-app/

Free, no sign-up, no ads. Works in the browser, offline after the first visit, and can be installed on your phone (Chrome menu > Add to Home screen / Install app). Everything is saved on your device only.

## Features

- English and Hindi (Devanagari) passages, 1 / 2 / 3 / 5 minute tests
- Live timer, WPM and accuracy; correct, wrong and current letters highlighted
- Result with net WPM, gross WPM, accuracy and number of errors; best score tracking
- Optional Inscript keyboard mode: type Hindi on a normal English keyboard (with key chart)
- Score history with a trend line
- Paste is blocked, Backspace allowed; dark and light mode; works offline, installable

## How to use

1. Pick English or Hindi and the test time.
2. Click the typing box and start typing. The timer starts on the first key.
3. For Hindi on a computer, either use your OS Hindi keyboard or tick "Inscript keyboard mode" and use the key chart.
4. On a phone, use your Hindi keyboard (for example Gboard) and keep Inscript mode off.

## Screenshots

<img src="screenshots/1-english-test.png" width="240" alt="1-english-test">
<img src="screenshots/2-result.png" width="240" alt="2-result">
<img src="screenshots/3-hindi-test.png" width="240" alt="3-hindi-test">
<img src="screenshots/4-history.png" width="240" alt="4-history">

![desktop](screenshots/5-desktop.png)

## Good to know (limits)

- Net WPM = correct characters / 5 / minutes, for both languages. Government exams such as CPCT or court typing tests use their own rules, so treat this as practice, not an exact exam score.
- Hindi accuracy is checked per letter cluster (consonant plus matra). Passages avoid letters that need extra Inscript key combinations (such as nukta and ऑ).
- Hindi passages and the Inscript layout follow the standard Inscript layout; check unusual keyboards.
- Scores are saved only in your browser.

## Run it yourself

No build step. Clone the repo and open `index.html`, or serve the folder with any static server:

```bash
git clone https://github.com/AKASH991833/hindi-english-typing-test-app.git
cd hindi-english-typing-test-app
python3 -m http.server 8080
```

Plain HTML, CSS and JavaScript. No tracking, no external requests (fonts, scripts and data are all local).

## Privacy

No account, no server, no analytics. Data stays in your browser's local storage. Clearing browser data deletes it, so use the Backup option if it matters.

## License

MIT
