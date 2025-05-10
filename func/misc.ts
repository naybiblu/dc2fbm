import colors from "colors";

export function goodLog 
(
    provider: string, 
    message: string
) {
      console.log(colors.green.bold(`[${provider}]: `) + colors.green(`${message}`));
};

export function badLog
(
    provider: string, 
    message: string, 
    err?: undefined
) {
    console.log(colors.red.bold(`[${provider}]: `) + colors.red(`${message}\n${err}`));
};
