import React from "react";
import { useState } from "react";

function TextExpander({
  collapsedNumWords,
  expandButtonText = "Show less",
  collapseButtonText,
  buttonColor,
  expanded,
  className,
  children,
}) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const buttonStyle = {
    border: "none",
    marginLeft: "0.5rem",
    backgroundColor: "transparent",
    cursor: "pointer",
    color: buttonColor,
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    console.log(isExpanded);
  };

  let whattoshow = children.length;
  const displayText = isExpanded
    ? children
    : children.substring(0, whattoshow / 2) + "...";

  return (
    <div className={className} style={{ width: "80%", margin: "10px auto" }}>
      {displayText}
      <button type="button" style={buttonStyle} onClick={handleExpand}>
        {isExpanded ? expandButtonText : "Show more"}
      </button>
    </div>
  );
}

export const Challenge = () => {
  return (
    <div>
      <TextExpander expanded={true} buttonColor={"green"}>
        Space travel is the ultimate adventure! Imagine soaring past the stars
        and exploring new worlds. It's the stuff of dreams and science fiction,
        but believe it or not, space travel is a real thing. Humans and robots
        are constantly venturing out into the cosmos to uncover its secrets and
        push the boundaries of what's possible.
      </TextExpander>

      <TextExpander
        expanded={false}
        collapsedNumWords={20}
        expandButtonText="Show More"
        collapseButtonText="Show Less"
        buttonColor="#ff6622"
      >
        Space travel requires some seriously amazing technology and
        collaboration between countries, private companies, and international
        space organizations. And while it's not always easy (or cheap), the
        results are out of this world. Think about the first time humans stepped
        foot on the moon or when rovers were sent to roam around on Mars.
      </TextExpander>

      <TextExpander expanded={true} className="box" buttonColor={"blue"}>
        Space missions have given us incredible insights into our universe and
        have inspired future generations to keep reaching for the stars. Space
        travel is a pretty cool thing to think about. Who knows what we'll
        discover next!
      </TextExpander>
    </div>
  );
};
