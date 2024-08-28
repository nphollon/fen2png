function main() {
  const fen = "";
  const boardState = parseFEN(fen);
  draw(boardState).then(download);
}

function parseFEN() {
  return;
}

function draw(boardState) {
  return new Promise((resolve, reject) => {
    loadPieceImages().then((pieces) => {
      const sq = 60;
      const canvas = document.getElementById("board-canvas");
      canvas.width = 8*sq;
      canvas.height = 8*sq;
      const ctx = canvas.getContext("2d");
      ctx.scale(sq, sq);

      drawBoard(ctx);
      placePieces(ctx, pieces, boardState);
      resolve(canvas);
    });
  });
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

function placePieces(ctx, images, boardState) {
  ctx.drawImage(images["bB"], 0, 0, 1, 1);
  ctx.drawImage(images["bB"], 3, 4, 1, 1);
}

function loadPieceImages() {
  return new Promise((resolve) => {
    const pieceType = "companion";
    const pieceNames = [ "bP", "bN", "bB", "bR", "bQ", "bK", "wP", "wN", "wB", "wR", "wQ", "wK" ];
    const images = {};

    let loadingImages = pieceNames.length;

    function onLoad() {
      loadingImages--;
      if (loadingImages <= 0) {
        resolve(images);
      }
    }

    pieceNames.forEach((piece) => {
      const img = new Image();
      img.addEventListener("load", onLoad);
      img.src = `images/piece/${pieceType}/${piece}.svg`;
      images[piece] = img;
    });
  });
}

function download(canvas) {
  console.log(canvas.toDataURL());
}

main();