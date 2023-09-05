import React from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";
import { StarRating } from "./StarRating";
import { useState } from "react";

const Starts = ({ color = "blue" }) => {
  const [MovieRating, SetMovieRating] = useState(0);
  return (
    <div>
      <StarRating color={color} setMovie={SetMovieRating} />
      <p>This movie was rated {MovieRating} Stars</p>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}

    <StarRating
      maxRating={5}
      size={40}
      message={["Not good", "Bad", "Good", "Amazing", "Excellent"]}
      defaultRating={3}
    />
    <StarRating maxRating={5} size={24} color={"red"} />
    <Starts />
  </React.StrictMode>
);
