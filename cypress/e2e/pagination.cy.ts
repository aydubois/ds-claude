describe('Pagination', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render pagination with info and controls', () => {
    cy.get('ponyo-pagination').first().within(() => {
      cy.get('.ponyo-pagination-info').should('contain.text', '1');
      cy.get('.ponyo-pagination-btn').should('have.length.at.least', 5);
    });
  });

  it('should have active page button styled', () => {
    cy.get('ponyo-pagination .ponyo-pagination-btn.ponyo-pagination-btn--active')
      .should('have.length', 1)
      .and('have.css', 'background-color', 'rgb(20, 122, 121)')
      .and('have.css', 'color', 'rgb(255, 255, 255)');
  });

  it('should have first/prev buttons disabled on page 1', () => {
    cy.get('ponyo-pagination .ponyo-pagination-btn').eq(0).should('be.disabled');
    cy.get('ponyo-pagination .ponyo-pagination-btn').eq(1).should('be.disabled');
  });

  it('should navigate to next page', () => {
    // Click next button (last button)
    cy.get('ponyo-pagination .ponyo-pagination-btn').last().click();
    cy.get('ponyo-pagination .ponyo-pagination-info').should('contain.text', '11');
  });

  it('should show ellipsis for many pages', () => {
    cy.get('ponyo-pagination').first().within(() => {
      // Click numbered page buttons to get to middle (page 5+)
      // First click "next" (second to last btn) several times
      cy.get('.ponyo-pagination-btn').eq(-2).click(); // page 2
      cy.get('.ponyo-pagination-btn').eq(-2).click(); // page 3
      cy.get('.ponyo-pagination-btn').eq(-2).click(); // page 4
      cy.get('.ponyo-pagination-btn').eq(-2).click(); // page 5
      cy.get('.ponyo-pagination-ellipsis').should('have.length.at.least', 1);
    });
  });

  it('should have correct button dimensions', () => {
    cy.get('ponyo-pagination .ponyo-pagination-btn').first()
      .should('have.css', 'width', '28px')
      .and('have.css', 'height', '28px')
      .and('have.css', 'border-radius', '4px');
  });

  it('should have navigation role', () => {
    cy.get('ponyo-pagination')
      .should('have.attr', 'role', 'navigation');
  });
});
