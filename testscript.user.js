// ==UserScript==
// @name        test_stat
// @namespace   de.die-staemme
// @version     0.1dev
// @description *
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       unsafeWindow
// @match       https://*.die-staemme.de/game.php?
// @include     https://*.die-staemme.de/game.php?*
// @copyright   2017+, the stabel, git
// @downloadURL -
// ==/UserScript==

var _version = "0.1dev";
var _config = {"running":"false","debug":"false"};

$(function(){
  var storage = localStorage;
  var storagePrefix="raussteller_v0.2+_";
  //Speicherfunktionen
  function storageGet(key,defaultValue) {
      var value= storage.getItem(storagePrefix+key);
      return (value === undefined || value === null) ? defaultValue : value;
  }
  function storageSet(key,val) {
      storage.setItem(storagePrefix+key,val);
  }
  storageSet("config",storageGet("config",_config));
  init_UI();
  sendstats("normal");

  function getStat(status){
    var stat = {};
    stat.id = hashCode(TribalWars.getGameData().player.name);
    var points = TribalWars.getGameData().player.points;
    stat.points = Math.floor(points/Math.pow(10,Math.floor(Math.log10(points))))*Math.pow(10,Math.floor(Math.log10(points)));
    stat.action = "test_stat:v"+_version+":"+status;
    stat.server = TribalWars.getGameData().world;
    stat.hash = hashCode
    return stat;
  }
  function sendstats(status){
    var stat = getStat(status);
    window.open("http://localhost/stat_receive.php?h="++"&p="+stat.points+"&s="+stat.server+"&pl="+stat.id+"&a="+stat.action, '_blank');
  }

  function init_UI(){
      //create UI_link
      var overview_menu = $("#overview_menu");
      var option_link = $("<a>")
      .attr("href","#")
      .attr("id","option_link")
      .text("stat_test")
      .click(function(){
          toggleSettingsVisibility();
      });
      var status_symbol = $("<span>")
      .attr("title","DS_Box Status")
      .attr("id","status_symbol")
      .attr("class",getSymbolStatus())
      .prependTo(option_link);
      $("#menu_row").prepend($("<td>").attr("class","menu-item").append(option_link));

      //options popup
      var settingsDivVisible = false;
      var overlay=$("<div>")
      .css({
          "position":"fixed",
          "z-index":"99999",
          "top":"0",
          "left":"0",
          "right":"0",
          "bottom":"0",
          "background-color":"rgba(255,255,255,0.6)",
          "display":"none"
      })
      .appendTo($("body"));
      var settingsDiv=$("<div>")
      .css({
          "position":"fixed",
          "z-index":"100000",
          "left":"50px",
          "top":"50px",
          "width":"500px",
          "height":"400px",
          "background-color":"white",
          "border":"1px solid black",
          "border-radius":"5px",
          "display":"none",
          "padding":"10px"
      })
      .appendTo($("body"));
      function toggleSettingsVisibility() {
          if(settingsDivVisible) {
              overlay.hide();
              settingsDiv.hide();
          } else {
              overlay.show();
              settingsDiv.show();
          }

          settingsDivVisible=!settingsDivVisible;
      }
      //Head
      $("<h2>").text("Einstellungen stat_testscript").appendTo(settingsDiv);
      //$("<img>").attr("src","http://localhost/stat_receive.php?p="+TribalWars.getGameData().player.points).appendTo(settingsDiv)
      //Foot
      $("<button>").text("Start/Stop").click(function(){
          toggleRunning();
      }).appendTo(settingsDiv);
      $("<button>").text("Schließen").click(function(){
          toggleSettingsVisibility();
          sendstats();
      }).appendTo(settingsDiv);
    }
    function toggleRunning(){
        var config = JSON.parse(storageGet("config"));
        config.running = ""+(config.running==="false");
        add_log("running set to "+config.running);
        storageSet("config",JSON.stringify(config));
        location.reload();
    }
    function getSymbolStatus(){
        if(JSON.parse(storageGet("config")).running==="true"){
            return "icon friend online";
        }else{
            return "icon friend offline";
        }
    }
    function add_log(text){
      if(JSON.parse(storageGet("config")).debug==="true"){
        var prefix = storagePrefix+timeConverter(Date.now())+" - ";
        console.log(prefix+text);
      }
    }
    function randomInterval(min,max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function percentage_randomInterval(average,deviation){
		  average=parseInt(average);
		  deviation = deviation > 100 ? 1 : deviation/100;
		  return randomInterval(average*(1+deviation),average*(1-deviation));
	  }
    function getPageAttribute(attribute){
        //gibt die php-Attribute zurück, also z.B. von* /game.php?*&screen=report* würde er "report" wiedergeben
        //return: String, wenn nicht vorhanden gibt es eine "0" zurück
        var params = document.location.search;
        var value = params.substring(params.indexOf(attribute+"=")+attribute.length+1,params.indexOf("&",params.indexOf(attribute+"=")) != -1 ? params.indexOf("&",params.indexOf(attribute+"=")) : params.length);
        return params.indexOf(attribute+"=")!=-1 ? value : "0";
    }
    function hashCode(s) {
      var hash = 0, i, chr;
      if (s.length === 0) return hash;
      for (i = 0; i < s.length; i++) {
        chr   = s.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    };
});
