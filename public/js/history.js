$(document).ready(function(){
    
    $.get("/history/getdata", function(data){
        var chartData = [];
        var unixDate = new Date(data[0].date).getTime() / 1000;
        var seriesValues = [];
        var currencyName = data[0].currency;
        var palette = new Rickshaw.Color.Palette({scheme: 'munin'});
        for(var i = 0; i < data.length; i++) {
            if(currencyName !== data[i].currency){
                var seriesData = {color: palette.color(), name: currencyName, data: seriesValues};
                chartData.push(seriesData);
                seriesValues = [];
                currencyName = data[i].currency;
            }
            unixDate = new Date(data[i].date).getTime() / 1000;
            seriesValues.push({x: unixDate, y: parseFloat(data[i].rate)});
        }
        
        
        var graph = new Rickshaw.Graph({
                element: document.getElementById('chart'),
                width: window.innerWidth >= 1024 ? window.innerWidth - 150 : window.innerWidth - 35,
                height: 500,
                renderer: 'line',
                series: chartData,
                min: 'auto'
            });
        
        var hoverDetail = new Rickshaw.Graph.HoverDetail({
            graph: graph,
            xFormatter: function(x) {
                var dateInt = new Date(x*1000);
                return dateInt.toUTCString().replace(' 00:00:00 GMT', '');
            },
            yFormatter: function(y) {
                return y === null ? y : Math.round((parseFloat(y) + 0.0000001) * 10000) / 10000;
            }
        });
        
        var legend = new Rickshaw.Graph.Legend({
            graph: graph, 
            element: document.getElementById("legend")
        });
        
        var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
            graph: graph,
            legend: legend
        });
        
        var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
            graph: graph,
            legend: legend
        });
        
        
        var time = new Rickshaw.Fixtures.Time();
        var weeks = time.unit('week');
        
        var xAxis = new Rickshaw.Graph.Axis.Time({
            graph: graph,
            timeUnit: weeks
        });
        
        var yAxis = new Rickshaw.Graph.Axis.Y({
            graph: graph,
            tickFormat: function(val) {
                return val === null ? val : Math.round((parseFloat(val) + 0.0000001) * 10000) / 10000;
            }
        });
        
        $("#slider").width(window.innerWidth >= 1024 ? window.innerWidth - 150 : window.innerWidth - 35);
        
        yAxis.render();
        xAxis.render();
        graph.render();
        
        var slider = new Rickshaw.Graph.RangeSlider({
            graph: graph,
            element: document.getElementById('slider'),
        })
        
        var resize = function() {
            graph.configure({
                width: window.innerWidth >= 1024 ? window.innerWidth - 150 : window.innerWidth - 35,
            })
            graph.render();
            $("#slider").width(window.innerWidth >= 1024 ? window.innerWidth - 150 : window.innerWidth - 35);
        }
        window.addEventListener('resize', resize);
        
    });
    
});

/*$(window).on('resize', function(){
            console.log(graph);
            if(window.innerWidth >= 1024) {
                $("#slider").width(window.innerWidth - 150);
            } else {
                $("#slider").width(window.innerWidth - 35);
            }
            
            graph.configure({
                width: window.innerWidth - 20,
                height: window.innerHeight - 20
            });
            //graph.render();
        });*/