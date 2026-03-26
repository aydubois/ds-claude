describe('Segmented Menu', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render segmented menu', () => {
    cy.get('ay-segmented-menu').should('be.visible');
  });

  it('should have multiple options', () => {
    cy.get('ay-segmented-menu .ay-segment-option')
      .should('have.length', 3);
  });

  it('should select option on click (class ay-segment-option--selected)', () => {
    cy.get('ay-segmented-menu .ay-segment-option').eq(1).click();
    cy.get('ay-segmented-menu .ay-segment-option').eq(1)
      .should('have.class', 'ay-segment-option--selected');
  });

  it('should have primary background color on selected option', () => {
    cy.get('ay-segmented-menu .ay-segment-option').eq(0).click();
    cy.get('ay-segmented-menu .ay-segment-option--selected')
      .should('have.css', 'background-color')
      .and('not.eq', 'rgba(0, 0, 0, 0)');
  });

  it('should have role="radiogroup"', () => {
    cy.get('ay-segmented-menu')
      .should('have.attr', 'role', 'radiogroup');
  });
});
