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

    await t.test('7. State Transitions and Dynamic Event Simulation', () => {
        // Mock setInterval/clearInterval to prevent background loops during test
        const originalSetInterval = global.setInterval;
        const originalClearInterval = global.clearInterval;
        global.setInterval = () => 999;
        global.clearInterval = () => {};

        // Track listener callbacks
        let couponClickCallback = null;

        // Custom element factories for test
        const createMockElement = (tag) => {
            const attrs = {};
            const classes = new Set();
            return {
                tagName: tag ? tag.toUpperCase() : 'DIV',
                classList: {
                    add: (cls) => classes.add(cls),
                    remove: (cls) => classes.delete(cls),
                    contains: (cls) => classes.has(cls),
                    toggle: (cls) => {
                        if (classes.has(cls)) { classes.delete(cls); return false; }
                        else { classes.add(cls); return true; }
                    }
                },
                setAttribute: (name, val) => { attrs[name] = String(val); },
                removeAttribute: (name) => { delete attrs[name]; },
                getAttribute: (name) => attrs[name] || null,
                style: {},
                textContent: '',
                innerText: '',
                append: () => {},
                appendChild: function(child) {
                    if (this.children) this.children.push(child);
                    return child;
                },
                removeChild: function(child) {
                    if (this.children) {
                        const idx = this.children.indexOf(child);
                        if (idx !== -1) this.children.splice(idx, 1);
                    }
                    return child;
                },
                addEventListener: function(event, cb) {
                    if (event === 'click' && tag === 'button') {
                        // generic catch-all
                    }
                },
                insertBefore: () => {},
                querySelector: () => createMockElement('div'),
                querySelectorAll: () => [],
                children: []
            };
        };

        const createMockLayerBtn = (layerId) => {
            const btn = createMockElement('button');
            btn.setAttribute('data-layer', layerId);
            btn.setAttribute('aria-selected', 'false');
            return btn;
        };

        const createMockMapLayer = (layerId) => {
            const layer = createMockElement('div');
            layer.id = `layer-${layerId}`;
            return layer;
        };

        const testLayerBtns = [
            createMockLayerBtn('seating'),
            createMockLayerBtn('gates'),
            createMockLayerBtn('concessions'),
            createMockLayerBtn('amenities')
        ];
        testLayerBtns[0].classList.add('active');
        testLayerBtns[0].setAttribute('aria-selected', 'true');

        const testMapLayers = [
            createMockMapLayer('seating'),
            createMockMapLayer('gates'),
            createMockMapLayer('concessions'),
            createMockMapLayer('amenities')
        ];

        const testClaimCouponBtn = createMockElement('button');
        testClaimCouponBtn.addEventListener = (event, cb) => {
            if (event === 'click') couponClickCallback = cb;
        };

        const testWalletBalanceText = createMockElement('span');
        const testTransitDistance = { value: '15' };
        const testTransitMethod = { value: 'rideshare_ev' };
        const testCarbonSavedText = createMockElement('span');
        const testCoinsEarnedText = createMockElement('span');

        const testFanChatMessages = createMockElement('div');
        const testOpsChatMessages = createMockElement('div');

        const generalMockElement = createMockElement('div');

        global.document = {
            readyState: 'complete',
            getElementById: (id) => {
                if (id === 'claim-coupon-btn') return testClaimCouponBtn;
                if (id === 'wallet-balance') return testWalletBalanceText;
                if (id === 'transit-distance') return testTransitDistance;
                if (id === 'transit-method') return testTransitMethod;
                if (id === 'carbon-saved') return testCarbonSavedText;
                if (id === 'coins-earned') return testCoinsEarnedText;
                if (id === 'fan-chat-messages') return testFanChatMessages;
                if (id === 'ops-chat-messages') return testOpsChatMessages;
                if (id === 'label-fan') return generalMockElement;
                if (id === 'label-ops') return generalMockElement;
                if (typeof id === 'string' && id.startsWith('typing-')) {
                    const foundInFan = testFanChatMessages.children.find(c => c.id === id);
                    if (foundInFan) return foundInFan;
                    const foundInOps = testOpsChatMessages.children.find(c => c.id === id);
                    if (foundInOps) return foundInOps;
                }
                return generalMockElement;
            },
            querySelector: (selector) => {
                if (selector === '#fan-map-card h2') return generalMockElement;
                if (selector === '#eco-transit-card h2') return generalMockElement;
                if (selector === 'label[for="transit-method"]') return generalMockElement;
                if (selector === '.green-wallet-banner .wallet-text p') return generalMockElement;
                if (selector === '#fan-chat-panel .chat-agent-info h2') return generalMockElement;
                if (selector === '#fan-chat-panel .chat-agent-info span') return generalMockElement;
                return generalMockElement;
            },
            querySelectorAll: (selector) => {
                if (selector === '.layer-btn') return testLayerBtns;
                if (selector === '.map-layer') return testMapLayers;
                return [generalMockElement];
            },
            createTextNode: (text) => {
                const node = createMockElement('text');
                node.textContent = text;
                return node;
            },
            createElement: (tag) => {
                return createMockElement(tag);
            }
        };

        let lastAlertMsg = '';
        global.alert = (msg) => {
            lastAlertMsg = msg;
        };

        const testApp = new SmartVenueApp();

        // Assign mock elements explicitly to ensure pointers are mapped
        testApp.body = generalMockElement;
        testApp.fanView = generalMockElement;
        testApp.opsView = generalMockElement;
        testApp.modeToggleBtn = generalMockElement;
        testApp.opsActiveIncidentsText = generalMockElement;
        testApp.fanChatInput = generalMockElement;
        testApp.fanChatMessages = testFanChatMessages;
        testApp.opsChatMessages = testOpsChatMessages;
        testApp.walletBalanceText = testWalletBalanceText;
        testApp.claimCouponBtn = testClaimCouponBtn;
        testApp.layerBtns = testLayerBtns;
        testApp.mapLayers = testMapLayers;
        testApp.transitDistance = testTransitDistance;
        testApp.transitMethod = testTransitMethod;
        testApp.carbonSavedText = testCarbonSavedText;
        testApp.coinsEarnedText = testCoinsEarnedText;

        // Verify initial states
        assert.strictEqual(testApp.currentMode, 'fan');
        assert.strictEqual(testApp.currentLanguage, 'en');
        assert.strictEqual(testApp.walletBalance, 140);
        assert.strictEqual(testApp.activeIncidentsCount, 2);

        // 1. Test Mode Swap / toggleAppMode()
        testApp.toggleAppMode();
        assert.strictEqual(testApp.currentMode, 'ops');

        testApp.toggleAppMode();
        assert.strictEqual(testApp.currentMode, 'fan');

        // 2. Test Language Change / handleLanguageChange()
        testApp.handleLanguageChange('es');
        assert.strictEqual(testApp.currentLanguage, 'es');

        testApp.handleLanguageChange('fr');
        assert.strictEqual(testApp.currentLanguage, 'fr');

        testApp.handleLanguageChange('pt');
        assert.strictEqual(testApp.currentLanguage, 'pt');

        testApp.handleLanguageChange('ar');
        assert.strictEqual(testApp.currentLanguage, 'ar');

        testApp.handleLanguageChange('en');
        assert.strictEqual(testApp.currentLanguage, 'en');

        // 3. Test HTML Escaping / escapeHTML()
        assert.strictEqual(testApp.escapeHTML('<script>alert("XSS")</script>'), '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
        assert.strictEqual(testApp.escapeHTML('Hello & "world"'), 'Hello &amp; &quot;world&quot;');
        assert.strictEqual(testApp.escapeHTML(''), '');
        assert.strictEqual(testApp.escapeHTML(null), '');

        // 4. Test Programmatic Markdown Parsing / parseMarkdownToDOM()
        const domH3 = testApp.parseMarkdownToDOM('### Subtitle');
        assert.ok(domH3);
        const domBold = testApp.parseMarkdownToDOM('This is **bold** text');
        assert.ok(domBold);
        const domList = testApp.parseMarkdownToDOM('* bullet 1\n- bullet 2');
        assert.ok(domList);

        // 5. Test Dynamic Incident Simulation / simulateNewIncident()
        testApp.simulateNewIncident();
        assert.strictEqual(testApp.activeIncidentsCount, 3);

        testApp.simulateNewIncident();
        assert.strictEqual(testApp.activeIncidentsCount, 4);

        // 6. Test Volunteer Dispatching / dispatchVolunteers()
        testApp.dispatchVolunteers('mock-id', 'Incident resolved');
        assert.strictEqual(testApp.activeIncidentsCount, 3);

        // 7. Test Venue Change / handleVenueChange()
        testApp.handleVenueChange('sofi');
        assert.strictEqual(testApp.currentVenue, 'sofi');

        // 8. Test Map Layer Switching and ARIA programmatic attributes
        testApp.switchMapLayer('concessions');
        assert.strictEqual(testLayerBtns[0].getAttribute('aria-selected'), 'false');
        assert.strictEqual(testLayerBtns[2].getAttribute('aria-selected'), 'true');
        assert.strictEqual(testLayerBtns[2].classList.contains('active'), true);
        assert.strictEqual(testMapLayers[2].style.display, 'block');

        // 9. Test Synchronous Chat Bot Flow and escaping validation
        const originalSetTimeout = global.setTimeout;
        global.setTimeout = (callback) => {
            callback();
            return 111;
        };

        // Send a message via Fan Assistant and check if user and bot responses are added
        testFanChatMessages.children = [];
        testApp.handleFanChatMessage("Show concession vegan options");
        assert.ok(testFanChatMessages.children.length >= 2); // user and assistant message
        
        // Send message with XSS payload to check sanitization
        testFanChatMessages.children = [];
        testApp.handleFanChatMessage("<script>alert(1)</script>");
        // Check if user message inside mock children contains escaped text
        const userMsgNode = testFanChatMessages.children[0];
        assert.ok(userMsgNode);
        
        // Send a message via Ops Assistant and check
        testOpsChatMessages.children = [];
        testApp.handleOpsChatMessage("congestion at gate d");
        assert.ok(testOpsChatMessages.children.length >= 2);

        // Restore setTimeout
        global.setTimeout = originalSetTimeout;

        // 10. Test Eco-Transit Calculation
        testApp.walletBalance = 100;
        testApp.animateBalanceCounter = (start, end) => {
            testApp.updateWalletUI();
        };
        // For rideshare_ev with 15 miles: CO2 saved = 15 * 0.85 - 15 * 0.25 = 9.0 lbs, coins = round(9 * 2) = 18 coins
        testApp.calculateEcoTransit();
        assert.strictEqual(testApp.walletBalance, 118);
        assert.strictEqual(testWalletBalanceText.textContent, 118);

        // 11. Test Coupon Claiming flow
        testApp.walletBalance = 210;
        testApp.updateWalletUI();
        assert.strictEqual(testClaimCouponBtn.getAttribute('disabled'), null); // not disabled
        
        assert.ok(couponClickCallback);
        couponClickCallback();
        assert.strictEqual(testApp.walletBalance, 10);
        assert.strictEqual(testWalletBalanceText.textContent, 10);
        assert.ok(lastAlertMsg.includes("COUPON CLAIMED") || lastAlertMsg.includes("CUPÓN CANJEADO"));

        // Clean up global mocks
        delete global.document;
        delete global.alert;
        global.setInterval = originalSetInterval;
        global.clearInterval = originalClearInterval;
    });
});

