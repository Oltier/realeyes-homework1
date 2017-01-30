$(document).ready(function(data){
    
    $.get("/history/getdata", function(data){
        var chartData = [];
        var unixDate = new Date(data[0].date).getTime() / 1000;
        var seriesValues = [{x: unixDate, y: parseFloat(data[0].rate)}];
        var currencyName = data[0].currency;
        var goldenRationConjugate = 0.618033988749895;
        var h = Math.random();
        for(var i = 0; i < data.length; i++) {
            if(currencyName !== data[i].currency){
                h += goldenRationConjugate;
                h %= 1;
                var randomColor = rgbToHex(hsvToRgb(h, 0.5, 0.95));
                var seriesData = {color: randomColor, name: currencyName, data: seriesValues};
                chartData.push(seriesData);
                seriesValues = [];
                currencyName = data[i].currency;
            }
            unixDate = new Date(data[i].date).getTime() / 1000;
            seriesValues.push({x: unixDate, y: parseFloat(data[i].rate)});
        }
        
        
        var graph = new Rickshaw.Graph({
                element: document.getElementById('chart'),
                width: 960,
                height: 500,
                renderer: 'line',
                series: chartData,
            });
        
        var hoverDetail = new Rickshaw.Graph.HoverDetail({
            graph: graph
        });
        
        var legend = new Rickshaw.Graph.Legend({
            graph: graph, 
            element: document.getElementById("legend")
        });
        
        var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
            graph: graph,
            legend: legend
        });
        
        for(var i = 0; i < graph.series.length; i++) {
            graph.series[i].disable();
        }
        
        var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
            graph: graph,
            legend: legend
        });
        
        var axes = new Rickshaw.Graph.Axis.Time({
            graph: graph
        });
        
        axes.render();
        graph.render();
    
        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        function rgbToHex(rbg) {
            return "#" + componentToHex(rbg[0]) + componentToHex(rbg[1]) + componentToHex(rbg[2]);
        }
    
        function hsvToRgb(h, s, v) {
            var hueInt = parseInt(h*6);
            var f = h*6-hueInt;
            var p = v * (1-s);
            var q = v*(1-f*s);
            var t = v*(1-(1-f)*s);
            var r, g, b;
            switch(hueInt) {
                case 0:
                    r=v; g=t; b=p;
                    break;
                case 1:
                    r=q; g=v; b=p;
                    break;
                case 2:
                    r=p; g=v; b=t;
                    break;
                case 3:
                    r=p; g=q; b=v;
                    break;
                case 4:
                    r=t; g=p; b=v;
                    break;
                case 5:
                    r=v; g=p; b=q;
                    break;
            }
            return [parseInt(r*256), parseInt(g*256), parseInt(b*256)];
        }
        
    });
    
});