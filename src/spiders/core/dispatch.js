const _          = require('lodash'),
      nodemailer = require('nodemailer'),
      smtpPool   = require('nodemailer-smtp-pool');

function dispatch(data) {

  var messages = [];

  data.forEach(site => {
    site.searches.forEach(search => {

      let to      = search.email,
          from    = '"SpeedLease" <dispatch@speed.lease>',
          subject = 'SpeedLease 🍕 Updates - '+ site.criteria.site.long + (site.criteria.hood.short !== 'default' ? ' ('+ site.criteria.hood.long +') ' : ''),
          text    = 'Number of new posts: '+ site.updates.length,
          html    = 'Number of new posts: '+ site.updates.length +' <a href="http://localhost:3002/search/'+ search.id +'">Your Custom Search</a>';

      let m = {
        to:      to,
        from:    from,
        subject: subject,
        text:    text,
        html:    html
      };

      messages = messages.concat(m);
    })
  });

  let transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    pool: true,
    secure: true,
    auth: {
        user: 'skygeist@gmail.com',
        pass: 'wouldyoukindly2'
    }
  });

  transport.on('idle', function(){
    while(transport.isIdle() && messages.length) {
      transport.sendMail(messages.shift());
    }
  });
}

module.exports = dispatch;
