import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import * as tf from "@tensorflow/tfjs";

const model = tf.loadModel(
  "https://gist.githubusercontent.com/xaris/d27a1c180134d00f96c34238f2e82e03/raw/8b3826daed80cd46c1c310efc3c550ed06872fb7/model.json"
);

ReactDOM.render(<App model={model} />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
