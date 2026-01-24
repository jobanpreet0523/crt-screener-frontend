import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="app">
    <header>
      <h1>📊 CRT Trading Dashboard</h1>
      <p>Professional Market Scanner</p>
    </header>

    <section class="cards">
      <div class="card">US Market</div>
      <div class="card">Forex</div>
      <div class="card">Crypto</div>
      <div class="card">Indices</div>
    </section>

    <section class="panel">
      <h2>Market Status</h2>
      <p>No data connected yet</p>
    </section>
  </div>
`
