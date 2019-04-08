var app = (function () {

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }
    
    var stompClient = null;    

    var addPointToCanvas = function (point,num) { 
        var canvas = document.getElementById(num);
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
    };
    
    
    var getMousePosition = function (evt,num) {
        canvas = document.getElementById(num);
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };


    var connectAndSubscribe = function (num) {
        //console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        
        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            src='/topic/newpoint'+num;
            alert(src);
            stompClient.subscribe(src, function (eventbody) {
                var p=JSON.parse(eventbody.body);                    
                addPointToCanvas(p,num);                
            });
        });

    };
    
    

    return {

        init: function (num) {                   
            can = document.getElementById(num);
            //websocket connection
            connectAndSubscribe(num);
            can.addEventListener('click', function(evt) {
                var pt = getMousePosition(evt,num);
                app.publishPoint(pt.x, pt.y,num);
            });
        },
        
        conexion:function(num){
            var body=$('#Body');
            body.empty;
            str='<canvas id="'+num+'" width="800" height="500" style="border: 1px solid blue"></canvas>'
            body.append(str);            
            body.onload="app.init";
            app.init(num);
        },
        publishPoint: function(px,py,num){
            var pt=new Point(px,py);
            //console.info("publishing point at "+pt);
            var punto = JSON.stringify(pt);
            src='/topic/newpoint'+num;
            stompClient.send(src, {}, punto);
            addPointToCanvas(pt,num);
            
        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            setConnected(false);
            console.log("Disconnected");
        }
    };

})();