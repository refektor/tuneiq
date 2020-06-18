import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#DB5461",
        },
        error: {
            main: red.A400,
        },
        text: {
            primary: "#3D5467",
            secondary: "#fff",
            hint: "#3D5467",
        },
        background: {
            default: "#F1EDEE",
        },
    }
});

export default theme;
