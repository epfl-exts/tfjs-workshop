import React, { useEffect, useState } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";

function App({ model }) {
  let ref = React.createRef();

  return (
    <div className="App">
      <Canvas ref={ref} />
      <Controls theCanvas={ref} model={model} />
    </div>
  );
}

function Controls({ theCanvas, model }) {
  let [prediction, setLabel] = useState(""); // Sets default label to empty string.

  const labels = [
    "bird",
    "book",
    "car",
    "cat",
    "chair",
    "flower",
    "plane",
    "sheep",
    "ship",
    "strawberry"
  ];
  const predictedLabel = labels[prediction];

  return (
    <div>
      <button
        onClick={() => {
          const canvas = theCanvas.current;
          const ctx = canvas.getContext("2d");
          ctx.fillRect(0, 0, canvas.height, canvas.width);
        }}
      >
        Clear the canvas.
      </button>
      <button
        onClick={() => {
          const tensor = preprocessCanvas(theCanvas.current);
          const prediction = model.then(result =>
            result.predict(tensor).data()
          );
          prediction.then(result => setLabel(indexOfMax(result)));
        }}
      >
        Predict the drawing.
      </button>
      <SVG label={predictedLabel} />
    </div>
  );
}

function preprocessCanvas(canvas) {
  // resize the input image to CNN's target size of (1, 28, 28)
  let tensor = tf
    .fromPixels(canvas)
    .resizeNearestNeighbor([28, 28])
    .mean(2)
    .expandDims(2)
    .expandDims()
    .toFloat();
  return tensor.div(255.0);
}

function indexOfMax(arr) {
  if (arr.length === 0) {
    return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}

function SVG({ label }) {
  const colors = ["#f54123", "#37bbe4", "f45844", "3dbd5d", "ee8012"];
  const letters =
    label &&
    label
      .toUpperCase()
      .split("")
      .map((letter, i) => {
        const rand = Math.floor(Math.random() * Math.floor(colors.length - 1));
        const fill = colors[rand];

        return (
          <tspan key={i} fill={fill}>
            {letter}
          </tspan>
        );
      });

  return (
    <svg id="prediction" width="300" height="150">
      <text x="15" y="90" fontSize="64px" fontFamily="'Leckerli One', cursive">
        {letters}
      </text>
    </svg>
  );
}

const Canvas = React.forwardRef((props, ref) => {
  let mouseDown = false;
  let lastX;
  let lastY;

  const handleMouseup = () => {
    mouseDown = false;
    [lastX, lastY] = [undefined, undefined];
  };

  const handleMousemove = e => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (mouseDown) {
      [lastX, lastY] = drawLine(e.target, x, y, lastX, lastY);
    }
  };

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.height, canvas.width);
  });

  return (
    <canvas
      height={300}
      width={300}
      ref={ref}
      onMouseDown={() => (mouseDown = true)}
      onMouseUp={handleMouseup}
      onMouseMove={e => handleMousemove(e)}
    />
  );
});

function drawLine(canvas, x, y, lastX, lastY) {
  let ctx = canvas.getContext("2d");

  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 12;
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.stroke();

  return [x, y];
}

export default App;
