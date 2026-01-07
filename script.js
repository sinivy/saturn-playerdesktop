document.addEventListener("DOMContentLoaded", () => {

  // ===== ELEMENTOS =====
  const audio = document.getElementById("audio");
  const playPauseBtn = document.getElementById("playPause");
  const playPauseIcon = document.getElementById("btnPlayImg");
  const progressBar = document.getElementById("progressBar");
  const fileInput = document.getElementById("fileInput");
  const dropArea = document.getElementById("dropArea");
  const coverImage = document.getElementById("coverImage");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  const btnMin = document.getElementById("btnMin");
  const btnClose = document.getElementById("btnClose");
  const iconMin = document.getElementById("iconMin");
  const iconClose = document.getElementById("iconClose");

  // ===== PROTEÇÃO =====
  if (!window.assetPaths || !window.electronAPI) {
    console.error("Preload não carregou corretamente");
    return;
  }

  // ===== ASSETS =====
  iconMin.src = window.assetPaths.asset("icon-min.png");
  iconClose.src = window.assetPaths.asset("icon-close.png");
  coverImage.src = window.assetPaths.asset("default-cover2.png");
  playPauseIcon.src = window.assetPaths.asset("btn-play.png");

  // ===== CONTROLES DA JANELA =====
  btnMin.addEventListener("click", () => window.electronAPI.minimize());
  btnClose.addEventListener("click", () => window.electronAPI.close());

  // ===== PLAYER =====
  let playlist = [];
  let currentIndex = -1;
  let isPlaying = false;

  function loadSong(index) {
    const song = playlist[index];
    if (!song) return;

    audio.src = song.url;
    audio.load();
    document.querySelector(".song-title").textContent = song.name;
    coverImage.style.display = "block";

    isPlaying = false;
    playPauseIcon.src = window.assetPaths.asset("btn-play.png");
  }

  function handleFiles(files) {
    for (const file of files) {
      if (!file.type.startsWith("audio/")) continue;

      const url = URL.createObjectURL(file);
      playlist.push({
        name: file.name.replace(/\..+$/, ""),
        url
      });
    }

    if (currentIndex === -1 && playlist.length) {
      currentIndex = 0;
      loadSong(currentIndex);
    }
  }

  // ===== CONTROLES DO PLAYER =====
  playPauseBtn.addEventListener("click", () => {
    if (!audio.src) return;

    if (isPlaying) {
      audio.pause();
      playPauseIcon.src = window.assetPaths.asset("btn-play.png");
    } else {
      audio.play();
      playPauseIcon.src = window.assetPaths.asset("btn-pause.png");
    }

    isPlaying = !isPlaying;
  });

  nextBtn.addEventListener("click", () => {
    if (!playlist.length) return;
    currentIndex = (currentIndex + 1) % playlist.length;
    loadSong(currentIndex);
  });

  prevBtn.addEventListener("click", () => {
    if (!playlist.length) return;
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentIndex);
  });

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    progressBar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
  });

  // ===== DRAG & DROP =====
  dropArea.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", e => {
    handleFiles(e.target.files);
  });

  dropArea.addEventListener("dragover", e => {
    e.preventDefault();
    dropArea.classList.add("dragover");
  });

  dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("dragover");
  });

  dropArea.addEventListener("drop", e => {
    e.preventDefault();
    dropArea.classList.remove("dragover");
    handleFiles(e.dataTransfer.files);
  });

});