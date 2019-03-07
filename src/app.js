// this is an example of improting data from JSON

    import orders from '../data/orders.json';
    import users from '../data/users.json';
    import companies from '../data/companies.json';

function timeConverter(UNIX_timestamp) {
    let a = new Date(UNIX_timestamp * 1000);
    let year = a.getFullYear();
    let month = a.getMonth();
    let date = a.getDate();
    let hour = a.getHours() - (a.getHours() >= 12 ? 12 : 0);
    let period = a.getHours() >= 12 ? 'PM' : 'AM';
    let min = a.getMinutes();
    let sec = a.getSeconds();
    let setTime = date + "/" + month + "/" + year + ' ' + hour + ':' + min + ':' + sec + ' ' + period;
    return setTime;
}

function roundTwo(num) {
    return Math.round(parseFloat(num)*1000)/1000;
}

function starConverter(str) {
    if (str.substr(0, 2) && str.substr(-4)) {
        let firstTwo = str.substr(0, 2);
        let lastFour = str.substr(-4);
        let beStar = "*";
        for (let i = (str.length) - 4; i > 0; i--) {
            beStar += '*';
        }
        return firstTwo + beStar + lastFour;
    }
    else {
        return str = "";
    }
}
function pad(n) {
    return n < 10 ? '0' + n : n;
}
function median1(values) {
    values.sort(function (a, b) {
        return a - b;
    });
    let half = Math.floor(values.length / 2);
    if (values.length % 2) return values[half]; else return (values[half - 1] + values[half]) / 2.0;
}
let list1= []; // массив for midian
export default (function () {
    // YOUR CODE GOES HERE
    // make an associative array of users to search by ID
    let usersById = {};
    for(let i = 0; i < users.length; i++) {
        usersById[users[i].id] = users[i];
    }
    // make an associative array of users to search by ID
    let companyById = {};
    for(let i = 0; i < companies.length; i++) {
        companyById[companies[i].id] = companies[i];
    }
    // make an associative array of users to search by ID
    let ordersById = {};
    for(let i = 0; i < orders.length; i++) {
        ordersById[orders[i].total] = orders[i];
    }

    let orderCount = 0;// order count
    let sum = 0; // count of cash
    let sumAverCheckMale = 0; //count of male
    let sumAverCheckFemale =0; // count of female

    let tableLoad= '<table id="grid" class="table table-bordered table-hover"><thead class="thead-dark">';
    tableLoad +='<tr> <th>Search:</th> <th colspan="6"><input type="text" id="search" value="" onkeyup="tableSearch()"></th> </tr>';
    tableLoad +='<tr>';
    tableLoad +='<th data-name="Transaction ID" data-type="string" >Transaction ID</th>';
    tableLoad +='<th data-name="User Info" data-type="name">User Info</th>';
    tableLoad +='<th data-name="Order Date" data-type="date">Order Date</th>';
    tableLoad +='<th data-name="Order Amount<" data-type="number">Order Amount</th>';
    tableLoad +='<th>Card Number</th>';
    tableLoad +='<th data-name="Card Type" data-type="string">Card Type</th>';
    tableLoad +='<th data-name="Location" data-type="string">Location</th>';
    tableLoad +='</tr>';
    tableLoad +='<tr class="no-result"> <td>Nothing found</td> </tr>';
    tableLoad +='</thead>';
    tableLoad +='<tbody>';

    for(let i =0; i <orders.length;i++) {
        const orderId = Number(orders[i].id); // переменная для заказов
        const transactionId = String(orders[i].transaction_id);
        const userId = Number(orders[i].user_id);
        const createdAt = String(orders[i].created_at);
        let totalPay = roundTwo(orders[i].total);
        list1.push(totalPay); // передаем в массив значения
        const cardNumber = starConverter(String(orders[i].card_number));
        const cardType = String(orders[i].card_type);
        const orderCountry = String(orders[i].order_country);
        const orderIp = String(orders[i].order_ip);
        let clickId = "demo"+orderId;
        let user = (typeof usersById[userId] !== 'undefined') ? usersById[userId] : null;
        //
        let company = user.company_id && (typeof companyById[user.company_id] !== 'undefined') ? companyById[user.company_id] : null;
        let birthday = new Date(user.birthday * 1000);
        let bdate = birthday.getDate();
        let bmonth = birthday.getMonth();
        let byear = birthday.getFullYear();
        let beIndustry = (company?'Industry:'+ company.industry : null);
        if (user) {
            tableLoad += '<tr id="order_' + orderId + '">';
            tableLoad += '<td>' + transactionId + '</td>';
            tableLoad += '<td class="user_data" data-name="'+user.first_name + ' ' + user.last_name+'">' +
                '<a onclick="return change(\'' + clickId + '\')" href="#" >' + (user.gender === "Male" ? "Mr. " : "Ms. ") + user.first_name + ' ' + user.last_name + '</a>' +
                '<div style="display:none" id="' + clickId + '" class="user-details"> ' +
                '<p>Birthday: ' + pad(bmonth + 1) + "/" + pad(bdate) + "/" + byear + '</p>' +
                '<p><img alt="" src="' + user.avatar + '" width="100px"></p>' +
                '<p>'+(company?'Company: <a href="'+company.url+'" target="_blank">' +  company.title+ '</a>':'')+'</p>' +
                '<p>' +beIndustry+ '</p>' +
                '</div></td>';
            tableLoad += '<td>' + timeConverter(createdAt) + '</td>';
            tableLoad += '<td>$' + totalPay + '</td>';
            tableLoad += ' <td>' + cardNumber + '</td>';
            tableLoad += ' <td>' + cardType + '</td>';
            tableLoad += ' <td>' + orderCountry + ' (' + orderIp + ')<td>';
            tableLoad += '</tr>';
            // counters of statistika
            orderCount++;
            sum+=totalPay; // считаем сумму заказов
            if(user.gender === "Male"){
                sumAverCheckMale++
            }
            else if(user.gender === "Female"){
                sumAverCheckFemale++
            }
        }
    }
    tableLoad+='</tbody>';
    tableLoad+= '<table>';
    let averCheck = (sum / orderCount); // получаем средий чек
    tableLoad +='<table class="table">';
    tableLoad +='<tbody>';
    tableLoad +='<tr>' +
        '<th>Orders Count</th>' +
        '<td>'+ orderCount+'</td>' +
        '<td colspan="5">&nbsp;</td>' +
        '</tr>';
    tableLoad +='<tr>' +
        '<th>Orders Total</th>' +
        '<td>$'+roundTwo(sum)+'</td>' +
        '<td colspan="5">&nbsp;</td>' +
        '</tr>';
    tableLoad +='<tr>' +
        '<th>Median Value</th>' +
        '<td>$'+median1(list1)+'</td>' +
        '<td colspan="5">&nbsp;</td>' +
        '</tr>';
    tableLoad +='<tr>' +
        '<th>Average Check</th>' +
        '<td>$'+roundTwo(averCheck)+'</td>' +
        '<td colspan="5">&nbsp;</td>' +
        '</tr>';
    tableLoad +='<tr>' +
        '<th>Average Check (Female)</th>' +
        '<td>'+sumAverCheckFemale+'</td>' +
        '<td colspan="5">&nbsp;</td>' +
        '</tr>';
    tableLoad +='<tr>' +
        '<th>Average Check (Male)</th>' +
        '<td>'+sumAverCheckMale+'</td>' +
        '<td colspan="5">&nbsp;</td>' +
        '</tr>';
    tableLoad +='</tbody>';
    tableLoad +='</table>';

    document.getElementById('app').innerHTML = "" + tableLoad + " <br>";
}());

