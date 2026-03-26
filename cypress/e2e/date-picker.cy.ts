describe('Date Picker', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render date picker with floating label', () => {
    cy.get('ay-date-picker').first().should('be.visible');
    cy.get('ay-date-picker').first().find('.ay-date-picker-label')
      .should('be.visible')
      .and('contain.text', 'Date de début');
  });

  it('should open calendar dropdown on click', () => {
    cy.get('ay-date-picker').first().find('.ay-date-picker-input').click();
    cy.get('ay-date-picker').first().find('.ay-date-picker-dropdown')
      .should('be.visible');
  });

  it('should show month/year header', () => {
    cy.get('ay-date-picker').first().find('.ay-date-picker-input').click();
    cy.get('ay-date-picker').first().find('.ay-date-picker-month-label')
      .should('be.visible')
      .invoke('text')
      .should('match', /\w+ \d{4}/);
  });

  it('should navigate months with prev/next buttons', () => {
    cy.get('ay-date-picker').first().find('.ay-date-picker-input').click();
    cy.get('ay-date-picker').first().find('.ay-date-picker-month-label')
      .invoke('text').then((initialLabel) => {
        cy.get('ay-date-picker').first().find('.ay-date-picker-nav').last().click();
        cy.get('ay-date-picker').first().find('.ay-date-picker-month-label')
          .invoke('text')
          .should('not.eq', initialLabel.trim());
      });
  });

  it('should select a day', () => {
    cy.get('ay-date-picker').first().find('.ay-date-picker-input').click();
    cy.get('ay-date-picker').first()
      .find('.ay-date-picker-day:not(.ay-date-picker-day--other):not(.ay-date-picker-day--disabled)')
      .first()
      .click();
    cy.get('ay-date-picker').first().find('.ay-date-picker-dropdown')
      .should('not.exist');
    cy.get('ay-date-picker').first().find('.ay-date-picker-input')
      .should('not.have.value', '');
  });

  it('should show months grid on month label click', () => {
    cy.get('ay-date-picker').first().find('.ay-date-picker-input').click();
    cy.get('ay-date-picker').first().find('.ay-date-picker-month-label').click();
    cy.get('ay-date-picker').first().find('.ay-date-picker-months-grid')
      .should('be.visible');
  });

  it('should close with Escape', () => {
    cy.get('ay-date-picker').first().find('.ay-date-picker-input').click();
    cy.get('ay-date-picker').first().find('.ay-date-picker-dropdown')
      .should('be.visible');
    cy.get('ay-date-picker').first().find('.ay-date-picker-input')
      .type('{esc}', { force: true });
    cy.get('ay-date-picker').first().find('.ay-date-picker-dropdown')
      .should('not.exist');
  });

  it('should have disabled state', () => {
    cy.get('ay-date-picker.ay-date-picker--disabled')
      .should('exist');
    cy.get('ay-date-picker.ay-date-picker--disabled').find('.ay-date-picker-input')
      .should('be.disabled');
  });
});
