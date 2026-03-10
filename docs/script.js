const startBtn = document.getElementById("start-btn");
const flame = document.getElementById("main-flame");
const cake = document.getElementById("cake-body");
const video = document.getElementById("webcam");
const msg = document.getElementById("msg");

let audioContext, analyser, dataArray, micStream;

startBtn.addEventListener("click", async () => {
  try {
    // Request mic/video.
    // keep echoCancellation/noiseSuppression off to hear the "blow" hiss better.
    micStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: { echoCancellation: false, noiseSuppression: false },
    });

    // video element is muted to prevent feedback "static"
    video.srcObject = micStream;
    video.muted = true;

    startBtn.style.display = "none";
    msg.innerText = "💨 BLOW into the mic!";

    // Web Audio API
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(micStream);

    source.connect(analyser);

    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    checkVolume();
  } catch (err) {
    console.error(err);
    alert("Microphone permission is required for the birthday surprise!");
  }
});

function checkVolume() {
  // Stop the loop if the candle is already out
  if (flame.classList.contains("blown-out")) return;

  analyser.getByteFrequencyData(dataArray);

  // Calculate average volume
  let average = dataArray.reduce((a, b) => a + b) / dataArray.length;

  // Threshold check
  if (average > 40) {
    blowOut();
  } else {
    requestAnimationFrame(checkVolume);
  }
}

function blowOut() {
  //  Stops the static hiss
  if (micStream) {
    micStream.getTracks().forEach((track) => track.stop());
  }

  // Close the Audio Processing
  if (audioContext) {
    audioContext.close();
  }

  // Visual effects
  flame.classList.add("blown-out");
  cake.classList.add("is-blown");
  msg.innerText = "HAPPY BIRTHDAY!!🎈🎈🎈";

  // Confetti trigger
  if (typeof confetti === "function") {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  }
}
