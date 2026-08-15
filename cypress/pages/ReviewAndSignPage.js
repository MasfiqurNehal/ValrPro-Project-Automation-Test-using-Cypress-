class ReviewAndSignPage {

    // ==========================================
    // ASSERT PAGE LOADED
    // ==========================================

    assertLoaded() {
        cy.contains("Review and Sign", { timeout: 60000 })
            .should("be.visible");

        return this;
    }


    // ==========================================
    // FILL REVIEW AND SIGN
    // ==========================================

    fillReviewAndSign() {

        // ==========================================
        // INFORMATION CORRECTION
        // ==========================================

        cy.get('textarea[placeholder*="My service exit date"]')
            .clear()
            .type(
                "All information has been reviewed and is correct."
            );


        // ==========================================
        // CERTIFICATION
        // ==========================================

        cy.get('input[placeholder="Enter certification"]')
            .clear()
            .type(
                "I certify that I have reviewed all information and confirm that it is accurate and complete."
            );


        // ==========================================
        // CONFIRM INFORMATION IS ACCURATE
        // CHECKBOX → CHECKED
        // ==========================================

        cy.contains(
            "Yes, I confirm all information is accurate and I am ready to sign."
        )
            .parent()
            .find('input[type="checkbox"]')
            .check({ force: true });


        // ==========================================
        // VETERAN SIGNATURE
        // DRAW RANDOM SIGNATURE
        // ==========================================

        cy.get('canvas')
            .should("be.visible")
            .scrollIntoView()
            .then(($canvas) => {

                const canvas = $canvas[0];

                const rect = canvas.getBoundingClientRect();

                const startX = rect.left + rect.width * 0.25;
                const startY = rect.top + rect.height * 0.55;

                const endX = rect.left + rect.width * 0.75;
                const endY = rect.top + rect.height * 0.45;

                cy.wrap($canvas)
                    .trigger("mousedown", {
                        clientX: startX,
                        clientY: startY,
                        force: true
                    })
                    .trigger("mousemove", {
                        clientX: startX + 30,
                        clientY: startY - 20,
                        force: true
                    })
                    .trigger("mousemove", {
                        clientX: startX + 60,
                        clientY: startY + 15,
                        force: true
                    })
                    .trigger("mousemove", {
                        clientX: startX + 90,
                        clientY: startY - 25,
                        force: true
                    })
                    .trigger("mousemove", {
                        clientX: startX + 120,
                        clientY: startY + 10,
                        force: true
                    })
                    .trigger("mousemove", {
                        clientX: endX,
                        clientY: endY,
                        force: true
                    })
                    .trigger("mouseup", {
                        clientX: endX,
                        clientY: endY,
                        force: true
                    });
            });


        // ==========================================
        // DATE SIGNED
        // ==========================================

        const today = new Date();

        const month = String(today.getMonth() + 1)
            .padStart(2, "0");

        const day = String(today.getDate())
            .padStart(2, "0");

        const year = today.getFullYear();

        const signedDate = `${year}-${month}-${day}`;

        cy.get('input[type="date"]')
            .clear()
            .type(signedDate);


        // ==========================================
        // REMARKS
        // ==========================================

        cy.get(
            'textarea[placeholder*="additional information in support"]'
        )
            .clear()
            .type(
                "I have reviewed the information provided in this claim and confirm that it is complete."
            );


        // ==========================================
        // CONSENT CHECKBOX 1
        // VSO / REPRESENTATIVE
        // CHECKED
        // ==========================================

        cy.contains(
            "I consent to VA release of information to my VSO or designated representative."
        )
            .parent()
            .find('input[type="checkbox"]')
            .check({ force: true });


        // ==========================================
        // CONSENT CHECKBOX 2
        // LAW ENFORCEMENT
        // CHECKED
        // ==========================================

        cy.contains(
            "I consent to VA release of this information to law enforcement officials."
        )
            .parent()
            .find('input[type="checkbox"]')
            .check({ force: true });


        // ==========================================
        // CONSENT CHECKBOX 3
        // COURT
        // CHECKED
        // ==========================================

        cy.contains(
            "I consent to VA release of this information to a court."
        )
            .parent()
            .find('input[type="checkbox"]')
            .check({ force: true });


        // ==========================================
        // CONSENT CHECKBOX 4
        // OBTAINING RECORDS
        // CHECKED
        // ==========================================

        cy.contains(
            "I consent to VA obtaining the records listed above."
        )
            .parent()
            .find('input[type="checkbox"]')
            .check({ force: true });


        // ==========================================
        // VBA NOTIFICATION TO VHA
        // SELECT NO CONSENT
        // ==========================================

        cy.contains(
            "I do NOT consent to have VBA notify VHA."
        )
            .parent()
            .find('input[type="radio"]')
            .check({ force: true });


        // ==========================================
        // DID VETERAN SIGN WITH X MARK?
        // NO
        // ==========================================

        cy.contains(
            "Did the veteran sign with an X mark?"
        )
            .parent()
            .contains("label", "No")
            .click();


        // ==========================================
        // ALTERNATE SIGNER?
        // NO
        // ==========================================

        cy.contains(
            "Was an alternate signer used?"
        )
            .parent()
            .contains("label", "No")
            .click();


        // ==========================================
        // POA / AUTHORIZED REPRESENTATIVE?
        // NO
        // ==========================================

        cy.contains(
            "Is a POA/authorized representative signing?"
        )
            .parent()
            .contains("label", "No")
            .click();


        return this;
    }


    // ==========================================
    // SAVE AND PREVIEW
    // ==========================================

    saveAndPreview() {

        cy.contains(
            "button",
            "Save and Preview"
        )
            .should("be.visible")
            .click();

        return this;
    }


    // ==========================================
    // HANDLE NEXT POPUP / E-SIGN FLOW
    // ==========================================

    completeNextFlow() {

        // Wait for the document generation step to finish before trying to advance.
        cy.contains(
            "Generating VA claim documents...",
            { timeout: 120000 }
        )
            .should("not.exist");

        cy.contains(
            "Please wait while we prepare and evaluate your documents. This process may take a moment.",
            { timeout: 120000 }
        )
            .should("not.exist");

        // Keep polling for the Next button because each step may take time to
        // render before the next action becomes available.
        const clickNext = (misses = 0) => {

            cy.get("body").then(($body) => {

                const nextButton = $body
                    .find(
                        'button:visible, a:visible, [role="button"]:visible'
                    )
                    .filter(function () {
                        return Cypress.$(this)
                            .text()
                            .trim()
                            .match(/^Next$/i);
                    });

                if (nextButton.length > 0) {

                    cy.wrap(nextButton.first())
                        .scrollIntoView()
                        .should("be.visible")
                        .should("not.be.disabled")
                        .click();

                    cy.wait(2000);

                    clickNext(0);
                } else if (misses < 8) {
                    cy.wait(2000);
                    clickNext(misses + 1);
                }
            });
        };

        clickNext();

        return this;
    }
}


export default new ReviewAndSignPage();
