describe('Slider', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render slider with input[type="range"]', () => {
    cy.get('ay-slider').first().should('be.visible');
    cy.get('ay-slider').first().find('input[type="range"]')
      .should('exist');
  });

  it('should have min/max/step attributes', () => {
    cy.get('ay-slider').first().find('input[type="range"]')
      .should('have.attr', 'min', '0')
      .and('have.attr', 'max', '100')
      .and('have.attr', 'step', '1');
  });

  it('should show disabled state', () => {
    cy.get('ay-slider.ay-slider--disabled').should('exist');
    cy.get('ay-slider.ay-slider--disabled').find('input[type="range"]')
      .should('be.disabled');
  });
});
