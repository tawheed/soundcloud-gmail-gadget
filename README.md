# SoundCloud Google Mail™ Gadget

Show SoundCloud waveform players for track links in Google Mail™ emails. It's available as Firefox Add-on, Chrome Extension and Google App Gadget.
It's based on [jQuery](http://www.jquery.org) and [jQuery Soundcloud Inline Player Plugin](https://github.com/soundcloudlabs/soundcloud-gmail-gadget/raw/master/vendor/inline-player-0.2.js).

![SoundCloud GMail Gadget](http://soundcloudlabs.com/images/projects/gmail.png)

[See more on SoundCloudLabs](http://soundcloudlabs.com)


## Deploy
To deploy, run `rake build_all` which builds all thee components into _build/_. For Google App, upload `application_manifest.xml` to [Google Market Place](https://www.google.com/enterprise/marketplace/viewVendorProfile) and deploy `gadget.xml`. For Firefox and Chrome, get _build/<extension file>_ and upload to the according stores.


## Examples
For a working example, run `rake example:build` and load `gadget.html` in any browser. Pass SoundCloud urls as _urls_ parameter:

> gadget.html?urls=http://soundcloud.com/max-quintenzirkus/max-quintenzirkus-bounce-1


## Gadget Development
Some useful pages for developing the gadget:

### Google App
- [Developers Guide](http://code.google.com/apis/gmail/gadgets/contextual)
- [Publish at Google Market Place](https://www.google.com/enterprise/marketplace/viewVendorProfile)
- [Active at Google App Dashboard](https://www.google.com/a/cpanel/soundcloud.com/UserHub)
- [Test GMail without Gadget Cache](https://mail.google.com/mail/u/1/?nogadgetcache=1)
- [Apply for custom extractors](http://developer.googleapps.com/preview)

### Firefox Add-on (Jetpack)
- [Developers SDK Announcement](http://blog.mozilla.com/addons/2011/05/05/announcing-add-on-sdk-1-0b5/)

### Chrome Extension
- [Developers Guide](http://code.google.com/chrome/extensions/devguide.html)
- [Publish at Google Market Place](http://code.google.com/chrome/extensions/packaging.html)
- [Chrome Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard)


## Todos
  none :-)


## Contributing

We'll check out your contribution if you:

- Provide a comprehensive suite of tests for your fork.
- Have a clear and documented rationale for your changes.
- Package these up in a pull request.

We'll do our best to help you out with any contribution issues you may have.


## License

The license is included as LICENSE in this directory.

