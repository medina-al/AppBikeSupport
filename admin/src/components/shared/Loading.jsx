import React from "react";

import { loadingImage } from "./styles/MUIStyles";

function Loading() {
  return (
    <div style={loadingImage} className="text-center">
        <br /><br /><br />
        Loading
    </div>
  );
}

export default Loading;
