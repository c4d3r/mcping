/**
 * Created by Maxim on 13/07/2014.
 */
var Server = function(id, name) {
    ServerComponent.apply(this, [id, name]);
};

Server.prototype = Object.create(ServerComponent.prototype);
Server.prototype.constructor = Server;
