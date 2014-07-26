/**
 * Created by Maxim on 13/07/2014.
 */
var HubComposite = function(id, name) {
    ServerComponent.apply(this, [id, name]);
    this.servers = [];
};

HubComposite.prototype = Object.create(ServerComponent.prototype);
HubComposite.prototype.constructor = HubComposite;

HubComposite.prototype.add = function(server) {
    this.servers.push(server);
};
HubComposite.prototype.remove = function(server) {
    for(var s, i = 0; s = this.getServer(i); i++) {
        if(s == server) {
            this.servers.splice(i, 1);
            return true;
        }

        if(s.remove(server)) {
            return true;
        }
    }
    return false;
};
HubComposite.prototype.getServer = function(id) {
    return this.servers[id];
};
HubComposite.prototype.calculatePing = function() {
    var totalPing = 0;
    for(serverKey in this.servers) {
        totalPing += parseFloat(this.servers[serverKey]["ping"]);
    }

    return Math.round(totalPing) / this.servers.length;
};
HubComposite.prototype.calculateOnlinePlayers = function() {
    this.players.online = 0;
    for(var key in this.servers) {
        this.players.online += this.servers[key].calculateOnlinePlayers();
    }
    return this.players.online;
};
HubComposite.prototype.calculateMaxPlayers = function() {
    this.players.max = 0;
    for(var key in this.servers) {
        this.players.max += this.servers[key].calculateMaxPlayers();
    }
    return this.players.max;
};

/*HubComposite.prototype.draw = function() {

    var self = this;

    console.log(self.calculateMaxPlayers());

    var templateFile = "server.mst";

    if(self.available == false) {
        templateFile = 'server_unavailable.mst';
    }

    $.get(self.templateDir + '/' + templateFile, function(template){

        var data = {
            available: self.available,
            server: {
                name: self.name,
                id: "server-" + self.id,
                ping: Math.floor(self.ping * 1000) + "ms"
            },
            players: {
                percentage: self.calculatePercentage(),
                online: self.calculateOnlinePlayers(),
                max: self.calculateMaxPlayers()
            },
            favicon: self.favicon,
            description: self.description
        };
        var rendered = Mustache.render(template, data);

        self.element = $(rendered);
        self.drawn = true;

        if(typeof callback !== "undefined") {
            callback(rendered);
        }
    });
}; */