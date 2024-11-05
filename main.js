const dataContainer = document.getElementById('dataContainer');

let loginview = document.createElement('div');
loginview.innerHTML = ``
loginview.classList.add('container')
loginview.innerHTML = `
    <h1>تسجيل دخول</h1>
    
    <input type="text" id="username" placeholder="اسم المستخدم" required>
    <input type="password" id="password" placeholder="كلمة المرور" required>
    <input type="button" id="post" onclick="vrifaydata()" value="دخول"></button>
    
`
console.log("dataContainer: ", dataContainer)
dataContainer.appendChild(loginview);

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
        <h1>عدد مستخدمي العمادات</h1>
        
        <div id="chart_div" style="width: 50%; height: 70%;"></div>
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
        body: JSON.stringify({car: "thiscodeisnotforshaeringsenddata"}),
    });

    data = await response.json();

    //console.log("data form server.js: " , data);
    } catch (error) {
        console.error('Error calling serverless function:', error);
        document.getElementById('response').textContent = 'An error occurred';
    }
            
    data.statistics.unshift(['عمادة', 'العدد']);

    var data_values = google.visualization.arrayToDataTable(
        data.statistics
    );
    /*[
    ['Month', 'Sales'],
    ['January', 1000],
    ['February', 1170],
    ['March', 660],
    ['April', 1030],
    ['May', 920]
    ]*/

            
    // Set chart options for a pie chart
    var options = {
        title: 'عدد المستخدمين',
        is3D: true,  // Adds a 3D effect
        pieSliceText: 'value',
        /*slices: {
            1: { offset: 0.1 },  // Offset a slice for emphasis
        },*/
        backgroundColor: '#f4f4f4',
        legend: { position: 'right' },
        chartArea: {
            width: '100%',
            height: '70%'
        }
    };

    // Instantiate and draw the chart.
    //var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    //var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data_values, options);
}