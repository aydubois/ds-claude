describe('Spinner', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render spinner with ay-spinner selector', () => {
    cy.get('ay-spinner').should('have.length.at.least', 1);
    cy.get('ay-spinner').first().should('be.visible');
  });

  it('should have role="status" and aria-label', () => {
    cy.get('ay-spinner').first()
      .should('have.attr', 'role', 'status')
      .and('have.attr', 'aria-label', 'Chargement');
  });

  it('should have multiple sizes visible (sm, md, lg)', () => {
    cy.get('ay-spinner.ay-spinner--sm').should('be.visible');
    cy.get('ay-spinner.ay-spinner--md').should('be.visible');
    cy.get('ay-spinner.ay-spinner--lg').should('be.visible');
  });

  it('should have multiple colors visible (primary, danger, muted)', () => {
    cy.get('ay-spinner.ay-spinner--primary').should('be.visible');
    cy.get('ay-spinner.ay-spinner--danger').should('be.visible');
    cy.get('ay-spinner.ay-spinner--muted').should('be.visible');
  });

  it('should have spinning animation', () => {
    cy.get('ay-spinner').first().find('.ay-spinner-circle')
      .should('have.css', 'animation')
      .and('not.be.empty');
  });
});
