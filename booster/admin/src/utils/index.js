import moment from "moment";
import {FormatNumber} from "@app/utils/fotmat-number";

export const range = (start, end) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

export const disabledDate = (current) => {
  // Can not select days before today and today
  return current && current < moment().endOf('day').subtract(1, 'day');
}

export const convertMoney = (money) => {
  const baseMoney = 1000;
  const parseMoney = parseFloat(money);
  const newMoney = parseMoney / baseMoney;

  return `${newMoney > 0 ? FormatNumber('#,##0.##', newMoney) + 'k' : 0}`;
}

export const delay = (() => {
  let timer = 0;
  return (callback, ms) => {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export const getFileContent = (file, callback) => {
  const rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status === 0) {
        const allText = rawFile.responseText;
        callback(allText);
      }
    }
  }
  rawFile.send(null);
}


export async function postDataWithFetch(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    // mode: 'no-cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });

  return response.json(); // parses JSON response into native JavaScript objects
}

export const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const encodeEmail = (str) => {
  if (validateEmail(str)) {
    const tmp = str?.split("@")

    return tmp?.[0]?.slice(0, Math.round((40 * tmp?.[0].length) / 100)) + "***" + "@" + tmp?.[1]
  }

  return str
}

export const encodeString = (str) => {
  return str?.slice(0, Math.round((40 * str.length) / 100)) + "***"
}

export const removeLoading = () => {
  setTimeout(() => {
    document.getElementById("page-loading-icon").style.display = "none"
  }, 1000)
}

export function kFormatter(value) {
  const newValue = parseInt(value || 0)

  var suffixes = ["", "K", "M", "B", "T"];
  var suffixNum = Math.floor(("" + newValue).length / 3);
  var shortValue = parseFloat((suffixNum != 0 ? (newValue / Math.pow(1000, suffixNum)) : newValue).toPrecision(2));
  if (shortValue % 1 != 0) {
    shortValue = shortValue.toFixed(1);
  }

  return shortValue + suffixes[suffixNum];
}

export const removeError = ({errors, name, setErrors}) => {
  const newErrors = {...errors};
  delete newErrors?.[name];
  setErrors({...newErrors});
};