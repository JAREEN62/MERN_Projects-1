const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const fileInput = document.getElementById("fileInput");
const brightnessInput = document.getElementById("brightness-input");
const contrastInput = document.getElementById("contrast-input");
const saturationInput = document.getElementById("saturation-input");
const blurInput = document.getElementById("blur-input");
const grayScaleButton = document.getElementById("grayscale-btn");
const sepiaButton = document.getElementById("sepia-btn");
const resetButton = document.getElementById("reset-btn");
const downloadButton = document.querySelector(".downloadImgBtn");

let image = new Image();

let sepia = false;

fileInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
});

image.onload = () => {
  canvas.height = image.height;
  canvas.width = image.width;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
};

function applyFilters() {
  const brightnessValue = brightnessInput.value;
  const contrastValue = contrastInput.value;
  const saturationValue = saturationInput.value;
  const blurValue = blurInput.value;
  const sepiaValue = sepia ? 100 : 0;

  ctx.filter = `brightness(${brightnessValue}%)contrast(${contrastValue}%)saturate(${saturationValue}%)blur(${blurValue}px)sepia(${sepiaValue}%)`;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}

function applyGrayScale() {
  saturationInput.value = 0;
  applyFilters();
}

function applySepiaEffect() {
  sepia = !sepia;

  if (sepia) {
    sepiaButton.style.backgroundColor = "#F7E396";
  } else {
    sepiaButton.style.backgroundColor = "#607b8f";
  }
  applyFilters();
}

function resetCanvas() {
  brightnessInput.value = 100;
  contrastInput.value = 100;
  saturationInput.value = 100;
  blurInput.value = 0;
  sepia = false;
  sepiaButton.style.backgroundColor = "#607b8f";
  applyFilters();
}

function downloadCanvasImage() {
  const imageData = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = "photon-lab-editted.png";
  console.log("ImageData", imageData);
  link.href = imageData;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

brightnessInput.addEventListener("input", applyFilters);
contrastInput.addEventListener("input", applyFilters);
saturationInput.addEventListener("input", applyFilters);
blurInput.addEventListener("input", applyFilters);
grayScaleButton.addEventListener("click", applyGrayScale);
sepiaButton.addEventListener("click", applySepiaEffect);
resetButton.addEventListener("click", resetCanvas);
downloadButton.addEventListener("click", downloadCanvasImage);