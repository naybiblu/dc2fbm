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

export function unixify
(
    date: any
) {
  return Math.floor(new Date(date).getTime() / 1000); 
};

export function sortToNewest
(
    array: any, 
    timeField: any
) {
  array.sort((a: any, b: any) => {
    const dateA: any = new Date(unixify(a[timeField]));
    const dateB: any = new Date(unixify(b[timeField]));
    
    return dateB - dateA; 
  });

  return array;
};
