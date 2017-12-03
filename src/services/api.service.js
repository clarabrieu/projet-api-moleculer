"use strict";

const ApiGateway = require("moleculer-web");


module.exports = {
	name: "api",
	mixins: [ ApiGateway],

	settings: {
		port: process.env.PORT || 9000,

        cors: {
            // Configures the Access-Control-Allow-Origin CORS header.
            origin: "*",
            // Configures the Access-Control-Allow-Methods CORS header.
            methods: ["GET", "PATCH", "OPTIONS", "POST", "PUT", "DELETE"],
            // Configures the Access-Control-Allow-Headers CORS header.
            allowedHeaders: ["Content-Type"],
            // Configures the Access-Control-Expose-Headers CORS header.
            exposedHeaders: [],
            // Configures the Access-Control-Allow-Credentials CORS header.
            credentials: false,
            // Configures the Access-Control-Max-Age CORS header.
            maxAge: 3600
        },

		routes: [

			{
				path: "/status/",
				whitelist: [
					// Access to any actions in all services
					"*"
				],
				aliases: {
					// The `name` comes from named param.
					// You can access it with `ctx.params.name` in action
					// "GET hi/:name": "greeter.welcome",
					// "POST user/:auth0_id": "user.create",
					"GET server": "application.configuration",
					"GET health": "application.health",
					"GET database": "application.database",
					"GET reset": "application.reset"
				}
			},
			{
				bodyParsers: {
	                json: true,
	            },
				path: "/api/v1/",
				whitelist: [
					// Access to any actions in all services
					"*"
				],
				aliases: {
					"POST user": "utilisateurs.create",
					"GET user/:email": "utilisateurs.get",
					"PATCH user/:email": "utilisateurs.edit",
					"POST product": "produits.create",
					"GET product/:id_produit": "produits.get",
					"PATCH product/:id_produit": "produits.edit",
					"PATCH product/:id_produit/increment": "produits.add_quantity",
					"PATCH product/:id_produit/decrement": "produits.suppr_quantity",
					"POST order/user/:id_user": "commandes.create",
					"GET order/:id_command": "commandes.get_command",
					"GET order/user/:id_user": "commandes.get_user",
					"PATCH order/:id_command/product/:id_produit/increment": "commandes.edit_increment",
					"PATCH order/:id_command/product/:id_produit/decrement": "commandes.edit_decrement",
					"PATCH order/:id_command": "commandes.validate"
				}
			},
			{
				bodyParsers: {
	                json: true,
	            },
				path: "/client/",
				whitelist: [
					// Access to any actions in all services
					"*"
				],
				aliases: {
					//	Example project
				}
			}
		]

	}
};
