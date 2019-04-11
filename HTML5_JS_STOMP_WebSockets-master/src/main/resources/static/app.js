var app = (function () {

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }
    
    var stompClient = null;
    var dibujos=[];

    var addPointToCanvas = function (point,num) { 
        var canvas = document.getElementById(num);
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
    };
    
    
    var addPolyToCanvas = function (num,poly){
        if(poly.length>=6){ 
            var canvas=document.getElementById(num);
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = '#f00';

            ctx.beginPath();
            ctx.moveTo(poly[0], poly[1]);
            for( item=2 ; item < poly.length-1 ; item+=2 ){
                ctx.lineTo( poly[item] , poly[item+1] );
            }

            ctx.closePath();
            ctx.fill();
        }   	
    }
    
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
            //console.log('Connected: ' + frame);
            src='/topic/newpoint.'+num;
            stompClient.subscribe(src, function (eventbody) {
                var p=JSON.parse(eventbody.body);                    
                addPointToCanvas(p,num);
            });
            src1='/topic/newpoly.'+num;
            stompClient.subscribe(src1, function (eventbody) {
                var poly=JSON.parse(eventbody.body);
                console.log(poly);                 
                addPolyToCanvas(num,poly);
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
            if(dibujos.includes(num)==false){
                dibujos.push(num);
                var body=$('#Body');
                html='<p></p><canvas id="'+num+'" width="800" height="500"  style="background-color:powderblue;border: 1px solid blue"></canvas>';
                body.append(html);            
                body.onload="app.init";
                app.init(num);
            }else{
                alert('ya esta abierto el dibujo');
            }
        },
        publishPoint: function(px,py,num){
            var pt=new Point(px,py);
            //console.info("publishing point at "+pt);
            var punto = JSON.stringify(pt);
            src='/app/newpoint.'+num;
            stompClient.send(src, {}, punto);  
            src1='/app/newpoly.'+num;  
            stompClient.send(src1, {}, punto);      
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