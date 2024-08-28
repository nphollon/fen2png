function main() {
  const sq = 60;
  const canvas = document.getElementById("board-canvas");
  canvas.width = 8*sq;
  canvas.height = 8*sq;
  canvas.style.border = "1px solid black";

  const ctx = canvas.getContext("2d");
  ctx.scale(sq, sq);
  drawBoard(ctx);
  drawPieces(ctx);

  console.log(canvas.toDataURL());
}

function drawBoard(ctx) {
  const darkFillBackground = "#4D3848"
  const darkFillForeground = "#74586A";
  const lineDensity = 120;
  const lineWidth = 2/30;
  const lightFill = "#FFDCBD";

  ctx.fillStyle = darkFillBackground;
  ctx.fillRect(0, 0, 8, 8);

  ctx.strokeStyle = darkFillForeground;
  const dx = 16 / lineDensity;

  for (let i = 0; i < lineDensity; i++) {
    ctx.beginPath();
    ctx.lineWidth = (20 + i) * lineWidth / lineDensity;
    ctx.moveTo(i * dx, 0);
    ctx.lineTo(0, i * dx);
    ctx.stroke();
  }

  ctx.fillStyle = lightFill;

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if ((i + j) % 2 === 0) {
        ctx.fillRect(j, i, 1, 1);
      }
    }
  }
}

function drawPieces(ctx) {
  pieceType = "companion";
  const img = new Image();

  img.addEventListener("load", () => {
    ctx.drawImage(img, 0, 0, 1, 1);

    ctx.drawImage(img, 3, 4, 1, 1);
    console.log(canvas.toDataURL());
  });
  img.src = `images/piece/${pieceType}/bB.svg`;
}

main();