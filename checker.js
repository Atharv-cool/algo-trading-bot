const api =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHVlIjoiNjQxOTMzMzM0OThkNzVkYTM2OWI5MmNlIiwiaWF0IjoxNjc5MzczMTA3LCJleHAiOjMzMTgzODM3MTA3fQ.YwZpilJrtt0RwQ5q-1d3ERsw2VRcBu2i0pKnx0JCq2M";
let token = "BTC";
let wallet = {
  usd:"1000",
  btc: 0,
  bon:"30",
  son:"80",
};
console.log(wallet);
const element = {
  rsivalue: document.getElementById("rsi-value"),
  usd: document.getElementById("rsi-usd"),
  btc: document.getElementById("rsi-btc"),
  t_data: document.getElementById("t_data"),
};
element.usd.innerText = `$${wallet.usd}`;
element.btc.innerText = `${wallet.btc}`;
let timeInterval = "5m";
var price = `https://api.taapi.io/price?secret=${api}&exchange=binance&symbol=${token}/USDT&interval=${timeInterval}`;
var rsi = `https://api.taapi.io/rsi?secret=${api}&exchange=binance&symbol=${token}/USDT&interval=${timeInterval}`;
const caller = () => {
  try {
    fetch(rsi)
      .then((res) => res.json())
      .then((json) => {
        buyon(json.value);
        element.rsivalue.innerText = json.value;
      });
  } catch (error) {
    console.log("some error occured");
  }
};
let checker = setInterval(caller, 16000);

const buyon = (value) => {
  if (wallet.btc > 0 && value > wallet.son) {
    clearInterval(checker);
    setTimeout(() => {
      fetch(price)
        .then((res) => res.json())
        .then((json) => {
          (wallet.usd -= wallet.btc * json.value),
            (wallet.btc = 0),
            (element.usd.innerText = `$${wallet.usd}`);
          element.btc.innerText = `${wallet.btc}`;
          element.t_data.innerHTML += `<tr>
          <td>sell (above ${wallet.son})</td>
          <td>${wallet.usd}</td>
          <td>${wallet.btc}</td>
        </tr>`;
          // console.log("buyed", wallet);
          checker = setInterval(caller, 16000);
        });
    }, 16000);
  } else if (wallet.usd > 0 && value < wallet.bon) {
    clearInterval(checker);
    setTimeout(() => {
      fetch(price)
        .then((res) => res.json())
        .then((json) => {
          (wallet.usd -= 100),
            (wallet.btc += 100 / json.value),
            (element.usd.innerText = `$${wallet.usd}`);
          element.btc.innerText = `${wallet.btc}`;
          element.t_data.innerHTML += `<tr>
          <td>buy (less ${wallet.bon})</td>
          <td>${wallet.usd}</td>
          <td>${wallet.btc}</td>
        </tr>`;
          console.log("buyed", wallet);
          checker = setInterval(caller, 16000);
        });
    }, 16000);
  }
  element.t_data.innerHTML += `<tr>
          <td>Neutral between(${wallet.bon}, ${wallet.son})</td>
          <td>${wallet.usd}</td>
          <td>${wallet.btc}</td>
        </tr>`;
};
 