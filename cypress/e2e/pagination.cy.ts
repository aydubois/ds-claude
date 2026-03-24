describe('Pagination', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render pagination with info and controls', () => {
    cy.get('ay-pagination').first().within(() => {
      cy.get('.ay-pagination-info').should('contain.text', '1');
      cy.get('.ay-pagination-btn').should('have.length.at.least', 5);
    });
  });

  it('should have active page button styled', () => {
    cy.get('ay-pagination .ay-pagination-btn.ay-pagination-btn--active')
      .should('have.length', 1)
      .and('have.css', 'background-color', 'rgb(20, 122, 121)')
      .and('have.css', 'color', 'rgb(255, 255, 255)');
  });

  it('should have first/prev buttons disabled on page 1', () => {
    cy.get('ay-pagination .ay-pagination-btn').eq(0).should('be.disabled');
    cy.get('ay-pagination .ay-pagination-btn').eq(1).should('be.disabled');
  });

  it('should navigate to next page', () => {
    // Click next button (last button)
    cy.get('ay-pagination .ay-pagination-btn').last().click();
    cy.get('ay-pagination .ay-pagination-info').should('contain.text', '11');
  });

  it('should show ellipsis for many pages', () => {
    cy.get('ay-pagination').first().within(() => {
      // Click numbered page buttons to get to middle (page 5+)
      // First click "next" (second to last btn) several times
      cy.get('.ay-pagination-btn').eq(-2).click(); // page 2
      cy.get('.ay-pagination-btn').eq(-2).click(); // page 3
      cy.get('.ay-pagination-btn').eq(-2).click(); // page 4
      cy.get('.ay-pagination-btn').eq(-2).click(); // page 5
      cy.get('.ay-pagination-ellipsis').should('have.length.at.least', 1);
    });
  });

  it('should have correct button dimensions', () => {
    cy.get('ay-pagination .ay-pagination-btn').first()
      .should('have.css', 'width', '28px')
      .and('have.css', 'height', '28px')
      .and('have.css', 'border-radius', '4px');
  });

  it('should have navigation role', () => {
    cy.get('ay-pagination')
      .should('have.attr', 'role', 'navigation');
  });
});
