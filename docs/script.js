const startBtn = document.getElementById("start-btn");
const flame = document.getElementById("main-flame");
const cake = document.getElementById("cake-body");
const video = document.getElementById("webcam");
const msg = document.getElementById("msg");

let audioContext, analyser, dataArray;

startBtn.addEventListener("click", async () => {
  try {
    // Request raw audio to capture the "whoosh" of blowing
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: { echoCancellation: false, noiseSuppression: false },
    });

    video.srcObject = stream;
    startBtn.style.display = "none";
    msg.innerText = "💨 BLOW into the mic!";

    // Setup Web Audio API
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    checkVolume();
  } catch (err) {
    alert("Permission needed!");
  }
});

function checkVolume() {
  if (flame.classList.contains("blown-out")) return;

  analyser.getByteFrequencyData(dataArray);
  let average = dataArray.reduce((a, b) => a + b) / dataArray.length;

  // Threshold 40
  if (average > 40) {
    blowOut();
  } else {
    requestAnimationFrame(checkVolume);
  }
}

function blowOut() {
  flame.classList.add("blown-out");
  cake.classList.add("is-blown");
  msg.innerText = "HAPPY BIRTHDAY!!🎈🎈🎈";

  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
  });
}
