var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var tiempo_expulsa= 10;
var tiempo_empieza_cuenta=5;

var max_jugadores=5;


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
	dataset= manda(socket);
	//io.emit('test',{name:'alex', data: 'guudtv'});
	var array =[];

	//data= gestiona(socket);
	console.log('\n recibo: ' );
	console.log(socket);
	array.push(dataset);
	if(activos[socket.ID] != undefined){
	io.emit('data-out', { name: 'movimiento', data : array});
	}else{
		io.emit('client',{name: 'cliente', data: 'en_lista_espera'});
	}
	console.log('\n mando: ' );
	console.log({ name: 'data', data : array});
});
});


http.listen(8080, function(){
  console.log('listening on *:8080');
});


var activos = [];
var cola=[];

function gestiona(socketi){
socketi.time=0;
return socketi;

}

function manda(socketi){
	console.log();
	if(activos.length>=max_jugadores){
		cola[socketi.ID]=socketi;
		io.emit('cola',{user : socketi.ID, data: 'estás en espera'});

	}else{
	if(activos.length==0){
		socketi.time=0;
		//activos.push(socketi);
		
		activos[socketi.ID]=socketi;
		console.log('activos-estaba- vacio');
		console.log(activos);
		return socketi;

	}else{
		console.log('activos lleno| lista:');
		console.log(activos);
		console.log();
		console.log(socketi);
		var aux=-1;
		/*var itema= activos.filter(function(item,i){
			aux=i;
			return item.ID== socketi.ID;
		});
		
		var item=itema[0];
		*/
		var item= activos[socketi.ID];
		console.log(item);
		if (typeof item != 'undefined') {
	  // El objeto está en la lista activos
	  console.log('lo añado');

	  item.time=0;
	  item.x=socketi.x;
	  item.y=socketi.y;
	  item.z=socketi.z;
	  item.ID=socketi.ID;

	//CUIDAO AQUI  activos[aux]=item;
	  return item;
	}else{
		console.log('pongo tiempo a cero');
		socketi.time=0;
		//activos.push(socketi);
		activos[socketi.ID]=socketi;
		return socketi;
	}
}
}
}

function gestiona_cola(){
	if( activos.length< max_jugadores){
		if(cola.shift()!= undefined){
		activos.push(cola.shift());
	}}
	

}

function tiempo_activos(socket){
	//console.log('ta');
	console.log(activos);

	for (var k in activos){
    if (activos.hasOwnProperty(k)) {
    	var element= activos[k];

    	element.time=element.time+1;
         console.log("Key is " + k + ", value is"+ element.time);
         if(element.time>= tiempo_empieza_cuenta){
			if(element.time >= tiempo_expulsa){
				console.log('explusa');
				
				
					delete activos[k];
					socket.emit('expulsa',{name: 'explusa', data: element.ID});
				
					//gestiona_cola();
			}else{
				var sum= parseInt(tiempo_expulsa)-parseInt(element.time);
				console.log('falta'+sum);
				socket.emit('falta',{name : element.ID, data: sum});
			}
		}
    }
}
	

}
