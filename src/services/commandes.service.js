"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "commandes",

	settings: {
 		state: {

 		}
	},

	actions: {

		//	call "commandes.create" --id_user ""
		create: {
			params: {
				id_user: "string"
			},
			handler(ctx) {
				var command = new Models.Todo_commande(ctx.params).create();
				if (command) {
					return Database()
					.then((db) => {
	 					return db.get("commandes")
							.push(command)
							.write()
							.then(() => {
								return command;
							})
							.catch(() => {
								return new MoleculerError("Commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					});
				} else {
							return new MoleculerError("Commandes", 417, "ERR_CRITIAL", { code: 417, message: "Command is not valid" } )
				}
				
			}
		},

		//	call "commandes.getAll"
		getAll: {
			params: {

			},
			handler(ctx) {
				return Database()
					.then((db) => {
						return db.get("commandes").value();
					});
			}
		},

		//call "commandes.get_command" --id_command ""
		get_command: {
			params: {
				id_command: "string"
			},
			handler(ctx) {
				return ctx.call("commandes.verify_commande", { id_command: ctx.params.id_command })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var user_command = db.get("commandes").find({ id_command: ctx.params.id_command }).value();;
								return user_command;
							})
							.catch(() => {
								return new MoleculerError("Commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Commandes", 404, "ERR_CRITIAL", { code: 404, message: "Command doesn't exists" } )
					}
				})
			}
		},

		//call "commandes.get_user" --id_user ""
		get_user: {
			params: {
				id_user: "string"
			},
			handler(ctx) {
				return ctx.call("commandes.verify_user", { id_user: ctx.params.id_user })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var user_command = db.get('commandes').filter( { id_user: ctx.params.id_user } ).map('id_command').value();;
								return user_command;
							})
							.catch(() => {
								return new MoleculerError("Commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Commandes", 404, "ERR_CRITIAL", { code: 404, message: "Command doesn't exists" } )
					}
				})
			}
		},

		//	call "commandes.verify_user" --id_command
		verify_user: {
			params: {
				id_user: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("commandes")
										.filter({ id_user: ctx.params.id_user })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		//	call "commandes.verify_commande" --id_command
		verify_commande: {
			params: {
				id_command: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("commandes")
										.filter({ id_command: ctx.params.id_command })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		//	call "commandes.validate" --id_command
		validate: {
			params: {
				id_command: "string"
			},
			handler(ctx) {
				return ctx.call("commandes.get_command", { id_command: ctx.params.id_command })
				.then((db_todo) => {
				//
					var todo_command = new Models.Todo_commande(db_todo).create();
					todo_command.validate = true; 
					return Database()
					.then((db) => {
						return db.get("commandes")
							.find({ id_command: ctx.params.id_command })
							.assign(todo_command)
							.write()
							.then(() => {
								return todo_command;
							})
							.catch(() => {
								return new MoleculerError("Commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
							});
					})
				})
			}
		},

		// call "commandes.edit_increment" --id_command "" --id_produit ""
		edit_increment: {
			params: {
				id_command: "string",
				id_produit: "string"
			},
			handler(ctx) {
				return ctx.call("commandes.get_command", { id_command: ctx.params.id_command })
						.then((db_com) => {
							//
							var com = new Models.Todo_commande(db_com).create();
							com.id_produit = ctx.params.id_produit || db_com.id_produit;
							com.quantity = (db_com.quantity + 1);
							//
							return Database()
								.then((db) => {
									return db.get("commandes")
										.find({ id_command: ctx.params.id_command })
										.assign(com)
										.write()
										.then(() => {
											return com;
										})
										.catch(() => {
											return new MoleculerError("Commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
			}
		},

		// call "commandes.edit_decrement" --id_command "" --id_produit ""
		edit_decrement: {
			params: {
				id_command: "string",
				id_produit: "string"
			},
			handler(ctx) {
				return ctx.call("commandes.get_command", { id_command: ctx.params.id_command })
						.then((db_com) => {
							//
							var com = new Models.Todo_commande(db_com).create();
							com.id_produit = ctx.params.id_produit || db_com.id_produit;
							com.quantity = (db_com.quantity - 1);
							//
							return Database()
								.then((db) => {
									return db.get("commandes")
										.find({ id_command: ctx.params.id_command })
										.assign(com)
										.write()
										.then(() => {
											return com;
										})
										.catch(() => {
											return new MoleculerError("Commandes", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
			}
		}	
	}
}