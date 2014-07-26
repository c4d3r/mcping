/**
 * Created by Maxim on 13/07/2014.
 */
/**
 *
 * @param id
 * @param name
 * @constructor
 * @abstract
 */
var ServerComponent = function(id, name) {

    if(this.constructor === ServerComponent) {
        throw new Error("Can't instantiate abstract class");
    }

    this.id = id;
    this.name = name;
    this.players = {
        online: 0,
        max: 0,
        sample: []
    };
    this.version = [];
    this.favicon = null;
    this.description = null;
    this.element = null;
    this.ping = 0;
    this.drawn = false;
    this.available = false;
    this.templateDir = '';
};

ServerComponent.prototype.setTemplateDir = function(templateDir) {
    this.templateDir = templateDir;
};

ServerComponent.prototype.calculatePercentage = function() {
    var players = this.players.online;
    var max = this.players.max;
    return max == 0 ? 0 : (players / max * 100);
};
ServerComponent.prototype.calculateOnlinePlayers = function() {
    return this.players.online;
};
ServerComponent.prototype.calculateMaxPlayers = function() {
    return this.players.max;
};
ServerComponent.prototype.calculatePing = function() {
    return this.ping;
};
ServerComponent.prototype.update = function() {
    var self = this;
    //redraw template and put in correct html
    self.draw(function(data){
        $("#" + self.element.attr("id")).html(data);
    });
};

ServerComponent.prototype.draw = function(callback) {

    var self = this;

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
                ping: Math.floor(self.calculatePing() * 1000) + "ms"
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
};
