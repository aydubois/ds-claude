describe('Select', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render select with floating label', () => {
    cy.get('ay-select').first().within(() => {
      cy.get('.ay-select-box').should('be.visible')
        .and('have.css', 'height', '40px')
        .and('have.css', 'cursor', 'pointer');
      cy.get('.ay-select-label').should('be.visible');
      cy.get('.ay-select-arrow').should('exist');
    });
  });

  it('should open dropdown on click', () => {
    cy.get('ay-select').first().within(() => {
      cy.get('.ay-select-box').click();
      cy.get('.ay-select-dropdown').should('be.visible');
      cy.get('.ay-select-option').should('have.length.at.least', 1);
    });
  });

  it('should select an option and close dropdown', () => {
    cy.get('ay-select').first().within(() => {
      cy.get('.ay-select-box').click();
      cy.get('.ay-select-option').first().click();
      cy.get('.ay-select-dropdown').should('not.exist');
      cy.get('.ay-select-box').should('contain.text', 'Administrateur');
    });
  });

  it('should show error state', () => {
    cy.get('ay-select.ay-select--error').first().within(() => {
      cy.get('.ay-select-box')
        .should('have.css', 'border-color', 'rgb(194, 65, 43)');
      cy.get('.ay-select-error').should('be.visible');
    });
  });

  it('should show disabled state', () => {
    cy.get('ay-select.ay-select--disabled').first().within(() => {
      cy.get('.ay-select-box')
        .should('have.css', 'cursor', 'not-allowed');
    });
  });

  it('should navigate with keyboard', () => {
    cy.get('ay-select').first().within(() => {
      cy.get('.ay-select-box').focus().type('{enter}');
      cy.get('.ay-select-dropdown').should('be.visible');
      cy.get('.ay-select-box').type('{downarrow}{enter}');
      cy.get('.ay-select-dropdown').should('not.exist');
    });
  });

  it('should close on Escape', () => {
    cy.get('ay-select').first().within(() => {
      cy.get('.ay-select-box').click();
      cy.get('.ay-select-dropdown').should('be.visible');
      cy.get('.ay-select-box').type('{esc}');
      cy.get('.ay-select-dropdown').should('not.exist');
    });
  });
});
