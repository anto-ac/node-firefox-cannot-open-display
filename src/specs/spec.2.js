describe("Spec 2", function () {
  it("a test", function () {
    browser.url("http://www.google.com");
    expect(browser.getTitle()).to.be.equal("Google");
  });
});
