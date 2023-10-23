import React, { useEffect } from "react";
// import PropTypes from "prop-types";
// import { DefaultButton } from "@fluentui/react";
// import Header from "./Header";
// import HeroList from "./HeroList";
// import Progress from "./Progress";
import TokenFile from "./TokenFile";

function App() {
  useEffect(() => {
    // ComponentDidMount equivalent code can go here.
    // For example, if you need to perform any actions when the component mounts.
  }, []);

  return (
    <div className="ms-welcome">
      <TokenFile />
    </div>
  );
}

export default App;
