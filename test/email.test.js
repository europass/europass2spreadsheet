const expect = require("chai").expect;
const emailNotifier = require("../services/email-notifier");

describe("email-notifier", function() {
  it("should init the email service", function() {
    const emailConfig = emailNotifier.imap;
    expect(emailConfig.user).to.be.equal('eworx-vm');
    expect(emailConfig.password).to.be.equal('v@ng3l1sm_');
    expect(emailConfig.host).to.be.equal('mail.eworx.gr');
    expect(emailConfig.port).to.be.equal(993);
  });
  
});
