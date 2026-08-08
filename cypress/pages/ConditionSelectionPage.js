class ConditionSelectionPage {

    // ==========================================
    // PAGE LOAD
    // ==========================================

    assertLoaded() {
        cy.contains("Condition Selection", { timeout: 60000 })
            .should("be.visible");

        return this;
    }


    // ==========================================
    // FILL CONDITION SELECTION
    // ==========================================

    fillConditionSelection(data) {

        // ==========================================
        // SELECT PTSD ONLY
        // ==========================================

        cy.get('input[type="checkbox"]')
            .first()
            .should("exist")
            .check({ force: true })
            .should("be.checked");


        // ==========================================
        // WAIT FOR PTSD SECTION TO APPEAR
        // ==========================================

        cy.get('input[placeholder*="Agent Orange"]', {
            timeout: 15000
        })
            .eq(0)
            .should("be.visible");


        // ==========================================
        // PTSD INFORMATION
        // ==========================================

        // Exposure / Event / Injury
        cy.get('input[placeholder*="Agent Orange"]')
            .eq(0)
            .clear()
            .type(data.ptsd.exposure);


        // Relation to in-service event
        cy.get('input[placeholder*="Heavy equipment"]')
            .eq(0)
            .clear()
            .type(data.ptsd.relation);


        // Year
        cy.get('input[placeholder*="2009"]')
            .eq(0)
            .clear()
            .type(data.ptsd.year);


        // ==========================================
        // TOXIC EXPOSURE → NO
        // ==========================================

        cy.contains(
            "Are you claiming any conditions related to toxic exposures?",
            { timeout: 15000 }
        )
            .should("be.visible")
            .parent()
            .contains(data.toxicExposure)
            .should("be.visible")
            .click();


        return this;
    }


    // ==========================================
    // SAVE & CONTINUE
    // ==========================================

    saveAndContinue() {

        cy.contains("button", "Save and Continue", {
            timeout: 60000
        })
            .scrollIntoView()
            .should("be.visible")
            .and("not.be.disabled")
            .click();

        return this;
    }
}


export default new ConditionSelectionPage();