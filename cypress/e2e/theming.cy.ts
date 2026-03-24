describe('Theming', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should have color picker inputs', () => {
    cy.get('.demo-color-picker').should('have.length', 4);
    cy.get('.demo-color-picker input[type="color"]').should('have.length', 4);
  });

  it('should display current color values', () => {
    cy.get('.demo-color-picker code').first().should('contain.text', '#147a79');
  });

  it('should change primary color on picker change', () => {
    // Change primary to red
    cy.get('.demo-color-picker input[type="color"]').first()
      .invoke('val', '#ff0000')
      .trigger('input');

    // Buttons should reflect new primary color
    cy.get('button[ay-button][variant="filled"][color="primary"]').first()
      .should('have.css', 'background-color', 'rgb(255, 0, 0)');
  });

  it('should change danger color on picker change', () => {
    cy.get('.demo-color-picker input[type="color"]').eq(1)
      .invoke('val', '#9c27b0')
      .trigger('input');

    cy.get('button[ay-button][variant="filled"][color="danger"]').first()
      .should('have.css', 'background-color', 'rgb(156, 39, 176)');
  });
});
