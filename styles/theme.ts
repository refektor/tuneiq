import { createMuiTheme } from "@material-ui/core/styles";
import { red, blue } from "@material-ui/core/colors";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "rgba(255, 130, 80, 0.8)",
        },
        error: {
            main: red.A400,
        },
        text: {
            primary: "rgba(255, 130, 80, 0.8)",
            secondary: "#fff",
            hint: "rgba(255, 255, 255, 0.3)"
        },
        background: {
            default: "rgba(0, 25, 75, 0.9)",
        },
    }
});

export default theme;
