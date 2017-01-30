$(document).ready(function(){
    $.get("/history/getdata", function(data){
        var chartData = [];
        for(var i = 0; i< data.length; i++){
            chartData[i] = {
                date: data[i].date,
                data: data[i].rate,
                name: data[i].currency,
            }
        }
        console.log(JSON.stringify(chartData,null,2));
        /*var graph = new Rickshaw.Graph({
            element: document.getElementById('chart'),
            width: 960,
            height: 500,
            renderer: 'line',
            series: chartData,
        });
        graph.render();*/
    })
})