/* The EntriesDAO must be constructed with a connected database object */
function EntriesDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof EntriesDAO)) {
        console.log('Warning: EntriesDAO constructor called without "new" operator');
        return new EntriesDAO(db);
    }

    var entries = db.collection("entries");

   

    this.getEntries = function( callback) {
        "use strict";

        entries.find( ).sort({date : 1 }).toArray(function(err, items) {
            "use strict";
            if (err) return callback(err, null);
			
			//compute balances
			var bal = 0;
			for ( var i =0; i < items.length; i++ )
			{
				
				bal = bal + items[i].deposit - items[i].payment;				
				
				items[i].balance = bal;					
			}

            console.log("Found " + items.length + " entries");

            callback(err, items);
        });
    }


	this.insertEntry = function( entry, callback ){
		
		
		entries.insert(entry, function (err, result) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Inserted new entry");
            callback(err, result);
        });
		}
		
		
		
	this.deleteEntry = function( entry, callback ){
		
				
		entries.remove( { '_id' : entry._id }, function (err, result) {
            "use strict";
			
		console.dir(result.date)


            if (err) {
				return callback(err, null);
			}
            				

            callback(err, result);
        });
		}
		
		
		this.updateEntry = function( obj, callback){
			
			entries.update( { _id : obj._id }, { $set : { deposit : obj.deposit, payment : obj.payment } }, function(err, doc){
				if (err) {
					return callback(err, null)
						}
						
			console.log(doc.deposit)			
			console.log(obj.payment)
			console.log('END')	
			callback(err, doc)		
			})
		}
		
		
		this.findEntries =  function(obj, callback){
			
			var key = obj.key,
			val= obj.val
			var query = {}, q1 = {}, q2 = {}
			var deposit = 'deposit', payment ='payment'
			//date needs to be a date object
			
			switch (key)
			{
			case 'date' :
			var parts = val.split('/');
			val = new Date( parts[2],parts[0]-1,parts[1] )
			query[key] = val;			
			break;
			
			case 'amount' :			
			var re = /\,/g
			val.replace( re, ''  )
			val = (val * 100)
			q1[deposit]	= val
			q2[payment] = val
			query = { $or : [ q1, q2 ] }//we will find the amount in payment OR deposit; returned document will say which it is
			break;
			
			case  'account' :
			query[key] = val;
			break;
			
			case 'payee' :
			query[key] = val;
			break;
			}
			
			
			
			entries.find( query ).toArray( function( err, items )
			{
				if (err) {
				return callback(err, null)
				}
				console.log(items)
				callback(null, items)
				})
			 
		
		}


		
}

module.exports.EntriesDAO = EntriesDAO;
