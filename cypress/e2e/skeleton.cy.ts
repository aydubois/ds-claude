describe('Skeleton', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render skeleton elements', () => {
    cy.get('ay-skeleton').should('have.length.at.least', 1);
  });

  it('should have text variant visible', () => {
    cy.get('ay-skeleton.ay-skeleton--text').should('be.visible');
  });

  it('should have circle variant with border-radius 50%', () => {
    cy.get('ay-skeleton.ay-skeleton--circle')
      .should('be.visible')
      .and('have.css', 'border-radius', '50%');
  });

  it('should have rect variant visible', () => {
    cy.get('ay-skeleton.ay-skeleton--rect').should('be.visible');
  });

  it('should have aria-hidden="true"', () => {
    cy.get('ay-skeleton').first()
      .should('have.attr', 'aria-hidden', 'true');
  });

  it('should have shimmer animation', () => {
    cy.get('ay-skeleton').first().find('.ay-skeleton-shimmer')
      .should('have.css', 'animation')
      .and('not.be.empty');
  });
});
