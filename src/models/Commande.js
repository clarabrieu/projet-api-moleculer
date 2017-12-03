const uuidv4 = require('uuid/v4');

var fields_reducers = {
	"id_user": (value) => value.length > 0
};


var Commande = function(params) {
	this.id_user = params.id_user || "";
	this.id_produit = params.id_produit || "";
	this.id_command = params.id_command || uuidv4();
	this.validate = params.validate || false;
	this.quantity = params.quantity || 0;
}

Commande.prototype.create = function() {

	var valid = true;

	var keys = Object.keys(fields_reducers);

	for (var i = 0; i < keys.length; i++)
	{
		if ( typeof this[keys[i]] != typeof undefined ) {
			if ( !fields_reducers[keys[i]](this[keys[i]]) )
			{
				valid = false;
			}
		}
		else
		{
			valid = false;
		}
	}

	if (valid) {
		return this;
	} else {
		return undefined;
	}
}


module.exports = Commande;
