describe('Checkbox', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render checkbox with correct structure', () => {
    cy.get('ponyo-checkbox').first().within(() => {
      cy.get('.ponyo-checkbox-box')
        .should('be.visible')
        .and('have.css', 'width', '16px')
        .and('have.css', 'height', '16px');
      cy.get('.ponyo-checkbox-label').should('be.visible');
    });
  });

  it('should toggle checkbox on click', () => {
    cy.get('ponyo-checkbox').first()
      .should('not.have.class', 'ponyo-checkbox--checked')
      .click()
      .should('have.class', 'ponyo-checkbox--checked');
  });

  it('should toggle checkbox on Space key', () => {
    cy.get('ponyo-checkbox').first().within(() => {
      cy.get('.ponyo-checkbox-box').focus().type(' ');
    });
    cy.get('ponyo-checkbox').first()
      .should('have.class', 'ponyo-checkbox--checked');
  });

  it('should show checked state with primary color', () => {
    cy.get('ponyo-checkbox').first().click();
    cy.get('ponyo-checkbox.ponyo-checkbox--checked').first().within(() => {
      cy.get('.ponyo-checkbox-box')
        .should('have.css', 'background-color', 'rgb(20, 122, 121)')
        .and('have.css', 'border-color', 'rgb(20, 122, 121)');
    });
  });

  it('should show indeterminate state', () => {
    cy.get('ponyo-checkbox.ponyo-checkbox--indeterminate').first().within(() => {
      cy.get('.ponyo-checkbox-box')
        .should('have.css', 'background-color', 'rgb(20, 122, 121)');
    });
  });

  it('should show disabled state', () => {
    cy.get('ponyo-checkbox.ponyo-checkbox--disabled')
      .should('have.css', 'cursor', 'not-allowed')
      .and('have.css', 'opacity', '0.5');
  });

  it('should have aria-checked attribute', () => {
    cy.get('ponyo-checkbox').first().within(() => {
      cy.get('.ponyo-checkbox-box').should('have.attr', 'role', 'checkbox');
      cy.get('.ponyo-checkbox-box').should('have.attr', 'aria-checked', 'false');
    });
    cy.get('ponyo-checkbox').first().click();
    cy.get('ponyo-checkbox').first().within(() => {
      cy.get('.ponyo-checkbox-box').should('have.attr', 'aria-checked', 'true');
    });
  });
});

describe('Radio', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render radio with correct structure', () => {
    cy.get('ponyo-radio').first().within(() => {
      cy.get('.ponyo-radio-circle')
        .should('be.visible')
        .and('have.css', 'width', '16px')
        .and('have.css', 'height', '16px')
        .and('have.css', 'border-radius', '50%');
      cy.get('.ponyo-radio-label').should('be.visible');
    });
  });

  it('should select radio on click', () => {
    cy.get('ponyo-radio').first()
      .should('not.have.class', 'ponyo-radio--selected')
      .click()
      .should('have.class', 'ponyo-radio--selected');
  });

  it('should show selected state with primary color', () => {
    cy.get('ponyo-radio').first().click();
    cy.get('ponyo-radio.ponyo-radio--selected').first().within(() => {
      cy.get('.ponyo-radio-circle')
        .should('have.css', 'border-color', 'rgb(20, 122, 121)');
    });
  });

  it('should have aria-checked attribute', () => {
    cy.get('ponyo-radio').first().within(() => {
      cy.get('.ponyo-radio-circle').should('have.attr', 'role', 'radio');
    });
  });

  it('should show disabled state', () => {
    cy.get('ponyo-radio.ponyo-radio--disabled')
      .should('have.css', 'cursor', 'not-allowed')
      .and('have.css', 'opacity', '0.5');
  });
});
