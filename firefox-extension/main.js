var self = require("self");

require("page-mod").PageMod({
  include : [ "https://mail.google.com/mail/u/*", "https://mail.google.com/mail/?ui=2&view=bsp*" ],
  contentScriptFile: [self.url("jquery-1.5.2.min.js"),
                      self.url("inline-player.js"),
                      self.url("gadget.js")],
  contentScript: "gadget(jQuery, '" + self.url("style.css") + "')",
  contentScriptWhen: 'end'
});

