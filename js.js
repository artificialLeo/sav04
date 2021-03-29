
async function showAvatar() {
    let response = await fetch('http://localhost:4000/mail');
    let user = await response.json();

    user.map(i => {
       let span = document.createElement('span');
       span.innerText = i.TradeMarketMail;

       document.getElementById('main').after(span);
    });
}

showAvatar();
