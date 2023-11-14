export const navBar = {
  backgroundColor: "black",
};

export const containerBox = {
  margin: "5px",
};

export const redFF = {
  color: "#FF6000",
  fontWeight: "bolder",
};

export const redFFBackground = {
  backgroundColor: "#FF6000",
  color: "white",
};

export const grayFF = "rgba(204,204,204,1)";
export const grayFFTr = "rgba(204,204,204,0.9)";

export const toolbar = {
  background: grayFF,
  borderRadius: "30px 30px 0px 0px",
  marginTop: "10px",
  marginRight: "15px",
  marginLeft: "15px",
  cursor: "pointer"
};
export const menuList = {
  background: grayFF,
  borderRadius: "0px 0px 30px 30px",
  marginRight: "15px",
  marginLeft: "15px",
};

export const moduleTitleBox = {
  backgroundColor: redFFBackground,
  width: "80%",
  padding: "1%",
  borderRadius: "15px 15px 0px 0px",
  margin: "0 auto",
  display: "flex",
  boxShadow: "0px 0px 20px black inset",
  height: "50px"
};

export const moduleTitle = {
  flexGrow: 11,
  display: "flex",
  alignItems: "center",
  marginLeft: "5%",
  fontSize: "20px",
};

export const fullBox = {
  flexGrow: 1,
  display: "flex",
  alignItems: "center",
};

export const bigButtonWhite = {
  color: "primary.light",
  fontSize: "30px",
};
export const bigButtonOrange = {
  color: redFF,
  fontSize: "50px",
};

export const tableContainer = {
  width: 1,
  "& .super-app-theme--header": {
    backgroundColor: grayFF,
    color: "rgba(84,84,84,1)",
    borderRadius: "18px 18px 0px 0px",
  },
};

export const tableGrid = {
  padding: "0.5%",
  backgroundColor: grayFF,
  borderRadius: "15px",
  boxShadow: "0px 0px 15px black inset",
};

export const centerMargin = {
  margin: "0 auto",
};

export const saveButton = {
  backgroundColor: "black",
  color: "white",
  "&:hover": {
    backgroundColor: redFFBackground,
  },
};

export const hidden = {
  display: "none"
}

export const loadingImage = {
  backgroundImage: "url('/loading.gif')",
  backgroundSize: "100% 100%",
  width: "130px",
  height: "100px",
  padding: "0",
  margin: "0 auto",
  color: "#DA1921"
}

export const stackMargin = {
  marginBottom: '10px'
}