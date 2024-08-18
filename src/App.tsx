import "./App.css";
import { Settings, WifiPassword } from "@mui/icons-material";
import {
  Container,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useCallback, useEffect, useState } from "react";

import { WifiWizard2 } from "@awesome-cordova-plugins/wifi-wizard-2";
import { Esptouch } from "capacitor-esptouch";
import { Network } from "@capacitor/network";

const defaultTheme = createTheme();

function App() {
  const [configuring, setConfiguring] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [ssid, setSsid] = useState("");
  const [bssid, setBssid] = useState("");

  const handleClose = useCallback(() => {
    setSuccess(false);
    setError(false);
  }, [setSuccess, setError]);

  const handleConfigure = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setConfiguring(true);
      const timerId = setTimeout(async () => {
        await Esptouch.stop();
        setConfiguring(false);
        setError(true);
        console.error("Configuration timed out!");
      }, 60000);
      try {
        const ssid = (e.target as any).ssid.value;
        const bssid = (e.target as any).bssid.value;
        const password = (e.target as any).password.value;
        const svitlobotKey = (e.target as any).svitlobotKey.value;
        await Esptouch.start({
          ssid,
          bssid,
          password,
          customData: svitlobotKey,
        });
        setSuccess(true);
      } catch (e) {
        console.error(e);
        setError(true);
      }
      clearTimeout(timerId);
      setConfiguring(false);
    },
    [setSuccess, setError, setConfiguring]
  );

  useEffect(() => {
    const _doEffect = async () => {
      try {
        const ssid = await WifiWizard2.getConnectedSSID();
        const bssid = await WifiWizard2.getConnectedBSSID();
        setSsid(ssid);
        setBssid(bssid);
        console.log(`Connected to ${ssid} (${bssid})`);
      } catch (e) {
        console.error(e);
      }
    };
    _doEffect();
  }, [setSsid, setBssid]);

  useEffect(() => {
    Network.addListener("networkStatusChange", async (status) => {
      console.log("Network status changed", status);
      try {
        const ssid = await WifiWizard2.getConnectedSSID();
        const bssid = await WifiWizard2.getConnectedBSSID();
        setSsid(ssid);
        setBssid(bssid);
        console.log(`Connected to ${ssid} (${bssid})`);
      } catch (e) {
        console.error(e);
      }
    });
    return () => {
      Network.removeAllListeners();
    };
  }, [setSsid, setBssid]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <WifiPassword />
          </Avatar>
          <Typography component="h1" variant="h5">
            Налаштування пристрою SvitloPulse
          </Typography>
          <Box component="form" onSubmit={handleConfigure} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="ssid"
              label="Назва Wi-Fi мережі"
              name="ssid"
              disabled
              value={ssid}
            />
            <input type="hidden" name="bssid" value={bssid} id="bssid" />
            <TextField
              margin="normal"
              fullWidth
              name="password"
              label="Пароль Wi-Fi мережі"
              type="password"
              id="password"
              autoComplete="current-password"
              autoFocus
              disabled={configuring}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="svitlobotKey"
              label="Ключ Світлобот"
              id="svitlobotKey"
              autoComplete="svitlobot-key"
              InputProps={{ inputProps: { maxLength: 32 } }}
              disabled={configuring}
            />
            <LoadingButton
              loading={configuring}
              type="submit"
              fullWidth
              variant="contained"
              loadingPosition="start"
              sx={{ mt: 3, mb: 2 }}
              startIcon={<Settings />}
            >
              {configuring ? "Виконується налаштування" : "Налаштувати"}
            </LoadingButton>
          </Box>
        </Box>
        <Snackbar
          open={success || error}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={success ? "success" : error ? "error" : "info"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {success && "SvitloPulse налаштовано успішно!"}
            {error && "Сталася помилка налаштування"}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default App;
