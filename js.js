// asyncQueries
let mm = [];
let prods = [];
let marks = [];
let table = [];

async function getManagersMail() {
    const response = await fetch('http://localhost:4000/form');
    let result = await response.json();

    console.log(result)

    document.getElementById('mn').innerHTML = '<option>Select Manager Mail!</option>';
    for (let i = 0; i < result.length; i++) {

        let el = document.createElement('option');
        el.value = result[i].TradeMarketMail;
        el.innerText = result[i].TradeMarketMail;

        document.getElementById('mn').append(el);
    }
}

async function getProd(managerMail) {
    const response = await fetch("http://localhost:4000/prod", {
        method: "POST",
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({
            mail: managerMail
        })
    });
    let result = await response.json();

    document.getElementById('pr').innerHTML = '<option>Select Product!</option>';
    for (let i = 0; i < result.length; i++) {

        let el = document.createElement('option');
        el.value = result[i].ProdName;
        el.innerText = result[i].ProdName;

        document.getElementById('pr').append(el);
    }
}

async function getMark(managerMail, prod) {
    const response = await fetch("http://localhost:4000/mark", {
        method: "POST",
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({
            mail: managerMail,
            prod: prod,
        })
    });
    let result = await response.json();

    document.getElementById('mr').innerHTML = '<option>Select Mark!</option>';
    for (let i = 0; i < result.length; i++) {

        let el = document.createElement('option');
        el.value = result[i].MarkName;
        el.innerText = result[i].MarkName;

        document.getElementById('mr').append(el);
    }
}

async function getTable(managerMail, prod, mark) {
    const response = await fetch("http://localhost:4000/tbl", {
        method: "POST",
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({
            mail: managerMail,
            prod: prod,
            mark: mark
        })
    });
    let result = await response.json();
    table = result;
    resetTable();

    result.map(i => {
        let tr = document.createElement('tr');
        let ItemID = document.createElement('td');
        let SortNO = document.createElement('td');
        let CSKUID = document.createElement('td');
        let CSKU = document.createElement('td');
        let ItemName = document.createElement('td');
        let ProdID = document.createElement('td');
        let MarkID = document.createElement('td');
        let ctd = document.createElement('td');
        let check = document.createElement('input');

        ItemID.innerText = i.ItemID;
        SortNO.innerText = i.SortNO;
        CSKUID.innerText = i.CSKUID;
        CSKU.innerText = i.CSKU;
        ItemName.innerText = i.ItemName;
        ProdID.innerText = i.ProdID;
        MarkID.innerText = i.MarkID;

        check.type = "checkbox";
        check.checked = true;

        check.classList.add('check');
        check.checked = "true";

        tr.append(ItemID);
        tr.append(SortNO);
        tr.append(CSKUID);
        tr.append(CSKU);
        tr.append(ItemName);
        tr.append(ProdID);
        tr.append(MarkID);
        ctd.append(check);
        tr.append(ctd);

        document.getElementById('tb').append(tr);
    });
}

// Render Form
let formChildren = document.getElementById('form').children;

for (let i = 1; i < formChildren.length; i++) {
    formChildren[i].style.display = 'none';
}

for (let i = 0; i < formChildren.length; i++) {
    formChildren[i].addEventListener('change', () => {
        formChildren[i + 1].style.display = 'block';
    });
}
// Render floating selects
getManagersMail();

function resetTable() {
    document.getElementById('tb').innerHTML = '<tr>\n' +
        '            <th>ItemID</th>\n' +
        '            <th>SortNO</th>\n' +
        '            <th>CSKUID</th>\n' +
        '            <th>CSKU</th>\n' +
        '            <th>ItemName</th>\n' +
        '            <th>ProdID</th>\n' +
        '            <th>MarkID</th>\n' +
        '            <th>Order</th>\n' +
        '        </tr>';
}

document.getElementById('mn').onchange = function () {
    getProd(this.value);
    document.getElementById('mr').innerHTML = '<option>Select Mark!</option>';
    resetTable();
}

document.getElementById('pr').onchange = function () {
    getMark(document.getElementById('mn').value, this.value);
    resetTable();
}

document.getElementById('mr').onchange = function () {
    resetTable();
    getTable(document.getElementById('mn').value, document.getElementById('pr').value, this.value);
}

// submit checker
function checkDate() {
    return new Date(document.getElementById('sdate').value).getTime() < new Date(document.getElementById('fdate').value).getTime();
}

document.getElementById('sbm').onclick = function () {
    let resultOrdersArray = [];

    for (let i = 0; i < table.length; i++) {
        if (document.getElementsByClassName('check')[i].checked === true) {
            resultOrdersArray.push(table[i]);
        }
    }

    if (
        resultOrdersArray.length > 0 &&
        document.getElementById('email').value != "" &&
        document.getElementById('fio').value != "" &&
        document.getElementById('sdate').value != "" &&
        document.getElementById('fdate').value != "" &&
        document.getElementById('acomment').value != "" &&
        document.getElementById('aInitiator').value != "" &&
        document.getElementById('aType').value != "" &&
        document.getElementById('aTypeRange').value != "" &&
        document.getElementById('budget').value != "" &&
        document.getElementById('budgetVal').value != "" &&
        +document.getElementById('budgetVal').value > 0 &&
        document.getElementById('discount').value != "" &&
        +document.getElementById('discount').value > 0 &&
        document.getElementById('cbf').value != "" &&
        document.getElementById('cbt').value != "" &&
        document.getElementById('cbc').value != "" &&
        document.getElementById('mn').value != "" &&
        document.getElementById('pr').value != "" &&
        document.getElementById('mr').value != "" &&
        checkDate()
    ) {
        postResult(resultOrdersArray);
        location.href = "http://localhost:63342/sav04/res.html";
    } else {
        alert(
            "Все поля формы должны быть заполнены! \n\n" +
            "Числа формы не могут быть отрицательными! \n\n" +
            "В таблице нужно отметить хотя бы одно поле! \n\n" +
            "Дата начала акции должна быть раньше её конца!"
        )
    }
}

async function postResult(resultOrdersArray) {
    const response = await fetch("http://localhost:4000/res", {
        method: "POST",
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({
            senderMail: document.getElementById('email').value,
            senderFIO: document.getElementById('fio').value,
            startDate: document.getElementById('sdate').value,
            finishDate: document.getElementById('fdate').value,
            actionComment: document.getElementById('acomment').value,
            actionInitiator: document.getElementById('aInitiator').value,
            actionType: document.getElementById('aType').value,
            actionLocal: document.getElementById('aTypeRange').value,
            budgetQuantity: document.getElementById('budget').value,
            budgetSize: document.getElementById('budgetVal').value,
            discount: document.getElementById('discount').value,
            budgetFilial: document.getElementById('cbf').value,
            budgetTT: document.getElementById('cbt').value,
            addRemoveCSKU: document.getElementById('cbc').value,
            TradeMarketMail: document.getElementById('mn').value,
            ProdName: document.getElementById('pr').value,
            MarkName: document.getElementById('mr').value,
            order: resultOrdersArray
        })
    });
}
//scroll processing
mybutton = document.getElementById("tt");

mybutton.onclick = () => {topFunction()};

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}