
const symbols = ['⚡', 'Zeus', 'Hera', 'Pegasus', 'Ares', 'Scatter'];
let balance = 1000000;

function updateBalance() {
    document.getElementById('balance').innerText = balance;
}

function deposit() {
    balance += 500000;
    updateBalance();
}

function withdraw() {
    if (balance >= 100000) {
        balance -= 100000;
        updateBalance();
    }
}

function spin() {
    let bet = parseInt(document.getElementById('bet').value);
    if (bet > balance || bet < 400 || bet > 200000) {
        showMessage('Taruhan tidak valid!');
        return;
    }

    balance -= bet;
    updateBalance();
    const reels = document.getElementById('reels');
    reels.innerHTML = '';
    let result = [];

    for (let i = 0; i < 15; i++) {
        let symbol = symbols[Math.floor(Math.random() * symbols.length)];
        let cell = document.createElement('div');
        cell.innerText = symbol;
        reels.appendChild(cell);
        result.push(symbol);
    }

    let winnings = calculateWin(result, bet);
    balance += winnings;
    updateBalance();
    showMessage(winnings > 0 ? 'Menang: ' + winnings : 'Coba lagi!');
}

function calculateWin(result, bet) {
    let count = result.filter(s => s === 'Zeus').length;
    let scatterCount = result.filter(s => s === 'Scatter').length;
    let win = 0;

    if (count >= 3) win += bet * count;
    if (scatterCount >= 3) win += bet * 5;

    return win;
}

function buySpin() {
    let bet = parseInt(document.getElementById('bet').value);
    if (balance < bet * 2) {
        showMessage('Saldo tidak cukup untuk Buy Spin!');
        return;
    }

    balance -= bet * 2;
    updateBalance();
    const reels = document.getElementById('reels');
    reels.innerHTML = '';
    let result = [];

    for (let i = 0; i < 15; i++) {
        let symbol = (i % 5 === 0) ? 'Scatter' : symbols[Math.floor(Math.random() * symbols.length)];
        let cell = document.createElement('div');
        cell.innerText = symbol;
        reels.appendChild(cell);
        result.push(symbol);
    }

    let winnings = calculateWin(result, bet);
    balance += winnings;
    updateBalance();
    showMessage('Buy Spin! ' + (winnings > 0 ? 'Menang: ' + winnings : 'Coba lagi!'));
}

function showMessage(msg) {
    document.getElementById('message').innerText = msg;
}


// Tambahkan suara
const spinSound = new Audio('assets/sounds/spin.mp3');
const winSound = new Audio('assets/sounds/win.mp3');

function playSound(audio) {
    try {
        audio.currentTime = 0;
        audio.play();
    } catch (e) {
        console.log('Suara tidak bisa diputar otomatis:', e);
    }
}

// Tambahkan pemanggilan suara ke fungsi spin dan buySpin
const originalSpin = spin;
spin = function() {
    playSound(spinSound);
    originalSpin();
};

const originalBuySpin = buySpin;
buySpin = function() {
    playSound(spinSound);
    originalBuySpin();
};

// Tambahkan suara saat menang
const originalShowMessage = showMessage;
showMessage = function(msg) {
    originalShowMessage(msg);
    if (msg.includes('Menang')) {
        playSound(winSound);
    }
};
