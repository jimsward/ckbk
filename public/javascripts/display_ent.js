jQuery(function(){
		
	var myDate = new Date();
	var today =(myDate.getMonth()+1) + '/' + myDate.getDate() + '/' +
        myDate.getFullYear();
	
//	$( document ).tooltip();
	
	
		
	
			
					
			
			//user chooses payment or deposit; allow input to one or the other, not both
			$( 'select#reference' ).on( 'change', function( event )
			{				
				var target = $( event.target );				
				var value = target.val()
							
				if ( value == 'payment')
				{
				$('#payment').attr( {'readonly' : 'false', 'placeholder' : 'payment'} ).text('')
				$('#payment').maskMoney().trigger( 'focus' );
				$( "input[id|='deposit']" ).attr( {'readonly' : 'true', 'placeholder' : ''} ).html( 0 );
				}
				else
				{
				$('#deposit').attr( {'readonly' : 'false', 'placeholder' : 'deposit'} ).text('')	
				$('#deposit').maskMoney().trigger( 'focus' );	
				$( "input[id|='payment']" ).attr( {'readonly' : 'true', 'placeholder' : ''} ).html( 0 );	
				
				}
			})
			
	 
	
		$( 'button.cancel' ).on( 'click', function(event){
			location.reload(true)
			} )
				
			
			
		$( '#entryform' )
        .submit(function( event ) {	
				
		event.preventDefault(); //STOP default action
   			 
		var data = {}		
		data.date = $( "input[id|='datepicker']" ).val() 
		data.reference = $( '#reference option:selected' ).val()
		data.number = $( "input[id|='number']" ).val()
		data.payee = $( "input[id|='payee']" ).val()
		data.memo = $( "input[id|='memo']" ).val()
		data.account = $( "input[id|='account']" ).val()
		
		if ( data.reference == 'deposit' )
		{
			 data.payment = 0;
			 data.deposit = $( event.target.deposit ).val()
		}
		else
		{
		data.payment = $( event.target.payment ).val()
		data.deposit = 0;
		}
		if ( data.deposit == 0 && data.payment == 0 || data.deposit > 0 && data.payment >0 )
		{
			location.reload(true)
		alert("You must enter an amount or a payment; but not both!")
		}
		else
		{ 
		 $.ajax({
		  method: "POST",
		  url: "/newentry",
  		  data: data
		   })
		  .always(function( msg ) {
			location.reload(true)
 		  });//ajax  
		}
      });//entryform submit handler	
	  
	  
	  
	
		$( "#datepicker" ).datepicker( {
      showOn: "button",
      buttonImage: "images/calendar.gif",
      buttonImageOnly: true,
      buttonText: "Select date",
	  dateFormat: "m/d/yy"
	 // onClose: function() {
     //   $('#date').valid();}
    }  );
	$( '#datepicker' ).attr( 'value', today )
	
	$("#datepicker").blur(function(){
        var val = $(this).val();
        var val1 = Date.parse(val);
        if (isNaN(val1)==true && val!==''){
			$(this).val(today)
           alert("Please enter a valid date!")
        }
        else{
           console.log(val1);
        }
    });


	

	$( '.tbl' ).tablesorter( {
    
    widgets: ["uitheme", "zebra", "print"],
    widgetOptions : {
      zebra : [ "normal-row", "alt-row" ]
	  
    }
  } )
	
 $('div.print.button').click(function(){
    $('.tbl').trigger('printTable');
  });	
	
	//When user clicks on a row, we will edit it
	$( 'td' ).on( 'click', function(event)
	{
		var target = $( event.target );	
		var parentId = target.parent().attr( 'id' )//need parentId to id the record to send to save/edit/delete
		
		$('td').unbind('click')//disallow clicking on other rows until we're done with this one
			
					
		var x = target.parent().position().left;
		var y = target.parent().position().top;
		var positX = Math.round(x) + 542;
		var positY = Math.round(y) + 23;		
		target.siblings().addBack().fadeTo( "slow", 0.3 )
		console.log(x + ' ' + y)
		var buttons = '<button class="submit" id="save">Save</button>'
		+ '<button class="submit" id="edit">Edit</button>'
		+ '<button class="submit" id="cancel">Cancel</button>'
		+ '<button class="submit" id="delete">Delete</button>'
		
		$( '<div/>' )
		.css( { 'height' : '46px', 'width' : '460px', 'background-color' : 'transparent', 'position' : 'absolute', 'left' : positX + 'px', 'top' : positY + 'px', 'padding': '0 4px' } )		
		.appendTo( '.tbody' )
		.html( buttons )		
		
				
		$( 'button#edit' ).on('click', function(event){//allow editing of payment or deposit field
		
		console.log('this: ' + $(this))
		$(this).unbind('click')
					var depositVal = $( 'tr#' + parentId + ' td.deposit' ).text()
					console.log(depositVal)
			if (depositVal)
			{
			$( 'tr#' + parentId + ' td' ).filter(  '.deposit' )
			.html( '<input type="text" id="editdeposit">' )
			$( '#editdeposit' ).maskMoney().trigger( 'focus' )
			$( 'input#editdeposit' ).on( 'keyup', function(event){
				if ( event.which == 13 )
				{
				newAmount = $( event.target ).val()
				

				
				$( 'button#save' ).css( 'opacity', 1 ).on( 'click', function(event){
					var data = {}
					data.deposit = newAmount
					data.payment = 0
					data.id = parentId
					
					$.ajax(
					{
						url : '/edit',
						method : 'POST',
						data : data
						}
					)
					.fail(function( jqXHR, textStatus, errorThrown ) {
					alert(errorThrown)
					})
					.done(function(){
						location.reload(true)
						//alert('Updated.')
						})//done
					})//ajax
				}//button#save				
				} )//on keyup
			}
			else
			{
			$( 'tr#' + parentId + ' td' ).filter(  '.payment' )
			.html( '<input type="text" id="editpayment">' )
			$( '#editpayment' ).maskMoney().trigger( 'focus' )
			$( 'input#editpayment' ).on( 'keyup', function(event){
				if ( event.which == 13 )
				{
				newAmount = $( event.target ).val()
			
				
				$( 'button#save' ).css( 'opacity', 1 ).on( 'click', function(event){
					var data = {}
					data.deposit = 0
					data.payment = newAmount
					data.id = parentId
					
					$.ajax(
					{
						url : '/edit',
						method : 'POST',
						data : data
						}
					)
					.fail(function( jqXHR, textStatus, errorThrown ) {
					alert(errorThrown)
					})
					.done(function(){
						location.reload(true)
						//alert('Updated.')
						})//done
					})//ajax
				}//button#save				
				} )//on keyup	
			}
				
							
		})//button#edit
		
				
		$( 'button#cancel' ).on('click', function(event){
				location.reload(false)
				
		})
				
		$( 'button#delete' ).on('click', function(event){
				var data = { id : parentId }
				$.ajax({
		  		method: "DELETE",
		  		url: "/delete",
  		 		data: data
		  		})
				.fail(function( jqXHR, textStatus, errorThrown ) {
					alert(errorThrown)
					})
		  		.always(function( msg ) {
			  	alert(msg)
				location.reload(true)
 		  		});//ajax  
		})				
		
	})			
})
