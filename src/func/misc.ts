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

export function toMilitaryTime
(
    exactTime: string
) {

    let hours: any, minutes: string;
    const [time, modifier] = exactTime.split(' ');

    if (Array.isArray(time.split(","))) {
      let [h, m] = time.split(',').slice(0, 2);

      hours = h;
      minutes = m;
    } else {
      hours = time;
      minutes = "00";
    };

    if (hours === "12" && modifier === 'PM') hours = "12";
    else if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
    else if (hours === '12' && modifier === "AM") hours = '00';

    return `${hours}:${minutes}`;
};

type gADConfig = {
    date: any
};
const defaultGADV: gADConfig = {
    date: Date.now()
}; 
export function getAccurateDate
(
    element: string, 
    config?: Partial<gADConfig>
) {
    let { date } = { ...defaultGADV, ...config };

    const formatter = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'long',
      timeZone: 'Asia/Manila',
    });
    const monthEnum = {
      "January": 0,
      "February": 1,
      "March": 2,
      "April": 3,
      "May": 4,
      "June": 5,
      "July": 6,
      "August": 7,
      "September": 8,
      "October": 9,
      "November": 10,
      "December": 11
    };

    date = formatter.format(date).split(" ");

    let output: any;
    let stateOutput: any;
    const newDate = new Date(`${date[1]} ${date[2]} ${date[3]} ${toMilitaryTime(`${date[5].split(":").slice(0, 2)} ${date[6]}`)}:${date[5].split(":")[2]}`);
    const hour = date[5].split(":")[0];

    if (hour < 12 && hour !== 12) stateOutput = { en: "morning", tl: "umaga" };
    else if (hour === 12) stateOutput = { en: "noon", tl: "tanghali" };
    else if (hour < 18) stateOutput = { en: "afternoon", tl: "hapon" };
    else stateOutput = { en: "evening", tl: "gabi" };
    
    switch (element) {
      case "whole": output = date.join(" "); break;
      case "dayWord": output = date[0].replace(",", ""); break;
      case "monthWord": output = date[1]; break;
      case "monthNumber": output = monthEnum[date[1]]; break;
      case "dayNumber": output = parseInt(date[2].replace(",", ""), 10); break;
      case "year": output = parseInt(date[3], 10); break;
      case "m/d/y": output = monthEnum[date[1]] + "/" + parseInt(date[2].replace(",", ""), 10) + "/" + parseInt(date[3], 10); break;
      case "m-d-y": output = monthEnum[date[1]] + "-" + parseInt(date[2].replace(",", ""), 10) + "-" + parseInt(date[3], 10); break;
      case "date": output = date[1] + " " + parseInt(date[2].replace(",", ""), 10) + ", " + parseInt(date[3], 10); break;
      case "time": output = date[5] + " " + date[6]; break;
      case "hour": output = date[5].split(":")[0] + " " + date[6]; break;
      case "state": output = stateOutput;
      case "militaryTime": output = toMilitaryTime(`${date[5].split(":").slice(0, 2)} ${date[6]}`); break;
      case "unix": output = Math.floor(newDate.getTime() / 1000) - (60 * 60 * 3); break;
      default: output = date.join(" ");
    };

    console.log(output)


    return output;
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
