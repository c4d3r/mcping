/**
 * Created by Maxim on 13/07/2014.
 */
var App = function(url, options) {

    if(url === undefined || url.length === 0) {
        $.error("No url specified");
    }

    this.configs = {
        url: url,
        enabledTheme: 'default',
        templateDir: 'templates/'
    };

    this.configs.templateDir = this.configs.templateDir + this.configs.enabledTheme;

    this.configs = $.extend({}, this.configs, options || {});

    this.serverComponents = [];
    this.data = [];
    this.isStarted = false;

    this.start();
};

App.prototype.start = function() {

    var self = this
        , hub
        , server
        , _app = self;

    $.getJSON(self.configs.url + "/index.php?COMMAND=getserverids", function(serverIds) {

        for (var i in serverIds) {

            // HUB
            if (isObject(serverIds[i])) {
                hub = new HubComposite(i, serverIds[i]["name"]);
                hub.setTemplateDir(self.configs.templateDir);

                for (var j = 0; j < Object.size(serverIds[i]["servers"]); j++) {
                    hub.add(new Server(j, serverIds[i]["servers"][j]["name"]));
                }
                _app.serverComponents.push(hub);

                hub.draw(function(data){
                    $('#servers').append(data);
                });


                // SERVER
            } else {
                server = new Server(i, serverIds[i]);
                server.setTemplateDir(self.configs.templateDir);

                _app.serverComponents.push(server);
                server.draw( function(data){
                    $('#servers').append(data);
                });
            }
        }


        _app.retrieve();
    });
};

App.prototype.getServerData = function(serverId) {

    var self = this;

    $.ajax({
        type: "POST",
        url: self.configs.url,
        data: { id : self.serverComponents[serverId].id },
        timeout: 15000,
        dataType:"json",
        success: function (data) {

            if(typeof data["success"] !== 'undefined') {
                self.serverComponents[serverId]["available"] = data['success'];
            }

            if(isObject(data) && data.hasOwnProperty("subServers")) {
                var servers = self.serverComponents[serverId]["servers"];

                for(var id in servers) {
                    $.extend(servers[id], data["subServers"][id]);
                }
                self.serverComponents[serverId].update();

            } else {
                self.data = data;

                $.extend(self.serverComponents[serverId], data);
                self.serverComponents[serverId].update();
            }

        },
        error: function (request, status, err) {
            console.log(err);
            if (status == "timeout") {
                //console.log("Error timeout");
                //change status to offline
                //this.servers[id].reset();
            } else {
                console.log(request.responseText);
                //this.servers[id].reset();
            }
        }
    });
};

App.prototype.retrieve = function() {

    var self = this;
    try {

        for(id in self.serverComponents) {
            self.getServerData(id);
        }

    }catch(e) {
        console.log(e.message);
    }


    setTimeout(function () {
        self.retrieve();
    }, 10000);
};

function isObject(val) {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
}
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};