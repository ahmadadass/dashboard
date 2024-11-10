const dataContainer = document.getElementById('dataContainer');

let loginview = document.createElement('div');
loginview.innerHTML = ``
//loginview.classList.add('card')
loginview.innerHTML = `
    <h1>تسجيل دخول</h1>
    
    <input type="text" id="username" placeholder="اسم المستخدم" required>
    <input type="password" id="password" placeholder="كلمة المرور" required>
    <input type="button" id="post" onclick="vrifaydata()" value="دخول"></button>
    
`
//console.log("dataContainer: ", dataContainer)
dataContainer.appendChild(loginview);

let cookie = 0;

async function vrifaydata() {
    let data;
    let username = document.querySelector('#username');
    let password = document.querySelector('#password');
    try {
        const response = await fetch('/.netlify/functions/server', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            car: "thiscodeisnotforshaeringlogin",
            username: username.value,
            password: password.value 
        }),
    });

    data = await response.json();
    if (data.statis == "good"){

        cookie = data.cookie
        setViewMain();
        
        google.charts.load('current', { packages: ['corechart'] });

        // Set a callback to run when the API is loaded.
        google.charts.setOnLoadCallback(drawChart);

    } else if (data.statis == "bad"){
        alert ("الاسم او كلمة المرور غير صحيح")
    } else {
        alert("خطء غير متوقع حدث")
    }

    //console.log("data form server.js: " , data);
    } catch (error) {
        console.error('Error calling serverless function:', error);
        document.getElementById('response').textContent = 'An error occurred';
    }
    
}
function setViewMain(){
    dataContainer.innerHTML = ``
    let mainView = document.createElement('div');
    mainView.innerHTML = ``
    //mainView.classList.add('div')
    mainView.innerHTML = `
        <div class="loader"></div>
        <div class="row">
            <div class="column">
                <div id="chart_user" style="width: 500px; height: 250px;"></div>
            </div>
            <div class="column">
                <div id="chart_cases" style="width: 500px; height: 250px;"></div>
            </div>
        </div>
        `

    dataContainer.appendChild(mainView);
}

async function drawChart() {
    // Create the data table.
    let data;
    try {
        const response = await fetch('/.netlify/functions/server', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                car: "thiscodeisnotforshaeringsenddata",
                cookie: cookie
            }),
        });

        data = await response.json();
    //console.log("data form server.js: " , data);
    } catch (error) {
        console.error('Error calling serverless function:', error);
        document.getElementById('response').textContent = 'An error occurred';
    }
            
    console.log('data: ', data)
    data.users.statistics.unshift(['عمادة', 'العدد']);
    data.cases.statistics.unshift(['الطلبات', 'العدد']);

    var data_values_user = google.visualization.arrayToDataTable(data.users.statistics);
    var data_values_cases = google.visualization.arrayToDataTable(data.cases.statistics);
    /*[
    ['Month', 'Sales'],
    ['January', 1000],
    ['February', 1170],
    ['March', 660],
    ['April', 1030],
    ['May', 920]
    ]*/

    dataContainer.innerHTML = ``
    let mainView = document.createElement('div');
    mainView.innerHTML = ``
    //mainView.classList.add('div')
    mainView.innerHTML = ` 
        <div class="row">
            <div class="column">
                <h1>عدد المستخدمين في العمادات</h1>
                <div id="chart_user" style="width: 500px; height: 250px;"></div>
            </div>
            <div class="column">
                <h1>القضايا الفنية</h1>
                <div id="chart_cases" style="width: 500px; height: 250px;"></div>
            </div>
        </div>
        `

    dataContainer.appendChild(mainView);
            
    // Set chart options for a pie chart
    let options = {
        title: 'عدد المستخدمين',
        is3D: true,  // Adds a 3D effect
        pieSliceText: 'value',
        /*slices: {
            1: { offset: 0.1 },  // Offset a slice for emphasis
        },*/
        backgroundColor: '#b4ebf3',
        legend: { 
            position: 'labeled',
            font_size: '20px'
         },
        chartArea: {
            width: '100%',
            height: '100%'
        }
    };

    // Instantiate and draw the chart.
    //var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    //var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
    var chart_user = new google.visualization.PieChart(document.getElementById('chart_user'));
    chart_user.draw(data_values_user, options);
    
    options.title = "عدد القضايى"
    
    var chart_cases = new google.visualization.PieChart(document.getElementById('chart_cases'));
    chart_cases.draw(data_values_cases, options);
}