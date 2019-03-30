this["SPA_Templates"] = this["SPA_Templates"] || {};
this["SPA_Templates"]["login"] = this["SPA_Templates"]["login"] || {};
this["SPA_Templates"]["login"]["login"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        <span>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.messageModel : depth0)) != null ? stack1.message : stack1), depth0))
    + "</span>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"login-area\">\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.messageModel : depth0)) != null ? stack1.hasMessage : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    <form id=\"login-form\">\n        <ul>\n            <li>\n                <label>\n                    Username:\n                    <input type=\"text\" name=\"username\">\n                </label>\n            </li>\n            <li>\n                <label>\n                    Password:\n                    <input type=\"password\" name=\"password\">\n                </label>\n            <li>\n                <input type=\"submit\" value=\"Login\" class=\"btn btn-primary\">\n            </li>\n        </ul>\n    </form>\n</div>";
},"useData":true});
this["SPA_Templates"]["reversi"] = this["SPA_Templates"]["reversi"] || {};
this["SPA_Templates"]["reversi"]["game-board"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "";
},"useData":true});
this["SPA_Templates"]["reversi"]["game-screen"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return "<section id=\"game-start-controls\">\n    <button id=\"new-game-button\" class=\"btn btn-primary\">Start new game</button>\n    <button onclick=\"Reversi.reloadLobbies()\" class=\"btn btn-default\">Refresh lobbies</button>\n</section>\n\n<section id=\"lobby-list\">\n    "
    + ((stack1 = ((helper = (helper = helpers.lobbyList || (depth0 != null ? depth0.lobbyList : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lobbyList","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n</section>\n\n<section id=\"game-board\">\n    "
    + ((stack1 = ((helper = (helper = helpers.gameBoard || (depth0 != null ? depth0.gameBoard : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gameBoard","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n</section>";
},"useData":true});
this["SPA_Templates"]["reversi"]["lobby-list"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "        <li onclick=\"SPA.Data.joinLobby("
    + alias2(alias1((depth0 != null ? depth0.id : depth0), depth0))
    + ")\">Id: "
    + alias2(alias1((depth0 != null ? depth0.id : depth0), depth0))
    + "</li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "Lobbies:\n<ul>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.lobbies : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</ul>";
},"useData":true});
this["SPA_Templates"]["reversi"]["player-list"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    "
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\n    "
    + alias4(((helper = (helper = helpers.username || (depth0 != null ? depth0.username : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"username","hash":{},"data":data}) : helper)))
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.list || (depth0 && depth0.list) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.players : depth0),{"name":"list","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});