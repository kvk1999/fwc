const test = require('node:test');
const assert = require('node:assert');
const { SmartVenueApp } = require('./app.js');

test('FIFA World Cup 2026 SmartVenue Hub Suite', async (t) => {
    
    // Instantiate app in headless test mode
    const app = new SmartVenueApp();

    await t.test('1. Core Layout and Initial State Defaults', () => {
        assert.strictEqual(app.currentMode, 'fan');
        assert.strictEqual(app.currentVenue, 'metlife');
        assert.strictEqual(app.currentLanguage, 'en');
        assert.strictEqual(app.walletBalance, 140);
        assert.strictEqual(app.activeIncidentsCount, 2);
    });

    await t.test('2. Venue Information Map Validation', () => {
        assert.ok(app.venueData);
        assert.strictEqual(app.venueData.metlife.name, "MetLife Stadium");
        assert.strictEqual(app.venueData.metlife.capacity, 82500);
        assert.strictEqual(app.venueData.sofi.name, "SoFi Stadium");
        assert.strictEqual(app.venueData.azteca.capacity, 87523);
        assert.strictEqual(app.venueData.att.status, "COMPLETED");
    });

    await t.test('3. Multilingual Translation Dictionary Coverage', () => {
        const translationDict = app.getLanguageStrings();
        assert.ok(translationDict);
        
        const languages = ['en', 'es', 'fr', 'pt', 'ar'];
        const essentialKeys = ['fanLabel', 'opsLabel', 'navTitle', 'transitTitle', 'transitLabel', 'venuePrompt', 'chatTitle', 'chatSub', 'chatIntro', 'chatPlaceholder'];
        
        languages.forEach(lang => {
            assert.ok(translationDict[lang], `Translation dictionary is missing support for: ${lang}`);
            essentialKeys.forEach(key => {
                assert.ok(translationDict[lang][key], `Language '${lang}' is missing essential dictionary key: '${key}'`);
                assert.strictEqual(typeof translationDict[lang][key], 'string');
            });
        });
    });

    await t.test('4. Simulated Live Telemetry Auditing', () => {
        assert.ok(app.telemetry);
        assert.strictEqual(typeof app.telemetry.attendance, 'number');
        assert.strictEqual(typeof app.telemetry.solar, 'number');
        assert.strictEqual(typeof app.telemetry.rainwater, 'number');
        assert.ok(app.telemetry.attendance > 0);
        assert.ok(app.telemetry.solar > 0);
        assert.ok(app.telemetry.rainwater > 0);
    });

    await t.test('5. Eco-Transit Carbon Savings Calculator Validation', () => {
        // Test Metro: co2PerMile = 0.05, savingsPercentage = 94%
        // distance = 10. Baseline emissions = 10 * 0.85 = 8.5
        // Metro emissions = 10 * 0.05 = 0.5. Savings = 8.5 - 0.5 = 8.0 lbs.
        // coinsAwarded = round(8.0 * 2) = 16 GC
        const metroResult = app.calculateCarbonSavings(10, 'metro');
        assert.strictEqual(metroResult.savedEmissions, 8.0);
        assert.strictEqual(metroResult.coinsAwarded, 16);

        // Test Shuttle: co2PerMile = 0.15. Baseline emissions = 20 * 0.85 = 17.0
        // Shuttle emissions = 20 * 0.15 = 3.0. Savings = 17.0 - 3.0 = 14.0 lbs.
        // coinsAwarded = round(14 * 2) = 28 GC
        const shuttleResult = app.calculateCarbonSavings(20, 'shuttle');
        assert.strictEqual(shuttleResult.savedEmissions, 14.0);
        assert.strictEqual(shuttleResult.coinsAwarded, 28);

        // Test Carpool: co2PerMile = 0.35. Baseline emissions = 5 * 0.85 = 4.25
        // Carpool emissions = 5 * 0.35 = 1.75. Savings = 4.25 - 1.75 = 2.5 lbs.
        // coinsAwarded = round(2.5 * 2) = 5 GC
        const carpoolResult = app.calculateCarbonSavings(5, 'carpool');
        assert.strictEqual(carpoolResult.savedEmissions, 2.5);
        assert.strictEqual(carpoolResult.coinsAwarded, 5);

        // Test Rideshare EV: co2PerMile = 0.25. Baseline emissions = 15 * 0.85 = 12.75
        // EV emissions = 15 * 0.25 = 3.75. Savings = 12.75 - 3.75 = 9.0 lbs.
        // coinsAwarded = round(9 * 2) = 18 GC
        const evResult = app.calculateCarbonSavings(15, 'rideshare_ev');
        assert.strictEqual(evResult.savedEmissions, 9.0);
        assert.strictEqual(evResult.coinsAwarded, 18);

        // Test Default / Solo car: co2PerMile = 0.85. Baseline emissions = 10 * 0.85 = 8.5
        // emissions = 10 * 0.85 = 8.5. Savings = 8.5 - 8.5 = 0.0 lbs.
        // coinsAwarded = 0 GC
        const defaultResult = app.calculateCarbonSavings(10, 'default');
        assert.strictEqual(defaultResult.savedEmissions, 0.0);
        assert.strictEqual(defaultResult.coinsAwarded, 0);
    });

    await t.test('6. AI Assistant Telemetry-Linked Response Verification', () => {
        // Query Today's Match Telemetry
        const matchResponse = app.generateOpsBotResponse("today's match standings");
        assert.ok(matchResponse.includes("TOURNAMENT WIDE TELEMETRY BRIEF"));
        assert.ok(matchResponse.includes("MetLife Stadium"));
        // Ensure variable template interpolation works and does not print raw syntax like \${...}
        assert.ok(!matchResponse.includes("\\${"));
        assert.ok(matchResponse.includes(`USA ${app.simMatches.usager.homeScore} - ${app.simMatches.usager.awayScore} GER`));
        assert.ok(matchResponse.includes(`ARG ${app.simMatches.argfra.homeScore} - ${app.simMatches.argfra.awayScore} FRA`));

        // Query Gate D Bottleneck
        const gateResponse = app.generateOpsBotResponse("congestion at gate d");
        assert.ok(gateResponse.includes("GATE D BOTTLENECK"));
        assert.ok(gateResponse.includes("Volunteer Redistribution"));

        // Query Sustainability & Resource Analysis
        const sustResponse = app.generateOpsBotResponse("stadium solar and sustainability");
        assert.ok(sustResponse.includes("STADIUM SUSTAINABILITY & RESOURCE ANALYSIS"));
        assert.ok(sustResponse.includes(`${app.telemetry.solar} kW`));
        assert.ok(sustResponse.includes(`${app.telemetry.rainwater} Gallons`));
        assert.ok(sustResponse.includes(`${app.telemetry.bin3}% capacity`));
        assert.ok(!sustResponse.includes("\\${"));

        // Query Active Incident Queue Brief
        const incidentResponse = app.generateOpsBotResponse("active incidents queue");
        assert.ok(incidentResponse.includes("ACTIVE INCIDENT QUEUE BRIEF"));
        assert.ok(incidentResponse.includes(`Total Open Incident Tickets:** ${app.activeIncidentsCount}`));
        assert.ok(incidentResponse.includes(`${app.telemetry.avgWait}m`));
        assert.ok(!incidentResponse.includes("\\${"));
    });
});
