"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "utilisateurs",

	settings: {
 		state: {

 		}
	},

	actions: {

		//	call "utilisateurs.create" --email "Email" --lastName "last" --firstName "first"
		create: {
			params: {
				email: "string",
				lastName: "string",
				firstName: "string"
			},
			handler(ctx) {
				var user = new Models.Todo_utilisateur(ctx.params).create();
				console.log("Utilisateurs - create - ", user);
				return ctx.call("utilisateurs.verify", { email: ctx.params.email })
				.then((exists) => {
					if (exists === false) {
						if (user) {
							return Database()
								.then((db) => {
									return db.get("utilisateurs")
										.push(user)
										.write()
										.then(() => {
											return user;
										})
										.catch(() => {
											return new MoleculerError("Utilisateurs", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
										});
							});
						} else {
							return new MoleculerError("Utilisateurs", 417, "ERR_CRITIAL", { code: 417, message: "User is not valid" } )
						}
					} else {
						return new MoleculerError("Todos", 409, "ERR_CRITIAL", { code: 409, message: "User already exists" } )
					}
				})
			}
		},

		//	call "utilisateurs.getAll"
		getAll: {
			params: {

			},
			handler(ctx) {
				return Database()
					.then((db) => {
						return db.get("utilisateurs").value();
					});
			}
		},


		//	call "utilisateurs.get" --email "email"
		get: {
			params: {
				email: "string"
			},
			handler(ctx) {
				return ctx.call("utilisateurs.verify", { email: ctx.params.email })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var user = db.get("utilisateurs").find({ email: ctx.params.email }).value();;
								return user;
							})
							.catch(() => {
								return new MoleculerError("Utilisateurs", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("Utilisateurs", 404, "ERR_CRITIAL", { code: 404, message: "User doesn't exists" } )
					}
				})
			}
		},

		//	call "utilisateurs.verify" --email
		verify: {
			params: {
				email: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("utilisateurs")
										.filter({ email: ctx.params.email })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		//	call "utilisateurs.edit" --email "" --lastName "" --firstName ""
		edit: {
			params: {
				email: "string",
				lastName: "string",
				firstName: "string"
			},
			handler(ctx) {
				return ctx.call("utilisateurs.verify", { email: ctx.params.email })
				.then((exists) => {
					if (exists) {
						return ctx.call("utilisateurs.get", { email: ctx.params.email })
								.then((db_user) => {
									//
									var user = new Models.Todo_utilisateur(db_user).create();
									user.lastName = ctx.params.lastName || db_user.lastName;
									user.firstName = ctx.params.firstName || db_user.firstName;
									//
									return Database()
										.then((db) => {
											return db.get("utilisateurs")
												.find({ email: ctx.params.email })
												.assign(user)
												.write()
												.then(() => {
													return user.email;
												})
												.catch(() => {
													return new MoleculerError("Todos", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
												});
										})
								})
					} else {
						return new MoleculerError("Utilisateurs", 404, "ERR_CRITIAL", { code: 404, message: "User doesn't exists" } )
					}
				})
			}
		}



	}
};
