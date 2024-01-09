const { set } = require("mongoose");

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

let videoPlayStatus = false;
let setVideoPlayStatus = false;

const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMuteClick = (e) => {
  if (video.muted) {
    video.muted = false;
    video.volume = volumeValue;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleInputVolumeRange = (event) => {
  const {
    target: { value },
  } = event;

  if (video.muted) {
    video.muted = false;
    muteBtnIcon.classList = "fas fa-volume-up";
  }
  if (value === "0") {
    video.muted = true;
    muteBtnIcon.classList = "fas fa-volume-mute";
  }
  video.volume = value;
};

const handleChangeVolumeRange = (event) => {
  const {
    target: { value },
  } = event;

  if (value !== "0") {
    volumeValue = value;
  }
};

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substring(14, 19);

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currenTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  if (!setVideoPlayStatus) {
    videoPlayStatus = video.paused ? false : true;
    setVideoPlayStatus = true;
  }
  video.pause();
  video.currentTime = value;
};

const handleTimelineSet = () => {
  videoPlayStatus ? video.play() : video.pause();
  setVideoPlayStatus = false;
};

const handleFullscreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleInputVolumeRange);
volumeRange.addEventListener("change", handleChangeVolumeRange);
video.addEventListener("loadeddata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
timeline.addEventListener("change", handleTimelineSet);
fullScreenBtn.addEventListener("click", handleFullscreen);
