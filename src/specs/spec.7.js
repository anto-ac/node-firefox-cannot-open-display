describe("Spec 7", function () {
  it("a test", function () {
    browser.url("http://www.google.com");
    expect(browser.getTitle()).to.be.equal("Google");
  });
});
