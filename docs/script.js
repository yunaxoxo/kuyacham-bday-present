const startBtn = document.getElementById("start-btn");
const flame = document.getElementById("main-flame");
const cake = document.getElementById("cake-body");
const msg = document.getElementById("msg");
const meterFill = document.getElementById("meter-fill");
const partySound = document.getElementById("party-sound");

let audioContext, analyser, dataArray, micStream;

startBtn.addEventListener("click", async () => {
  partySound.volume = 0; // mute
  partySound
    .play()
    .then(() => {
      partySound.pause();
      partySound.currentTime = 0;
      partySound.volume = 0.7;
    })
    .catch((e) => console.log("Audio priming failed:", e));

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

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(micStream);

    source.connect(analyser);
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    checkVolume();
  } catch (err) {
    alert("Please allow microphone access!");
  }
});

function checkVolume() {
  if (flame.classList.contains("blown-out")) return;

  analyser.getByteFrequencyData(dataArray);
  const highFreqs = dataArray.slice(40);
  const average = highFreqs.reduce((a, b) => a + b, 0) / highFreqs.length;

  const meterWidth = Math.min((average / 100) * 100, 100);
  meterFill.style.width = meterWidth + "%";

  if (average > 35) {
    blowOut();
  } else {
    requestAnimationFrame(checkVolume);
  }
}

function blowOut() {
  partySound.play();

  // Shut down mic hardware
  if (micStream) {
    micStream.getTracks().forEach((track) => track.stop());
  }

  // Visuals
  meterFill.style.width = "0%";
  flame.classList.add("blown-out");
  cake.classList.add("is-blown");
  msg.innerText = "✨ HAPPY BIRTHDAY!! 🎈";

  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
  });
}
