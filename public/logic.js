$(function () {
	
	var token = sessionStorage.token;
	var $usernameInput = getParameterByName('usernameInput');
	var $orderInput = getParameterByName('orderInput');
	var captcha = getParameterByName('g-recaptcha-response'); 
	if(!captcha){
		console.log("NO CAPTCHA");
		//return;
	}else{
		console.log("CAPTCHA");		
	}
	var $inputMessage = $('#m'); // Input message input box	
	var socket = io.connect('http://localhost:3001',{ query: {
																token: token,
																order: $orderInput
															  } 
													}
							);

	//socket.setTimeout(1000 * 20); // 5 hours						
	var $roomID = $orderInput;
	var $connected = logIntoChat();
	var $inputs = document.querySelectorAll( '#files .inputfile' );
	var $chat_messages = [];


	$('#chat form').submit(function(){
		if($connected){
			sendMessage();
			$inputMessage.val('');
			return false;
		}else{

		}
	});	
	
	socket.on('timeout', () => {
		console.log('socket timeout');
		//socket.end();
	});	

	socket.on('chat message', function(message){
		//$chat_messages.push(message);	
      $('#messages').append($('<li>').text(message));
	});
		
	socket.on("disconnect", function(idOrder){		
		console.log("client disconnected from server --> "+idOrder.room );

	});
	
	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(window.location);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	
	  // Prevents input from having injected markup
	function cleanInput (input) {
		return $('<div/>').text(input).html();
	}
	
	  // Sends a chat message
	function sendMessage () {		
		var message = $usernameInput + ': ' + $inputMessage.val();
		// Prevent markup from being injected into the message
		message = cleanInput(message);
		// if there is a non-empty message and a socket connection
		if (message) {
		  $inputMessage.val('');		  	
		  // tell server to execute 'new message' and send along one parameter
		  socket.emit('chat message', {
			room: $roomID,
			message: message
		  });		  
		  /*
		  // add messages to lists
		  $chat_messages.push(message);	
		  
		  // send messages to redis
		  socket.emit('all chat messages', {
			room: $roomID,
			chat_messages: $chat_messages			
		  });*/
		  
		}
	}		

	$( "#Cerrar" ).click(function() {
		alert($roomID);
		//socket.emit('disconnect', {room: $roomID });
		socket.disconnect();
		$inputMessage.val('');
		$('#messages').empty();
	});
	
	function logIntoChat () {		
		socket.emit('change group', {
			room: $roomID,
			message: 'Admin: ' + $usernameInput + ' connected.'
		});	

		socket.emit('get all messages', {room: $roomID });
		return true;
	}
			
	/*$('#files form').submit(function(){
		if($connected){
			$('#messages').append($('<li>').text('holaaaaaa'));
			return false;
		}
	});	

	Array.prototype.forEach.call( $inputs, function( input )
	{
		alert("asas");
		var label	 = input.nextElementSibling,
			labelVal = label.innerHTML;

		input.addEventListener( 'change', function( e )
		{
			alert("rerererre");
			var fileName = '';
			if( this.files && this.files.length > 1 )
				fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
			else
				fileName = e.target.value.split( '\\' ).pop();

			if( fileName )
				label.querySelector( 'span' ).innerHTML = fileName;
			else
				label.innerHTML = labelVal;
		});
	});	*/
	
});	  
