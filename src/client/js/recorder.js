const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

const handleStart = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: { width: 300, height: 200 },
  });
  video.srcObject = stream;
  video.play();
};

startBtn.addEventListener("click", handleStart);
