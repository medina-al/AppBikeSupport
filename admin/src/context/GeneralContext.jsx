import { lazy, Suspense } from "react";
import { createContext, useState, useMemo} from "react";

export const GeneralContext = createContext();

// Material resources
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
// Custom resources
import {
  dialogGeneral,
  dialogTitleStyle,
  dialogFooter,
} from "../components/shared/styles/DialogGeneralStyles";

export function GeneralContextProvider(props) {
  //Set Dialog properties
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("Empty Dialog");
  const [component, setComponent] = useState("");
  const [params, setParams] = useState([]);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const handleOpen = (dialogTitle, component, params) => {
    setComponent(component);
    setDialogTitle(dialogTitle);
    setParams(params);
    setOpen(true);
  };
  const [refreshInfo,setRefreshInfo] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  //Set Message Snackbar properties
  const [openMessage, setOpenMessage] = useState(false);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  
  const openMessageUM = useMemo(() => ({
    openMessage, setOpenMessage
  }), [openMessage]);

  const messageUM = useMemo(() => ({
    message, setMessage
  }), [message]);

  const messageTypeUM = useMemo(() => ({
    messageType, setMessageType
  }), [messageType]);

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  const ComponentToShow = lazy(() => import(component));
  return (
    <GeneralContext.Provider
      value={{
        open,
        dialogTitle,
        handleOpen,
        handleClose,
        setMessage,
        setMessageType,
        setOpenMessage,
        refreshInfo,
        setRefreshInfo
      }}
    >
      {props.children}
      {message && (
        <Snackbar
          key={new Date()}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={openMessage}
          autoHideDuration={6000}
          onClose={handleCloseMessage}
          transitionDuration={2000}
        >
          <Alert severity={messageType}>{message}</Alert>
        </Snackbar>
      )}
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        transitionDuration={{ enter: 1500, exit: 2200 }}
        sx={dialogGeneral}
      >
        <DialogTitle id="responsive-dialog-title" sx={dialogTitleStyle}>
          {dialogTitle}
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText component={"span"}>
            <Suspense fallback={<span>Loading...</span>}>
              <ComponentToShow params={params} />
            </Suspense>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={dialogFooter}>
          <Button variant="contained" color="primary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </GeneralContext.Provider>
  );
}
