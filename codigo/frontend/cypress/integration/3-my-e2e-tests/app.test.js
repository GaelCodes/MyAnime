describe('Use case - see lasts animes episodes', () => {

    it('should visit index.html and see episodes cards and animes cards', () => {
        cy.visit('../../public/index.html');

        cy.get('.episodeCard');
        cy.get('.animeCard');
    });
});