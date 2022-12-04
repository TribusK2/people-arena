describe('Main page', () => {
  it('should handle fight with one winer', () => {
    let interceptCount = 0;
    cy.intercept('GET', 'https://www.swapi.tech/api/people/*', (req) => {
      req.reply(res => {     
        if (interceptCount === 0 ) {
          interceptCount += 1;
          res.send({ fixture: 'fighterA.json' })
        } else {
          res.send({ fixture: 'fighterB.json' })
        }
      }); 
    });
    cy.visit('/');
    cy.contains('Skull Arena');

    cy.get('.cardBack').first().click();
    cy.get('.cardBack').last().click();

    cy.contains('Darth Vader WIN!')
  })

  it('should handle fight with one one win', () => {
    let interceptCount = 0;
    cy.intercept('GET', 'https://www.swapi.tech/api/people/*', (req) => {
      req.reply(res => {     
        if (interceptCount === 0 ) {
          interceptCount += 1;
          res.send({ fixture: 'fighterA.json' })
        } else {
          res.send({ fixture: 'fighterA.json' })
        }
      }); 
    });
    cy.visit('/');
    cy.contains('Skull Arena');

    cy.get('.cardBack').first().click();
    cy.get('.cardBack').last().click();

    cy.contains('Both survive!')
  });

  it('should trigger new fight', () => {
    cy.visit('/');

    cy.get('.cardBack').first().click();
    cy.get('.cardBack').last().click();

    cy.get('.actionsFiled > .mdc-button').first().click()
  });

  it('should reset wins', () => {
    cy.visit('/');

    cy.get('.wins__result').first().should('contain', 0);
    cy.get('.wins__result').last().should('contain', 0);

    cy.get('.cardBack').first().click();
    cy.get('.cardBack').last().click();
    
    cy.get('.wins__nav > .mdc-icon-button').first().click()

    cy.get('.wins__result').first().should('contain', 0);
    cy.get('.wins__result').last().should('contain', 0);
  });
})