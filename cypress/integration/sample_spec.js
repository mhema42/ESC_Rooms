describe("Test my site is working", () => {
    it("Visits the localhost of my site", () => {
        cy.visit("http://localhost:3000")
    })
    it("Test if my site contains the text - Hacker Escape Rooms", () => {
        cy.get("header").contains("Hacker Escape Rooms")
    })
    it("Clicks on menu item - Play online", () => {
        cy.get('.hero-cta-online').click()
    })
});