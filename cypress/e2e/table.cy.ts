describe('Table', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render table with headers and rows', () => {
    cy.get('ponyo-table').first().within(() => {
      cy.get('.ponyo-table').should('be.visible');
      cy.get('.ponyo-table-th').should('have.length.at.least', 4);
      cy.get('.ponyo-table-row').should('have.length', 5);
    });
  });

  it('should have zebra striping on even rows', () => {
    cy.get('ponyo-table .ponyo-table-row').eq(1)
      .should('have.css', 'background-color', 'rgb(244, 245, 247)'); // var(--surface)
  });

  it('should have sortable column headers', () => {
    cy.get('ponyo-table .ponyo-table-th--sortable')
      .should('have.length.at.least', 1)
      .first()
      .should('have.css', 'cursor', 'pointer');
  });

  it('should toggle sort on click', () => {
    cy.get('ponyo-table .ponyo-table-th--sortable').first().click();
    cy.get('ponyo-table .ponyo-table-th--sorted').should('exist');
  });

  it('should have selection checkboxes', () => {
    cy.get('ponyo-table .ponyo-table-check').should('have.length.at.least', 6); // 1 header + 5 rows
  });

  it('should select row on checkbox click', () => {
    cy.get('ponyo-table .ponyo-table-row').first().within(() => {
      cy.get('.ponyo-table-check').click();
    });
    cy.get('ponyo-table .ponyo-table-row--selected').should('have.length', 1);
  });

  it('should select all rows on header checkbox click', () => {
    cy.get('ponyo-table .ponyo-table-th--check .ponyo-table-check').click();
    cy.get('ponyo-table .ponyo-table-row--selected').should('have.length', 5);
  });

  it('should render custom cell template for status', () => {
    cy.get('ponyo-table .demo-badge').should('have.length', 5);
  });

  it('should have accessible sort aria attributes', () => {
    cy.get('ponyo-table .ponyo-table-th--sortable').first().click();
    cy.get('ponyo-table .ponyo-table-th--sorted')
      .should('have.attr', 'aria-sort');
  });
});
