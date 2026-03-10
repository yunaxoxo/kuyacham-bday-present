const startBtn = document.getElementById("start-btn");
const flame = document.getElementById("main-flame");
const cake = document.getElementById("cake-body");
const msg = document.getElementById("msg");
const meterFill = document.getElementById("meter-fill");

let audioContext, analyser, dataArray, micStream;

startBtn.addEventListener("click", async () => {
  try {
    micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });

    startBtn.style.display = "none";
    msg.innerText = "💨 Make a wish and BLOW!";

    // Setup Audio API
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(micStream);

    source.connect(analyser);
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    checkVolume();
  } catch (err) {
    alert("Please allow microphone access to blow the candle!");
  }
});

function checkVolume() {
  if (flame.classList.contains("blown-out")) return;

  analyser.getByteFrequencyData(dataArray);

  // Focus on high frequencies (blowing sounds) for better accuracy
  // We ignore the low bass frequencies (indices 0-40)
  const highFreqs = dataArray.slice(40);
  const average = highFreqs.reduce((a, b) => a + b, 0) / highFreqs.length;

  // Update the visual meter (0 to 100%)
  const meterWidth = Math.min((average / 100) * 100, 100);
  meterFill.style.width = meterWidth + "%";

  // Threshold: If blow is strong enough, trigger blowout
  if (average > 40) {
    blowOut();
  } else {
    requestAnimationFrame(checkVolume);
  }
}

function blowOut() {
  // Shut down the mic hardware to stop the hiss
  if (micStream) {
    micStream.getTracks().forEach((track) => track.stop());
  }

  // Play the Party Sound
  const sound = document.getElementById("party-sound");
  sound.volume = 0.5;
  sound.play();

  // UI Updates
  meterFill.style.width = "0%";
  flame.classList.add("blown-out");
  cake.classList.add("is-blown");
  msg.innerText = "✨ HAPPY BIRTHDAY!! 🎈";

  // Confetti
  if (typeof confetti === "function") {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00"],
    });
  }
}
