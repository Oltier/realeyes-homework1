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
                renderer: 'line',
                width: (window.innerWidth < 1024 || window.innerHeight < 914) ? window.innerWidth - 35 : window.innerWidth - 150,
                height: window.outerHeight * 0.50,
                series: chartData,
                min: 'auto',
                stack: false
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
            },
            tickSize: 1,
        });
        
        
        yAxis.render();
        xAxis.render();
        graph.render();
        
        var slider = new Rickshaw.Graph.RangeSlider.Preview({
            graph: graph,
            element: document.getElementById('slider'),
        })
        
        var resize = function(e) {
            if(/Mobi/.test(navigator.userAgent)){
                graph.configure({
                    width: (window.innerWidth < 1024 || window.innerHeight < 914) ? window.innerWidth - 35 : window.innerWidth - 150,
                })
            } else {
                graph.configure({
                    width: (window.innerWidth < 1024 || window.innerHeight < 914) ? window.innerWidth - 35 : window.innerWidth - 150,
                    height: window.outerHeight * 0.50,
                })   
            }
            graph.render();
        }
        
        var orientation = function(e) {
            graph.configure({
                width: (window.screen.width < 1024 || window.screen.width < 914) ? window.screen.width - 35 : window.screen.width - 150,
                height: window.screen.height * 0.50,
            })
            graph.render();
            
        }
        
        $(window).on('orientationchange', orientation);
        $(window).on('resize', resize);
    });
    
});