const canvas = new fabric.Canvas("canvas");
const toggleDrawButton = document.getElementById("toggleDraw");

let isDrawingMode = false;
let dots = []; 
let currentLine;

canvas.on("mouse:down", (options) => {     
  if (!isDrawingMode) return;

  const pointer = canvas.getPointer(options.e);

  if (dots.length > 0 && dots[0].fill === "red") {
    const distance = Math.sqrt(
      Math.pow(pointer.x - dots[0].left, 2) +
        Math.pow(pointer.y - dots[0].top, 2)
    );

    if (distance < 10) {
      completeDrawing();
      return;
    }
  }

  const dot = new fabric.Circle({
    left: pointer.x,
    top: pointer.y,
    radius: 3,
    fill: dots.length === 0 ? "red" : "green",
    selectable: false,
    evented: false,
  });

  canvas.add(dot);
  dots.push(dot);

  if (dots.length > 1) {
    currentLine = new fabric.Line(
      [
        dots[dots.length - 2].left,
        dots[dots.length - 2].top,
        dot.left,
        dot.top,
      ],
      {
        fill: "black",
        stroke: "black",
        strokeWidth: 2,
        selectable: false,
        evented: false,
      }
    );

    canvas.add(currentLine);
  }
});

toggleDrawButton.addEventListener("click", () => {
  isDrawingMode = !isDrawingMode;
  toggleDrawButton.textContent = isDrawingMode
    ? "Deactivate Draw"
    : "Activate Draw";

  if (!isDrawingMode) {
    completeDrawing();
  }
});

function completeDrawing() {
  if (dots.length > 1) {
    canvas.remove(currentLine);
    const pathData = dots.map((dot) => `${dot.left},${dot.top}`).join(" L ");
    const path = new fabric.Path(`M ${pathData}`, {
      strokeWidth: 2,
      fill: "none",
      stroke: "black",
      selectable: false,
      evented: false,
    });

    canvas.add(path);
    canvas.remove(...dots);
    dots = [];
    canvas.renderAll();
  }
}
