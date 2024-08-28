const canvas = document.getElementById("board-canvas");
canvas.width = 1000;
canvas.height = 1000;

const ctx = canvas.getContext("2d");

ctx.fillStyle = "green";
ctx.fillRect(10, 10, 150, 100);

const img = document.getElementById("bB");

img.addEventListener("load", () => {
  ctx.drawImage(img, 0, 0, 50, 50);
  console.log(canvas.toDataURL());
});


console.log(canvas.toDataURL());
