var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var tiempo_expulsa= 10;
var tiempo_empieza_cuenta=5;
app.get('/movil.html', function(req, res){
  res.sendFile(__dirname + '/movil.html');
});
app.get('/juego.html', function(req, res){
  res.sendFile(__dirname + '/juego.html');
});
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

	setInterval(tiempo_activos, 1000,socket);
	
	console.log('conectado');
  	socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('data-in',function (socket) {

//	console.log('data-in got it');
	//guarda(socket); database maybe
	data= manda(socket);
	//io.emit('test',{name:'alex', data: 'guudtv'});
	console.log('\n recibo: ' );
	console.log(socket);
	io.emit('data-out', data);
});
});


http.listen(8080, function(){
  console.log('listening on *:8080');
});


var activos = [];

function manda(socketi){
	console.log();
	if(activos.length==0){
		socketi.time=0;
		activos.push(socketi);
		console.log('activos-estaba- vacio');
		console.log(activos);
		return socketi;

	}else{
		console.log('activos lleno| lista:');
		console.log(activos);
		console.log();
		console.log(socketi);
		var aux=-1;
		var itema= activos.filter(function(item,i){
			aux=i;
			return item.ID== socketi.ID;
		});
		var item=itema[0];
		console.log(item);
		if (typeof item != 'undefined') {
	  // El objeto está en la lista activos
	  console.log('lo añado');

	  item.time=0;
	  activos[aux].time=item.time;
	  return item;
	}else{
		console.log('pongo tiempo a cero');
		socketi.time=0;
		activos.push(socketi);
		return socketi;
	}
}

}
function tiempo_activos(socket){
	//console.log('ta');
	console.log(activos);
	activos.forEach(function(element,index,array){
		element.time=element.time + 1;

		if(element.time>= tiempo_empieza_cuenta){
			if(element.time >= tiempo_expulsa){
				console.log('explusa');
				
				
					array.splice(index, 1);
					socket.emit('expulsa',element.ID);
				
			}else{
				var sum= parseInt(tiempo_expulsa)-parseInt(element.time);
				console.log('falta'+sum);
				socket.emit('falta',{'id' : element.ID, tiempo: sum});
			}
		}
	});

}
