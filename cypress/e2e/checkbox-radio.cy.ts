describe('Checkbox', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render checkbox with correct structure', () => {
    cy.get('ay-checkbox').first().within(() => {
      cy.get('.ay-checkbox-box')
        .should('be.visible')
        .and('have.css', 'width', '16px')
        .and('have.css', 'height', '16px');
      cy.get('.ay-checkbox-label').should('be.visible');
    });
  });

  it('should toggle checkbox on click', () => {
    cy.get('ay-checkbox').first()
      .should('not.have.class', 'ay-checkbox--checked')
      .click()
      .should('have.class', 'ay-checkbox--checked');
  });

  it('should toggle checkbox on Space key', () => {
    cy.get('ay-checkbox').first().within(() => {
      cy.get('.ay-checkbox-box').focus().type(' ');
    });
    cy.get('ay-checkbox').first()
      .should('have.class', 'ay-checkbox--checked');
  });

  it('should show checked state with primary color', () => {
    cy.get('ay-checkbox').first().click();
    cy.get('ay-checkbox.ay-checkbox--checked').first().within(() => {
      cy.get('.ay-checkbox-box')
        .should('have.css', 'background-color', 'rgb(20, 122, 121)')
        .and('have.css', 'border-color', 'rgb(20, 122, 121)');
    });
  });

  it('should show indeterminate state', () => {
    cy.get('ay-checkbox.ay-checkbox--indeterminate').first().within(() => {
      cy.get('.ay-checkbox-box')
        .should('have.css', 'background-color', 'rgb(20, 122, 121)');
    });
  });

  it('should show disabled state', () => {
    cy.get('ay-checkbox.ay-checkbox--disabled')
      .should('have.css', 'cursor', 'not-allowed')
      .and('have.css', 'opacity', '0.5');
  });

  it('should have aria-checked attribute', () => {
    cy.get('ay-checkbox').first().within(() => {
      cy.get('.ay-checkbox-box').should('have.attr', 'role', 'checkbox');
      cy.get('.ay-checkbox-box').should('have.attr', 'aria-checked', 'false');
    });
    cy.get('ay-checkbox').first().click();
    cy.get('ay-checkbox').first().within(() => {
      cy.get('.ay-checkbox-box').should('have.attr', 'aria-checked', 'true');
    });
  });
});

describe('Radio', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render radio with correct structure', () => {
    cy.get('ay-radio').first().within(() => {
      cy.get('.ay-radio-circle')
        .should('be.visible')
        .and('have.css', 'width', '16px')
        .and('have.css', 'height', '16px')
        .and('have.css', 'border-radius', '50%');
      cy.get('.ay-radio-label').should('be.visible');
    });
  });

  it('should select radio on click', () => {
    cy.get('ay-radio').first()
      .should('not.have.class', 'ay-radio--selected')
      .click()
      .should('have.class', 'ay-radio--selected');
  });

  it('should show selected state with primary color', () => {
    cy.get('ay-radio').first().click();
    cy.get('ay-radio.ay-radio--selected').first().within(() => {
      cy.get('.ay-radio-circle')
        .should('have.css', 'border-color', 'rgb(20, 122, 121)');
    });
  });

  it('should have aria-checked attribute', () => {
    cy.get('ay-radio').first().within(() => {
      cy.get('.ay-radio-circle').should('have.attr', 'role', 'radio');
    });
  });

  it('should show disabled state', () => {
    cy.get('ay-radio.ay-radio--disabled')
      .should('have.css', 'cursor', 'not-allowed')
      .and('have.css', 'opacity', '0.5');
  });
});
