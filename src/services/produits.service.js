"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "produits",

	settings: {
 		state: {

 		}
	},

	actions: {

		//	call "produits.create" --name "string" --description "string" --price "nb" --quantity "nb"
		create: {
			params: {
				name: "string",
				description: "string",
				price: "number",
				quantity: "number"
			},
			handler(ctx) {
				var todo_produit = new Models.Todo_produit(ctx.params).create();
				console.log("Todos_produit - create - ", todo_produit);
				if (todo_produit) {
					return Database()
						.then((db) => {
							return db.get("produits")
								.push(todo_produit)
								.write()
								.then(() => {
									return todo_produit;
								})
								.catch(() => {
									return new MoleculerError("Produits", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
								});
					});
				} else {
					return new MoleculerError("Produits", 417, "ERR_CRITIAL", { code: 417, message: "Product is not valid" } )
				}
			}
		},

		//	call "produits.getAll"
		getAll: {
			params: {

			},
			handler(ctx) {
				return Database()
					.then((db) => {
						return db.get("produits").value();
					});
			}
		},


		//	call "produits.get" --id_produit
		get: {
			params: {
				id_produit: "string"
			},
			handler(ctx) {
				return ctx.call("produits.verify", { id_produit: ctx.params.id_produit })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var user = db.get("produits").find({ id_produit: ctx.params.id_produit }).value();;
								return user;
							})
							.catch(() => {
								return new MoleculerError("Produits", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Produits", 404, "ERR_CRITIAL", { code: 404, message: "Product doesn't exists" } )
					}
				})
			}
		},

		//	call "produits.verify" --id_produit
		verify: {
			params: {
				id_produit: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("produits")
										.filter({ id_produit: ctx.params.id_produit })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		//	call "produits.edit" --id_produit "" --name "" --price "" --quantity ""
		edit: {
			params: {
				id_produit: "string",
				name: "string",
				price: "number",
				quantity: "number"
			},
			handler(ctx) {
				return ctx.call("produits.verify", { id_produit: ctx.params.id_produit })
				.then((exists) => {
					if (exists) {
						return ctx.call("produits.get", { id_produit: ctx.params.id_produit })
								.then((db_todo_prod) => {
									//
									var todo = new Models.Todo_produit(db_todo_prod).create();
									todo.id_produit = db_todo_prod.id_produit;
									todo.name = ctx.params.name || db_todo_prod.name;
									todo.price = ctx.params.price || 0;
									todo.quantity = ctx.params.quantity || db_todo_prod.quantity;
									//
									return Database()
										.then((db) => {
											return db.get("produits")
												.find({ id_produit: ctx.params.id_produit })
												.assign(todo)
												.write()
												.then(() => {
													return todo.id_produit;
												})
												.catch(() => {
													return new MoleculerError("Produits", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
												});
										})
								})
					} else {
						return new MoleculerError("Produits", 404, "ERR_CRITIAL", { code: 404, message: "Product doesn't exists" } )
					}
				})
			}
		},

		//	call "produits.add_quantity" --id_produit ""
		add_quantity: {
			params: {
				id_produit: "string"
			},
			handler(ctx) {
				return ctx.call("produits.verify", { id_produit: ctx.params.id_produit })
				.then((exists) => {
					if (exists) {
						return ctx.call("produits.get", { id_produit: ctx.params.id_produit })
								.then((db_todo_prod) => {
									//
									var product = new Models.Todo_produit(db_todo_prod).create();
									product.id_produit = db_todo_prod.id_produit;
									product.quantity = db_todo_prod.quantity + 1;
									//
									return Database()
										.then((db) => {
											return db.get("produits")
												.find({ id_produit: ctx.params.id_produit })
												.assign(product)
												.write()
												.then(() => {
													return [product.id_produit, product.quantity];
												})
												.catch(() => {
													return new MoleculerError("Produits", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
												});
										})
								})
					} else {
						return new MoleculerError("Produits", 404, "ERR_CRITIAL", { code: 404, message: "Product doesn't exists" } )
					}
				})
			}			
		},

		//	call "produits.suppr_quantity" --id_produit  ""
		suppr_quantity: {
			params: {
				id_produit: "string"
			},
			handler(ctx) {
				return ctx.call("produits.verify", { id_produit: ctx.params.id_produit })
				.then((exists) => {
					if (exists) {
						return ctx.call("produits.get", { id_produit: ctx.params.id_produit })
								.then((db_todo_prod) => {
									//
									var product = new Models.Todo_produit(db_todo_prod).create();
									product.id_produit = db_todo_prod.id_produit;
									product.quantity = db_todo_prod.quantity - 1;
									//
									return Database()
										.then((db) => {
											return db.get("produits")
												.find({ id_produit: ctx.params.id_produit })
												.assign(product)
												.write()
												.then(() => {
													return [product.id_produit, product.quantity];
												})
												.catch(() => {
													return new MoleculerError("Produits", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
												});
										})
								})
					} else {
						return new MoleculerError("Produits", 404, "ERR_CRITIAL", { code: 404, message: "Product doesn't exists" } )
					}
				})
			}			
		},
	}
};
