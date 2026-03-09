const API="https://your-render-url"

async function searchStock(){

let ticker=document.getElementById("ticker").value

let r=await fetch(`${API}/stock/${ticker}`)

let data=await r.json()

document.getElementById("result").innerHTML=`
<h3>${data.name}</h3>
Price: ${data.price}<br>
Market Cap: ${data.marketCap}<br>
PE: ${data.pe}<br>
Sector: ${data.sector}
`
}

async function scan(tf){

let r=await fetch(`${API}/screener/doji/${tf}`)

let data=await r.json()

let html=""

data.doji_stocks.forEach(s=>{
html+=`<div>${s.ticker}</div>`
})

document.getElementById("scanresult").innerHTML=html
}
