# 🎂 Interactive Birthday Cake Blower

A unique, interactive web application built to celebrate a special birthday. This project allows the user to **physically blow** into their device's microphone to "extinguish" a digital birthday candle and trigger a confetti celebration.

## ✨ Features

- **Microphone Detection:** Uses the **Web Audio API** to detect the frequency and volume of a "blow" or "whoosh" sound.
- **CSS Animations:** A custom-built cake and flickering flame created entirely with CSS.
- **Real-time Interaction:** The flame reacts instantly to sound, disappearing with a "smoke" effect.
- **Celebration:** Integrated with the `canvas-confetti` library for a professional-grade party finish.
- **Mobile Friendly:** Optimized for mobile browsers with `playsinline` video and touch-responsive UI.

## 🛠️ Technologies Used

- **HTML5 / CSS3** (Custom animations & layout)
- **JavaScript (ES6+)**
- **Web Audio API** (For sound analysis)
- **MediaDevices API** (To access the camera and microphone)
- **Canvas-Confetti** (For the celebration effects)

## 📂 File Structure

This project follows the GitHub `/docs` folder convention for deployment:

```text
├── README.md
└── docs/
    ├── index.html
    ├── style.css
    └── script.js
```
