/**
 * FWC 2026 SmartVenue Hub - Interactive Logic Engine
 * Features: High-fidelity telemetry drift, interactive SVG maps, Eco-Transit logic,
 * Multilingual Fan Assistant (StadiumGuide AI), and Executive Ops Decision AI (ArenaOps).
 */

class SmartVenueApp {
    constructor() {
        // App State
        this.currentMode = 'fan'; // 'fan' or 'ops'
        this.currentVenue = 'metlife';
        this.currentLanguage = 'en';
        this.walletBalance = 140;
        this.activeIncidentsCount = 2;
        

        
        // Simulated Live Metrics
        this.telemetry = {
            attendance: 81432,
            gateA_ppm: 288,
            gateB_ppm: 512,
            gateC_ppm: 144,
            gateD_ppm: 1142,
            bin1: 38,
            bin2: 72,
            bin3: 89,
            solar: 485,
            rainwater: 4280,
            avgWait: 8.7
        };

        // Ingest all 16 official FWC 2026 Host Venues
        this.venueData = {
            metlife: { name: "MetLife Stadium", city: "New York/NJ", capacity: 82500, match: "USA 🇺🇸 vs 🇩🇪 GER", status: "LIVE", time: "88'", score: "2 - 1", stage: "Round of 16" },
            sofi: { name: "SoFi Stadium", city: "Los Angeles, CA", capacity: 70240, match: "ARG 🇦🇷 vs 🇫🇷 FRA", status: "LIVE", time: "74'", score: "1 - 1", stage: "Round of 16" },
            azteca: { name: "Estadio Azteca", city: "Mexico City, MX", capacity: 87523, match: "MEX 🇲🇽 vs 🏴󠁧󠁢󠁥󠁮󠁧󠁿 ENG", status: "LIVE", time: "HT", score: "0 - 0", stage: "Round of 16" },
            att: { name: "AT&T Stadium", city: "Dallas, TX", capacity: 93000, match: "BRA 🇧🇷 vs 🇪🇸 ESP", status: "COMPLETED", score: "2 - 1", stage: "Round of 16" },
            mercedes: { name: "Mercedes-Benz Stadium", city: "Atlanta, GA", capacity: 71000, match: "ITA 🇮🇹 vs 🇵🇹 POR", status: "COMPLETED", score: "1 - 0", stage: "Round of 16" },
            hardrock: { name: "Hard Rock Stadium", city: "Miami, FL", capacity: 64767, match: "JAP 🇯🇵 vs 🇭🇷 CRO", status: "UPCOMING", stage: "Round of 16" },
            bcplace: { name: "BC Place", city: "Vancouver, BC", capacity: 54500, match: "CAN 🇨🇦 vs 🇸🇳 SEN", status: "UPCOMING", stage: "Round of 16" },
            lumen: { name: "Lumen Field", city: "Seattle, WA", capacity: 69000, match: "MAR 🇲🇦 vs 🇨🇭 SUI", status: "UPCOMING", stage: "Round of 16" },
            arrowhead: { name: "Arrowhead Stadium", city: "Kansas City, MO", capacity: 76416, match: "TBD vs TBD", status: "STANDBY", stage: "Quarter-Finals" },
            levis: { name: "Levi's Stadium", city: "San Francisco, CA", capacity: 68500, match: "TBD vs TBD", status: "STANDBY", stage: "Quarter-Finals" },
            nrg: { name: "NRG Stadium", city: "Houston, TX", capacity: 72220, match: "NED 🇳🇱 vs 🇨🇴 COL", status: "COMPLETED", score: "2 - 0", stage: "Round of 16" },
            lincoln: { name: "Lincoln Financial Field", city: "Philadelphia, PA", capacity: 67594, match: "URU 🇺🇾 vs 🇧🇪 BEL", status: "COMPLETED", score: "1 - 1 (3-4 pen)", stage: "Round of 16" },
            gillette: { name: "Gillette Stadium", city: "Boston, MA", capacity: 65878, match: "BRA vs ITA", status: "UPCOMING", stage: "Quarter-Finals" },
            bmo: { name: "BMO Field", city: "Toronto, ON", capacity: 45736, match: "TBD vs TBD", status: "STANDBY", stage: "Round of 32" },
            bbva: { name: "Estadio BBVA", city: "Monterrey, MX", capacity: 53500, match: "TBD vs TBD", status: "STANDBY", stage: "Round of 32" },
            akron: { name: "Estadio Akron", city: "Guadalajara, MX", capacity: 48071, match: "TBD vs TBD", status: "STANDBY", stage: "Round of 32" }
        };

        // Active Knockout Match Live Ticker Databases
        this.simMatches = {
            usager: {
                home: "USA", homeFlag: "🇺🇸", away: "GER", awayFlag: "🇩🇪",
                homeScore: 2, awayScore: 1,
                time: 88, isHT: false, isFT: false,
                tickerTeamsId: "ticker-teams-usager", tickerTimeId: "ticker-time-usager",
                bracketHomeId: "bracket-score-usa", bracketAwayId: "bracket-score-ger",
                bracketTimeId: "bracket-time-usager",
                venueId: "metlife"
            },
            argfra: {
                home: "ARG", homeFlag: "🇦🇷", away: "FRA", awayFlag: "🇫🇷",
                homeScore: 1, awayScore: 1,
                time: 74, isHT: false, isFT: false,
                tickerTeamsId: "ticker-teams-argfra", tickerTimeId: "ticker-time-argfra",
                bracketHomeId: "bracket-score-arg", bracketAwayId: "bracket-score-fra",
                bracketTimeId: "bracket-time-argfra",
                venueId: "sofi"
            },
            mexeng: {
                home: "MEX", homeFlag: "🇲🇽", away: "ENG", awayFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
                homeScore: 0, awayScore: 0,
                time: 45, isHT: true, isFT: false,
                tickerTeamsId: "ticker-teams-mexeng", tickerTimeId: "ticker-time-mexeng",
                bracketHomeId: "bracket-score-mex", bracketAwayId: "bracket-score-eng",
                bracketTimeId: "bracket-time-mexeng",
                venueId: "azteca"
            }
        };

        // Initialize Elements & Listeners
        if (typeof document !== 'undefined') {
            if (document.readyState === 'loading') {
                window.addEventListener('DOMContentLoaded', () => this.initApp());
            } else {
                this.initApp();
            }
        }
    }

    initApp() {
        this.initElements();
        this.registerEvents();
        this.startSimulationLoops();
        this.startMatchTickerSimulation();
        this.renderLanguageStrings();
    }

    initElements() {
        // Core Layout views
        this.body = document.body;
        this.modeToggleBtn = document.getElementById('mode-toggle-btn');
        this.fanView = document.getElementById('fan-mode-view');
        this.opsView = document.getElementById('ops-mode-view');
        
        // Settings Selectors
        this.venueSelect = document.getElementById('venue-select');
        this.langSelect = document.getElementById('lang-select');
        this.venueText = document.getElementById('current-venue-text');
        this.liveAttendanceText = document.getElementById('live-attendance');

        // Bracket Modal Overlay Elements
        this.bracketToggleBtn = document.getElementById('bracket-toggle-btn');
        this.closeBracketBtn = document.getElementById('close-bracket-btn');
        this.bracketModal = document.getElementById('bracket-modal');

        // Fan Map Layer selectors
        this.layerBtns = document.querySelectorAll('.layer-btn');
        this.mapLayers = document.querySelectorAll('.map-layer');
        this.stadiumSvg = document.getElementById('interactive-stadium-svg');
        this.mapDetailPanel = document.getElementById('map-detail-panel');
        this.detailTitle = document.getElementById('detail-title');
        this.detailDesc = document.getElementById('detail-desc');

        // Eco-Transit elements
        this.transitMethod = document.getElementById('transit-method');
        this.transitDistance = document.getElementById('transit-distance');
        this.calculateTransitBtn = document.getElementById('calculate-transit-btn');
        this.carbonSavedText = document.getElementById('carbon-saved');
        this.coinsEarnedText = document.getElementById('coins-earned');
        this.walletBalanceText = document.getElementById('wallet-balance');
        this.claimCouponBtn = document.getElementById('claim-coupon-btn');



        // Fan Chat Assistant Elements
        this.fanChatMessages = document.getElementById('fan-chat-messages');
        this.fanChatForm = document.getElementById('fan-chat-form');
        this.fanChatInput = document.getElementById('fan-chat-input');
        this.fanSuggestChips = document.querySelectorAll('.suggest-chip');

        // Ops Telemetry KPI elements
        this.opsOccupancyText = document.getElementById('ops-occupancy');
        this.opsAvgWaitText = document.getElementById('ops-avg-wait');
        this.opsActiveIncidentsText = document.getElementById('ops-active-incidents');
        this.gateAStatsText = document.getElementById('gate-a-stats');
        this.gateBStatsText = document.getElementById('gate-b-stats');
        this.gateCStatsText = document.getElementById('gate-c-stats');
        this.gateDStatsText = document.getElementById('gate-d-stats');
        this.gateABar = document.getElementById('gate-a-bar');
        this.gateBBar = document.getElementById('gate-b-bar');
        this.gateCBar = document.getElementById('gate-c-bar');
        this.gateDBar = document.getElementById('gate-d-bar');

        // Ops Sustainability elements
        this.bin1Fill = document.getElementById('bin-1-fill');
        this.bin2Fill = document.getElementById('bin-2-fill');
        this.bin3Fill = document.getElementById('bin-3-fill');
        this.bin1Text = document.getElementById('bin-1-text');
        this.bin2Text = document.getElementById('bin-2-text');
        this.bin3Text = document.getElementById('bin-3-text');
        this.solarInText = document.getElementById('solar-in');
        this.rainHarvestText = document.getElementById('rain-harvest');
        this.ecoPowerBtn = document.getElementById('eco-power-btn');

        // Ops Dispatch & Incidents
        this.incidentList = document.getElementById('incident-list');
        this.simulateIncidentBtn = document.getElementById('simulate-incident-btn');
        this.volunteerReadyText = document.getElementById('volunteer-ready-count');
        this.triggerRerouteBtn = document.getElementById('trigger-reroute-btn');

        // Ops Chat Assistant elements
        this.opsChatMessages = document.getElementById('ops-chat-messages');
        this.opsChatForm = document.getElementById('ops-chat-form');
        this.opsChatInput = document.getElementById('ops-chat-input');
        this.opsSuggestChips = document.querySelectorAll('.suggest-chip-ops');
    }

    registerEvents() {
        // Toggle Switch Mode: Fan VS Ops
        if (this.modeToggleBtn) {
            this.modeToggleBtn.addEventListener('click', () => this.toggleAppMode());
        }

        const labelFan = document.getElementById('label-fan');
        const labelOps = document.getElementById('label-ops');
        if (labelFan) {
            labelFan.addEventListener('click', () => {
                if (this.currentMode !== 'fan') {
                    this.toggleAppMode();
                }
            });
        }
        if (labelOps) {
            labelOps.addEventListener('click', () => {
                if (this.currentMode !== 'ops') {
                    this.toggleAppMode();
                }
            });
        }

        // Venue Select Change
        if (this.venueSelect) {
            this.venueSelect.addEventListener('change', (e) => this.handleVenueChange(e.target.value));
        }

        // Language Select Change
        if (this.langSelect) {
            this.langSelect.addEventListener('change', (e) => this.handleLanguageChange(e.target.value));
        }

        // Bracket Modal Toggle triggers
        if (this.bracketToggleBtn && this.bracketModal) {
            this.bracketToggleBtn.addEventListener('click', () => {
                this.bracketModal.classList.add('active');
                this.bracketModal.setAttribute('aria-hidden', 'false');
                this.bracketToggleBtn.setAttribute('aria-expanded', 'true');
            });
        }
        if (this.closeBracketBtn && this.bracketModal) {
            this.closeBracketBtn.addEventListener('click', () => {
                this.bracketModal.classList.remove('active');
                this.bracketModal.setAttribute('aria-hidden', 'true');
                if (this.bracketToggleBtn) {
                    this.bracketToggleBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }
        if (this.bracketModal) {
            this.bracketModal.addEventListener('click', (e) => {
                if (e.target === this.bracketModal) {
                    this.bracketModal.classList.remove('active');
                    this.bracketModal.setAttribute('aria-hidden', 'true');
                    if (this.bracketToggleBtn) {
                        this.bracketToggleBtn.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        }

        // Interactive Map Layers
        if (this.layerBtns) {
            this.layerBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.layerBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const targetLayer = btn.getAttribute('data-layer');
                    this.switchMapLayer(targetLayer);
                });
            });
        }

        // Click interaction for elements on the map (SVGs)
        if (this.stadiumSvg) {
            this.stadiumSvg.addEventListener('click', (e) => {
                const clickableNode = e.target.closest('.map-interactive');
                if (clickableNode) {
                    // Remove active borders from all map nodes
                    this.stadiumSvg.querySelectorAll('.map-interactive').forEach(el => el.classList.remove('active-node'));
                    clickableNode.classList.add('active-node');
                    
                    const infoText = clickableNode.getAttribute('data-info');
                    const titleText = clickableNode.id ? clickableNode.id.toUpperCase().replace('-', ' ') : "Stadium Area";
                    this.updateMapDetailBox(titleText, infoText);
                }
            });

            this.stadiumSvg.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    const clickableNode = e.target.closest('.map-interactive');
                    if (clickableNode) {
                        e.preventDefault();
                        // Triggers click listener logic above
                        clickableNode.dispatchEvent(new Event('click', { bubbles: true }));
                    }
                }
            });
        }

        // Eco-Transit Calculator trigger
        if (this.calculateTransitBtn) {
            this.calculateTransitBtn.addEventListener('click', () => this.calculateEcoTransit());
        }

        // Eco Coupon Redemption Click
        if (this.claimCouponBtn) {
            this.claimCouponBtn.addEventListener('click', () => {
                if (this.walletBalance >= 200) {
                    this.walletBalance -= 200;
                    this.updateWalletUI();
                    
                    const alertStrings = {
                        en: "🎫 COUPON CLAIMED! Your 15% Official Food & Merchandise discount code has been sent to your email.",
                        es: "🎫 ¡CUPÓN CANJEADO! Tu código de descuento del 15% en Comida y Tienda Oficial ha sido enviado a tu correo.",
                        fr: "🎫 BON RÉCLAMÉ ! Votre code de réduction officiel de 15% sur la nourriture et les souvenirs a été envoyé par e-mail.",
                        pt: "🎫 CUPOM RESGATADO! Seu código de desconto de 15% em Alimentação e Produtos Oficiais foi enviado para o seu e-mail.",
                        ar: "🎫 تم استرداد الكوبون! تم إرسال رمز الخصم ١٥٪ على المأكولات والمشروبات والهدايا التذكارية الرسمية إلى بريدك الإلكتروني."
                    };
                    alert(alertStrings[this.currentLanguage] || alertStrings.en);
                }
            });
        }


        // Fan Chat Form submit
        if (this.fanChatForm) {
            this.fanChatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const messageText = this.fanChatInput.value.trim();
                if (messageText) {
                    this.handleFanChatMessage(messageText);
                    this.fanChatInput.value = '';
                }
            });
        }

        // Fan quick suggestions
        if (this.fanSuggestChips) {
            this.fanSuggestChips.forEach(chip => {
                chip.addEventListener('click', () => {
                    const prompt = chip.getAttribute('data-prompt');
                    this.handleFanChatMessage(prompt);
                });
            });
        }

        // Ops Chat Form submit
        if (this.opsChatForm) {
            this.opsChatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const messageText = this.opsChatInput.value.trim();
                if (messageText) {
                    this.handleOpsChatMessage(messageText);
                    this.opsChatInput.value = '';
                }
            });
        }

        // Ops Quick suggestions
        if (this.opsSuggestChips) {
            this.opsSuggestChips.forEach(chip => {
                chip.addEventListener('click', () => {
                    const prompt = chip.getAttribute('data-prompt');
                    this.handleOpsChatMessage(prompt);
                });
            });
        }

        // Volunteer Simulators
        if (this.simulateIncidentBtn) {
            this.simulateIncidentBtn.addEventListener('click', () => this.simulateNewIncident());
        }
        if (this.incidentList) {
            this.incidentList.addEventListener('click', (e) => {
                const dispatchBtn = e.target.closest('.dispatch-btn');
                if (dispatchBtn) {
                    const incidentId = dispatchBtn.getAttribute('data-incident-id');
                    const dispatchMsg = dispatchBtn.getAttribute('data-dispatch-msg');
                    if (incidentId && dispatchMsg) {
                        this.dispatchVolunteers(incidentId, dispatchMsg);
                    }
                }
            });
        }
        if (this.triggerRerouteBtn) {
            this.triggerRerouteBtn.addEventListener('click', () => this.triggerOpsReroute());
        }
        
        if (this.ecoPowerBtn) {
            this.ecoPowerBtn.addEventListener('click', () => {
                this.ecoPowerBtn.classList.toggle('active');
                if (this.ecoPowerBtn.classList.contains('active')) {
                    this.ecoPowerBtn.innerText = "⚡ HVAC Smart Eco mode (ACTIVE)";
                    this.telemetry.solar += 35;
                    this.solarInText.innerText = `${this.telemetry.solar} kW`;
                } else {
                    this.ecoPowerBtn.innerText = "AI Intelligent HVAC Eco Mode";
                    this.telemetry.solar -= 35;
                    this.solarInText.innerText = `${this.telemetry.solar} kW`;
                }
            });
        }


    }

    /* Toggle user modes: Fan Portal VS Operations Command */
    toggleAppMode() {
        if (this.currentMode === 'fan') {
            this.currentMode = 'ops';
            this.body.classList.add('ops-mode');
            this.fanView.classList.remove('active');
            this.opsView.classList.add('active');
            
            // Sync active UI toggler styles
            document.getElementById('label-fan').classList.remove('active');
            document.getElementById('label-ops').classList.add('active');
            if (this.modeToggleBtn) {
                this.modeToggleBtn.setAttribute('aria-checked', 'true');
            }
        } else {
            this.currentMode = 'fan';
            this.body.classList.remove('ops-mode');
            this.opsView.classList.remove('active');
            this.fanView.classList.add('active');
            
            // Sync active UI toggler styles
            document.getElementById('label-ops').classList.remove('active');
            document.getElementById('label-fan').classList.add('active');
            if (this.modeToggleBtn) {
                this.modeToggleBtn.setAttribute('aria-checked', 'false');
            }
        }
    }

    updateRibbonForVenue(venueId) {
        const venue = this.venueData[venueId];
        const ribbonTeams = document.querySelector('#match-ribbon .match-teams');
        const ribbonStatusBadge = document.querySelector('#match-ribbon .info-badge');
        const ribbonVenueText = document.getElementById('current-venue-text');
        const countdownLabel = document.getElementById('countdown-label-text');
        
        if (!ribbonTeams || !ribbonStatusBadge || !ribbonVenueText || !countdownLabel) return;

        // Update venue text
        ribbonVenueText.innerText = `${venue.name} • ${venue.stage}`;
        
        if (venue.status === "LIVE") {
            ribbonStatusBadge.className = "info-badge live";
            ribbonStatusBadge.style.backgroundColor = "";
            ribbonStatusBadge.style.color = "";
            ribbonStatusBadge.style.border = "";
            ribbonStatusBadge.innerText = "LIVE FEEDS";
            countdownLabel.innerText = "Kickoff (Other Matches):";
            
            // Render teams with live score and time
            ribbonTeams.textContent = '';
            const t1 = document.createElement('span');
            t1.className = 'country-badge';
            t1.textContent = venue.match.split(' vs ')[0];
            const vs = document.createElement('span');
            vs.className = 'vs-text';
            vs.textContent = 'VS';
            const t2 = document.createElement('span');
            t2.className = 'country-badge';
            t2.textContent = venue.match.split(' vs ')[1];
            const score = document.createElement('span');
            score.className = 'match-score-pill mono-num';
            score.id = 'ribbon-score';
            score.textContent = venue.score;
            const time = document.createElement('span');
            time.className = 'match-time-pill live-badge';
            time.id = 'ribbon-time';
            time.textContent = venue.time;
            ribbonTeams.append(t1, vs, t2, score, time);
        } else if (venue.status === "COMPLETED") {
            ribbonStatusBadge.className = "info-badge";
            ribbonStatusBadge.style.backgroundColor = "var(--gold-brand-dim)";
            ribbonStatusBadge.style.color = "var(--gold-brand)";
            ribbonStatusBadge.style.border = "1px solid rgba(245, 158, 11, 0.3)";
            ribbonStatusBadge.innerText = "COMPLETED";
            countdownLabel.innerText = "Match Cleared:";
            
            ribbonTeams.textContent = '';
            const t1 = document.createElement('span');
            t1.className = 'country-badge';
            t1.textContent = venue.match.split(' vs ')[0];
            const vs = document.createElement('span');
            vs.className = 'vs-text';
            vs.textContent = 'VS';
            const t2 = document.createElement('span');
            t2.className = 'country-badge';
            t2.textContent = venue.match.split(' vs ')[1];
            const score = document.createElement('span');
            score.className = 'match-score-pill mono-num';
            score.textContent = venue.score;
            const time = document.createElement('span');
            time.className = 'match-time-pill';
            time.style.backgroundColor = 'rgba(255,255,255,0.05)';
            time.style.borderColor = 'rgba(255,255,255,0.1)';
            time.style.color = 'var(--text-muted)';
            time.style.animation = 'none';
            time.textContent = 'FT';
            ribbonTeams.append(t1, vs, t2, score, time);
        } else if (venue.status === "UPCOMING") {
            ribbonStatusBadge.className = "info-badge";
            ribbonStatusBadge.style.backgroundColor = "rgba(234, 179, 8, 0.15)";
            ribbonStatusBadge.style.color = "rgb(234, 179, 8)";
            ribbonStatusBadge.style.border = "1px solid rgba(234, 179, 8, 0.3)";
            ribbonStatusBadge.innerText = "UPCOMING MATCH";
            countdownLabel.innerText = "Time to Kickoff:";
            
            ribbonTeams.textContent = '';
            const t1 = document.createElement('span');
            t1.className = 'country-badge';
            t1.textContent = venue.match.split(' vs ')[0];
            const vs = document.createElement('span');
            vs.className = 'vs-text';
            vs.textContent = 'VS';
            const t2 = document.createElement('span');
            t2.className = 'country-badge';
            t2.textContent = venue.match.split(' vs ')[1];
            const time = document.createElement('span');
            time.className = 'match-time-pill';
            time.style.backgroundColor = 'var(--gold-brand-dim)';
            time.style.color = 'var(--gold-brand)';
            time.style.border = '1px solid rgba(245,158,11,0.25)';
            time.style.animation = 'none';
            time.textContent = 'JULY 7';
            ribbonTeams.append(t1, vs, t2, time);
        } else {
            ribbonStatusBadge.className = "info-badge";
            ribbonStatusBadge.style.backgroundColor = "rgba(255,255,255,0.05)";
            ribbonStatusBadge.style.color = "var(--text-muted)";
            ribbonStatusBadge.style.border = "1px solid rgba(255,255,255,0.1)";
            ribbonStatusBadge.innerText = "VENUE STANDBY";
            countdownLabel.innerText = "Next Stage:";
            
            ribbonTeams.textContent = '';
            const t1 = document.createElement('span');
            t1.className = 'country-badge';
            t1.textContent = venue.name;
            const time = document.createElement('span');
            time.className = 'match-time-pill';
            time.style.backgroundColor = 'rgba(255,255,255,0.05)';
            time.style.color = 'var(--text-muted)';
            time.style.border = '1px solid rgba(255,255,255,0.1)';
            time.style.marginLeft = '10px';
            time.style.animation = 'none';
            time.textContent = venue.stage;
            ribbonTeams.append(t1, time);
        }
    }

    handleVenueChange(venueId) {
        this.currentVenue = venueId;
        const venue = this.venueData[venueId];
        if (!venue) return;
        
        // Update countdown text / headers
        this.updateRibbonForVenue(venueId);
        
        // Randomize telemetry baseline slightly based on capacity and status
        if (venue.status === 'LIVE') {
            this.telemetry.attendance = Math.floor(venue.capacity * (0.91 + Math.random() * 0.08));
            this.telemetry.gateA_ppm = Math.floor(150 + Math.random() * 200);
            this.telemetry.gateB_ppm = Math.floor(300 + Math.random() * 300);
            this.telemetry.gateC_ppm = Math.floor(80 + Math.random() * 100);
            this.telemetry.gateD_ppm = Math.floor(900 + Math.random() * 300);
            this.telemetry.bin1 = Math.floor(30 + Math.random() * 20);
            this.telemetry.bin2 = Math.floor(50 + Math.random() * 30);
            this.telemetry.bin3 = Math.floor(70 + Math.random() * 20);
        } else if (venue.status === 'COMPLETED') {
            this.telemetry.attendance = 0;
            this.telemetry.gateA_ppm = 0;
            this.telemetry.gateB_ppm = 0;
            this.telemetry.gateC_ppm = 0;
            this.telemetry.gateD_ppm = 0;
            this.telemetry.bin1 = Math.floor(80 + Math.random() * 15); // full after match!
            this.telemetry.bin2 = Math.floor(85 + Math.random() * 10);
            this.telemetry.bin3 = Math.floor(90 + Math.random() * 8);
        } else {
            this.telemetry.attendance = 0;
            this.telemetry.gateA_ppm = 0;
            this.telemetry.gateB_ppm = 0;
            this.telemetry.gateC_ppm = 0;
            this.telemetry.gateD_ppm = 0;
            this.telemetry.bin1 = Math.floor(5 + Math.random() * 10);
            this.telemetry.bin2 = Math.floor(10 + Math.random() * 12);
            this.telemetry.bin3 = Math.floor(8 + Math.random() * 10);
        }

        this.liveAttendanceText.innerText = this.telemetry.attendance.toLocaleString();
        this.telemetry.avgWait = parseFloat(((this.telemetry.gateA_ppm / 110 + this.telemetry.gateB_ppm / 90 + this.telemetry.gateC_ppm / 80 + this.telemetry.gateD_ppm / 50) / 4).toFixed(1));
        this.updateOpsDashboard();
        
        // Update SVG node descriptive metrics
        const gate1 = document.getElementById('gate-1');
        const gate2 = document.getElementById('gate-2');
        const gate3 = document.getElementById('gate-3');
        const gate4 = document.getElementById('gate-4');
        
        if (gate1) gate1.setAttribute('data-info', `Gate A (North Entrance) - Wait time: ${venue.status === 'LIVE' ? Math.round(this.telemetry.gateA_ppm / 110) : 0} mins. ppm: ${this.telemetry.gateA_ppm}`);
        if (gate2) gate2.setAttribute('data-info', `Gate B (East Entrance) - Wait time: ${venue.status === 'LIVE' ? Math.round(this.telemetry.gateB_ppm / 90) : 0} mins. ppm: ${this.telemetry.gateB_ppm}`);
        if (gate3) gate3.setAttribute('data-info', `Gate C (South Entrance) - Wait time: ${venue.status === 'LIVE' ? Math.round(this.telemetry.gateC_ppm / 80) : 0} mins. ppm: ${this.telemetry.gateC_ppm}`);
        if (gate4) gate4.setAttribute('data-info', `Gate D (West Entrance) - HEAVY CONGESTION. Wait time: ${venue.status === 'LIVE' ? Math.round(this.telemetry.gateD_ppm / 50) : 0} mins. ppm: ${this.telemetry.gateD_ppm}`);

        // Reset detail box text
        this.detailTitle.innerText = "Stadium Ingestion Event";
        this.detailDesc.innerText = `Successfully ingested operations and seating telemetry baseline for ${venue.name}. Match-day status: ${venue.status}.`;
    }

    handleLanguageChange(langCode) {
        this.currentLanguage = langCode;
        this.renderLanguageStrings();
    }

    /* Toggles SVG visual layer groups on the stadium wayfinding map */
    switchMapLayer(layerId) {
        this.mapLayers.forEach(layer => {
            if (layer.id === `layer-${layerId}`) {
                layer.style.display = 'block';
                layer.classList.add('active-layer');
            } else {
                layer.style.display = 'none';
                layer.classList.remove('active-layer');
            }
        });

        // Add helpful guide text when layers are switched
        const layerGuides = {
            seating: { title: "Seating Zones Layer", desc: "Select a sector quadrant to see gate recommendations, ticket category tiers, and nearest entry pathways." },
            gates: { title: "Gates & Transportation Nodes", desc: "Interactive parking shuttle drop-offs, security terminals, and live entry line congestion metrics." },
            concessions: { title: "Food, Drinks & Merchandise", desc: "Tap food items to view vegan/vegetarian options, sustainable zero-cup packaging ratings, and active queue lines." },
            amenities: { title: "Accessibility & Restrooms", desc: "Highlighting standard facilities, family assistance care centers, and certified handicap wheelchair escort points." }
        };

        const guide = layerGuides[layerId] || { title: "Interactive Stadium Map", desc: "Click facilities for details." };
        this.updateMapDetailBox(guide.title, guide.desc);
    }

    /* Animates details panel on map clicks */
    updateMapDetailBox(title, text) {
        this.mapDetailPanel.classList.add('pulse-update');
        this.detailTitle.innerText = title;
        this.detailDesc.innerText = text;
        
        setTimeout(() => {
            this.mapDetailPanel.classList.remove('pulse-update');
        }, 500);
    }

    calculateCarbonSavings(distance, method) {
        let co2PerMile = 0.85; // Solo Gas car baseline
        let savingsPercentage = 0;

        switch(method) {
            case 'metro':
                co2PerMile = 0.05;
                savingsPercentage = 94;
                break;
            case 'shuttle':
                co2PerMile = 0.15;
                savingsPercentage = 82;
                break;
            case 'carpool':
                co2PerMile = 0.35;
                savingsPercentage = 58;
                break;
            case 'rideshare_ev':
                co2PerMile = 0.25;
                savingsPercentage = 70;
                break;
            default:
                co2PerMile = 0.85;
                savingsPercentage = 0;
        }

        const baselineEmissions = distance * 0.85;
        const savedEmissions = parseFloat((baselineEmissions - (distance * co2PerMile)).toFixed(1));
        const coinsAwarded = Math.round(savedEmissions * 2);

        return { savedEmissions, coinsAwarded };
    }

    /* Carbon Calculator Logic with dynamic GC Wallet Balance update */
    calculateEcoTransit() {
        const distance = parseFloat(this.transitDistance.value) || 1;
        const method = this.transitMethod.value;

        const { savedEmissions, coinsAwarded } = this.calculateCarbonSavings(distance, method);

        // Render Results with animation
        this.carbonSavedText.innerText = `${savedEmissions} lbs CO2`;
        this.coinsEarnedText.innerText = `+${coinsAwarded} GC`;

        // Update Wallet balance
        const prevWallet = this.walletBalance;
        this.walletBalance += coinsAwarded;
        
        // Counter tick animation
        this.animateBalanceCounter(prevWallet, this.walletBalance);

        // Update detail box contextually
        this.updateMapDetailBox("Eco-Emissions Saved!", `You saved ${savedEmissions} lbs of carbon by selecting green transportation. ${coinsAwarded} FIFA Green Coins have been added to your eco-wallet.`);
    }

    animateBalanceCounter(start, end) {
        let current = start;
        const duration = 1000; // ms
        const steps = Math.abs(end - start);
        if (steps === 0) {
            this.updateWalletUI();
            return;
        }
        const stepTime = Math.max(Math.floor(duration / steps), 10);
        
        const timer = setInterval(() => {
            if (start < end) {
                current++;
            } else {
                current--;
            }
            if (this.walletBalanceText) this.walletBalanceText.innerText = current;
            if (current === end) {
                clearInterval(timer);
                this.updateWalletUI();
            }
        }, stepTime);
    }

    /* Centralized helper to sync wallet balance and claim button text with current language */
    updateWalletUI() {
        if (this.walletBalanceText) {
            this.walletBalanceText.innerText = this.walletBalance;
        }
        if (this.claimCouponBtn) {
            if (this.walletBalance >= 200) {
                this.claimCouponBtn.removeAttribute('disabled');
                const redeemStrings = {
                    en: "Claim Eco Coupon! 🎟️",
                    es: "¡Canjear Cupón! 🎟️",
                    fr: "Réclamer Bon ! 🎟️",
                    pt: "Resgatar Cupom! 🎟️",
                    ar: "استرداد الكوبون! 🎟️"
                };
                this.claimCouponBtn.innerText = redeemStrings[this.currentLanguage] || redeemStrings.en;
            } else {
                this.claimCouponBtn.setAttribute('disabled', 'true');
                const minGcStrings = {
                    en: "Redeem (Min: 200 GC)",
                    es: "Canjear (Mín: 200 GC)",
                    fr: "Réclamer (Min: 200 GC)",
                    pt: "Resgatar (Mín: 200 GC)",
                    ar: "استرداد (الحد الأدنى: ٢٠٠ نقطة)"
                };
                this.claimCouponBtn.innerText = minGcStrings[this.currentLanguage] || minGcStrings.en;
            }
        }
    }


    /* Simulation loops representing physical active sensors */
    startSimulationLoops() {
        // Countdown timer tick
        let days = 1, hours = 3, minutes = 38, seconds = 12;
        setInterval(() => {
            seconds--;
            if (seconds < 0) {
                seconds = 59;
                minutes--;
                if (minutes < 0) {
                    minutes = 59;
                    hours--;
                    if (hours < 0) {
                        hours = 23;
                        days--;
                    }
                }
            }
            
            const dStr = days.toString().padStart(2, '0');
            const hStr = hours.toString().padStart(2, '0');
            const mStr = minutes.toString().padStart(2, '0');
            const sStr = seconds.toString().padStart(2, '0');
            document.getElementById('countdown').innerText = `${dStr}d : ${hStr}h : ${mStr}m : ${sStr}s`;
        }, 1000);

        // Dynamic Telemetry drifting every 4 seconds
        setInterval(() => {
            // Waste bin capacities increase
            this.telemetry.bin1 = Math.min(this.telemetry.bin1 + (Math.random() > 0.6 ? 1 : 0), 100);
            this.telemetry.bin2 = Math.min(this.telemetry.bin2 + (Math.random() > 0.4 ? 1 : 0), 100);
            this.telemetry.bin3 = Math.min(this.telemetry.bin3 + (Math.random() > 0.2 ? 1 : 0), 100);

            // Ingestion solar grid fluctuates
            const sunFactor = 12 * Math.sin((new Date().getTime() / 100000) % Math.PI);
            this.telemetry.solar = Math.round(450 + sunFactor);
            this.telemetry.rainwater += Math.random() > 0.8 ? 5 : 0;

            // Gate crowd flows drift
            this.telemetry.gateA_ppm = Math.max(100, Math.min(this.telemetry.gateA_ppm + Math.round((Math.random() - 0.5) * 40), 500));
            this.telemetry.gateB_ppm = Math.max(200, Math.min(this.telemetry.gateB_ppm + Math.round((Math.random() - 0.5) * 60), 800));
            this.telemetry.gateC_ppm = Math.max(50, Math.min(this.telemetry.gateC_ppm + Math.round((Math.random() - 0.5) * 20), 300));
            this.telemetry.gateD_ppm = Math.max(800, Math.min(this.telemetry.gateD_ppm + Math.round((Math.random() - 0.5) * 120), 1500));

            // Adjust avg queue based on Gate D
            this.telemetry.avgWait = parseFloat(((this.telemetry.gateA_ppm / 110 + this.telemetry.gateB_ppm / 90 + this.telemetry.gateC_ppm / 80 + this.telemetry.gateD_ppm / 50) / 4).toFixed(1));

            // Repaint Dashboard fields
            this.updateOpsDashboard();
        }, 4000);
    }

    updateOpsDashboard() {
        if (this.currentMode === 'ops') {
            // Update gauges & meters
            this.opsOccupancyText.innerText = `${((this.telemetry.attendance / 82500) * 100).toFixed(1)}%`;
            this.opsAvgWaitText.innerText = `${this.telemetry.avgWait} min`;
            this.opsActiveIncidentsText.innerText = this.activeIncidentsCount;

            this.gateAStatsText.innerText = `${this.telemetry.gateA_ppm} ppm • Normal`;
            this.gateBStatsText.innerText = `${this.telemetry.gateB_ppm} ppm • Moderate`;
            this.gateCStatsText.innerText = `${this.telemetry.gateC_ppm} ppm • Light`;
            this.gateDStatsText.innerText = `${this.telemetry.gateD_ppm} ppm • HEAVY`;

            this.gateABar.style.width = `${Math.min(100, (this.telemetry.gateA_ppm / 500) * 100)}%`;
            this.gateBBar.style.width = `${Math.min(100, (this.telemetry.gateB_ppm / 800) * 100)}%`;
            this.gateCBar.style.width = `${Math.min(100, (this.telemetry.gateC_ppm / 300) * 100)}%`;
            this.gateDBar.style.width = `${Math.min(100, (this.telemetry.gateD_ppm / 1500) * 100)}%`;

            this.bin1Fill.style.height = `${this.telemetry.bin1}%`;
            this.bin2Fill.style.height = `${this.telemetry.bin2}%`;
            this.bin3Fill.style.height = `${this.telemetry.bin3}%`;
            
            this.bin1Text.innerText = `${this.telemetry.bin1}%`;
            this.bin2Text.innerText = `${this.telemetry.bin2}%`;
            this.bin3Text.innerText = `${this.telemetry.bin3}%`;

            this.solarInText.innerText = `${this.telemetry.solar} kW`;
            this.rainHarvestText.innerText = `${this.telemetry.rainwater.toLocaleString()} Gal`;
        }
    }

    /* Multilingual Fan AI Bot Responses Engine */
    handleFanChatMessage(text) {
        // Appends user message to feed
        this.appendChatMessage(this.fanChatMessages, "👤", text, "user-msg");

        // Typing indicator
        const typingId = this.appendTypingIndicator(this.fanChatMessages);

        setTimeout(() => {
            this.removeTypingIndicator(this.fanChatMessages, typingId);
            const aiResponse = this.generateFanBotResponse(text);
            this.appendChatMessage(this.fanChatMessages, "🤖", aiResponse, "assistant-msg");
            this.fanChatMessages.scrollTop = this.fanChatMessages.scrollHeight;
        }, 800);
    }

    generateFanBotResponse(input) {
        const clean = input.toLowerCase();

        // Check selected language first to localize answers
        const lang = this.currentLanguage;

        // Date-awareness / Schedule / Standings keywords check
        if (clean.includes('today') || clean.includes('schedule') || clean.includes('bracket') || clean.includes('standing') || clean.includes('july 6') || clean.includes('match') || clean.includes('partido') || clean.includes('calendario') || clean.includes('classement') || clean.includes('aujourd') || clean.includes('jogo') || clean.includes('مباراة') || clean.includes('جدول')) {
            return `🏆 **FIFA World Cup 2026 Knockout Bracket (As of July 6, 2026)**
Today is **July 6, 2026**, and we are currently in the active **Round of 16 Knockout Phase**! 

🗓️ **Today's Live Match Telemetry:**
1. 🏟️ **MetLife Stadium (NY/NJ):**
   - 🇺🇸 **USA** vs 🇩🇪 **GER**
   - Score: **${this.simMatches.usager.homeScore} - ${this.simMatches.usager.awayScore}** (${this.simMatches.usager.isFT ? 'COMPLETED' : this.simMatches.usager.isHT ? 'Halftime' : 'Live ' + this.simMatches.usager.time + "'"})
2. 🏟️ **SoFi Stadium (Los Angeles):**
   - 🇦🇷 **ARG** vs 🇫🇷 **FRA**
   - Score: **${this.simMatches.argfra.homeScore} - ${this.simMatches.argfra.awayScore}** (${this.simMatches.argfra.isFT ? 'COMPLETED' : this.simMatches.argfra.isHT ? 'Halftime' : 'Live ' + this.simMatches.argfra.time + "'"})
3. 🏟️ **Estadio Azteca (Mexico City):**
   - 🇲🇽 **MEX** vs 🏴󠁧󠁢󠁥󠁮󠁧󠁿 **ENG**
   - Score: **${this.simMatches.mexeng.homeScore} - ${this.simMatches.mexeng.awayScore}** (${this.simMatches.mexeng.isFT ? 'COMPLETED' : this.simMatches.mexeng.isHT ? 'Halftime' : 'Live ' + this.simMatches.mexeng.time + "'"})

📅 **Round of 16 Completed Matches:**
- 🇧🇷 **Brazil** 2 - 1 🇪🇸 Spain (July 4, Dallas)
- 🇮🇹 **Italy** 1 - 0 🇵🇹 Portugal (July 4, Atlanta)
- 🇳🇱 **Netherlands** 2 - 0 🇨🇴 Colombia (July 5, Houston)
- URU Uruguay 1 - 1 🇧🇪 **Belgium** (3-4 penalties) (July 5, Philly)

👉 *To view the full interactive bracket flow, click the **🏆 Bracket & Standings** button in the top menu overlay!*`;
        }

        if (lang === 'es' || clean.includes('baño') || clean.includes('green coins') || clean.includes('espanol') || clean.includes('hola')) {
            return `¡Hola fan de la Copa Mundial de la FIFA! 🌟
            - **Accesibilidad**: Los ascensores más cercanos están en el sector **Sec 119** (cerca de la Puerta D) y los baños adaptados se encuentran en el sector **Sec 103** y **Sec 114**.
            - **Green Coins**: Puedes canjear tus Green Coins en los puestos oficiales marcados con un icono dorado de regalo en tu mapa en los Sectores 102, 108 y 113. ¡Consigue un 15% de descuento con 200 GC!
            ¿Necesitas más información de transporte?`;
        }

        if (lang === 'fr' || clean.includes('bonjour') || clean.includes('navette')) {
            return `Bonjour ! Welcome back to Stade de la Coupe du Monde FIFA 2026. 🗼
            - **Navette Électrique**: La navette électrique gratuite circule en continu entre le terminal **Porte B** et le Parking Lot C. Fréquence : toutes les 3 minutes.
            - **Accès Fauteuil**: Un ascenseur réservé se trouve au **Sec 119**. Des fauteuils roulants sont disponibles à l'accueil sur demande gratuite.
            Puis-je vous aider pour trouver votre siège ?`;
        }

        if (clean.includes('wheelchair') || clean.includes('accessibility') || clean.includes('disabled') || clean.includes('lift') || clean.includes('elevator')) {
            return `♿ **Accessibility Assistance Information**:
            - **Dedicated Elevators**: Located at Section **119** (West Stand) and Section **104** (North Stand).
            - **Accessible Toilets**: Fully equipped ADA facilities are open in Section **103** and Section **114** (with emergency paging systems).
            - **Volunteer Escorts**: Click **Amenities & Restrooms** on the interactive map above and select **Sec 119 Wheelchair Hub** to summon a volunteer to wheel you directly to your seat.`;
        }

        if (clean.includes('shuttle') || clean.includes('parking') || clean.includes('metro') || clean.includes('bus') || clean.includes('transit')) {
            return `🚌 **Eco-Transit Navigation Center**:
            - **Electric Shuttles**: Boarding is located at the lower hub of **Gate B** (East) to parking lots A, B, and C. Shuttles are zero-emission electric buses arriving every **3 minutes**.
            - **Metro / Train Express**: Main MetLife Transit rail station is connected directly via the walkway at **Gate A** (North). Queue times to board post-match are estimated at 12 minutes. 
            - **Green Incentive**: Remember to use our Eco-Transit Planner on the left to earn Green Coins for selecting low-carbon routes!`;
        }

        if (clean.includes('vegan') || clean.includes('vegetarian') || clean.includes('food') || clean.includes('taco') || clean.includes('eat') || clean.includes('drink')) {
            return `🥗 **Concession & Catering Intelligence**:
            - **Vegan & Plant-Based Tacos**: Available at Section **102 (Arena Tacos)**. Their current wait line is 12 minutes. They support fully compostable cardboard trays!
            - **FIFA Eco Fan Zone**: Located in Section **108 (Drink Point)**. Bring your reusable stadium cup to save $1 on soft drinks. Line queue is currently only 4 minutes.
            - **Pre-ordering**: Use our app link to place pre-orders and pick them up at Section 113.`;
        }

        if (clean.includes('green coin') || clean.includes('redeem') || clean.includes('wallet') || clean.includes('coupon')) {
            return `🪙 **FIFA Green Coins (GC) Guide**:
            - You currently have **${this.walletBalance} GC** stored in your virtual Eco-Wallet.
            - **How to Earn**: Enter any low-carbon transit journey into our Eco-Transit planner (e.g. electric metro or carpooling) to receive instant GC.
            - **How to Redeem**: Once your balance reaches **200 GC**, the 'Redeem' button will unlock, providing a digital coupon for a 15% discount at official merchandise megastores and food stalls.`;
        }

        if (clean.includes('seat') || clean.includes('section') || clean.includes('where is my')) {
            return `🏟️ **Wayfinding & Seating Escort**:
            - Please enter your Section and Seat number.
            - *For general navigation*: Category 1 and VIP seats (Sections 106-110) are located in the midfield stands, best accessed via **Gate B**. Category 2 seats (Sections 101-105, 111-115) are best reached via **Gate A** or **Gate C**.`;
        }

        return `🤖 **Gemini-Powered Support**:
        - I am monitoring live feeds at our tournament venue. 
        - You can query me on **Accessibility** features (wheelchairs, lifts), **Eco-Transit** shuttle loops, **Green Coins** redemptions, or food stall locations with the fastest queue times.
        - *Ask me:* *"Show me vegan food stalls"* or *"Where is the lift at Section 119?"*`;
    }

    /* Operations Console AI Decision-Support Responses */
    handleOpsChatMessage(text) {
        this.appendChatMessage(this.opsChatMessages, "👤", text, "user-msg");

        // Typing indicator
        const typingId = this.appendTypingIndicator(this.opsChatMessages);

        setTimeout(() => {
            this.removeTypingIndicator(this.opsChatMessages, typingId);
            const aiResponse = this.generateOpsBotResponse(text);
            this.appendChatMessage(this.opsChatMessages, "📊", aiResponse, "assistant-msg ops");
            this.opsChatMessages.scrollTop = this.opsChatMessages.scrollHeight;
        }, 1000);
    }

    generateOpsBotResponse(input) {
        const clean = input.toLowerCase();

        if (clean.includes('today') || clean.includes('schedule') || clean.includes('bracket') || clean.includes('standing') || clean.includes('july 6') || clean.includes('match') || clean.includes('score') || clean.includes('telemetry') || clean.includes('results')) {
            return `### 🏆 TOURNAMENT WIDE TELEMETRY BRIEF (As of July 6, 2026)

**Phase:** Round of 16 Knockout Phase (Live Tracking)
**Total Venues Active Today:** 3 of 16 official host stadiums

#### 🏟️ 1. MetLife Stadium (NY/NJ) — USA vs GER
- **Match Status:** ${this.simMatches.usager.isFT ? 'COMPLETED' : this.simMatches.usager.isHT ? 'Halftime' : 'Live ' + this.simMatches.usager.time + "'"}
- **Current Score:** 🇺🇸 **USA ${this.simMatches.usager.homeScore} - ${this.simMatches.usager.awayScore} GER** 🇩🇪
- **Operations Telemetry:** Gate congestion normal. Avg wait time: 8 mins. Solar power generating at 840 kW.

#### 🏟️ 2. SoFi Stadium (Los Angeles) — ARG vs FRA
- **Match Status:** ${this.simMatches.argfra.isFT ? 'COMPLETED' : this.simMatches.argfra.isHT ? 'Halftime' : 'Live ' + this.simMatches.argfra.time + "'"}
- **Current Score:** 🇦🇷 **ARG ${this.simMatches.argfra.homeScore} - ${this.simMatches.argfra.awayScore} FRA** 🇫🇷
- **Operations Telemetry:** High ingress at Gate B. Avg wait time: 14 mins. HVAC energy baseline optimization active.

#### 🏟️ 3. Estadio Azteca (Mexico City) — MEX vs ENG
- **Match Status:** ${this.simMatches.mexeng.isFT ? 'COMPLETED' : this.simMatches.mexeng.isHT ? 'Halftime' : 'Live ' + this.simMatches.mexeng.time + "'"}
- **Current Score:** 🇲🇽 **MEX ${this.simMatches.mexeng.homeScore} - ${this.simMatches.mexeng.awayScore} ENG** 🏴󠁧󠁢󠁥󠁮󠁧󠁿
- **Operations Telemetry:** Warm climate grid load high. Solar offset at 920 kW. Circular economy waste management bins at 68% capacity.

#### 📊 Knockout Standings & Historical Data:
- **Completed (July 4-5):** BRA 2-1 ESP, ITA 1-0 POR, NED 2-0 COL, URU 1-1 BEL (3-4 pen)
- **Active Today (July 6):** Winner of USA/GER faces winner of ARG/FRA in the Quarter-Finals. MEX/ENG winner progresses to face the winner of tomorrow's match.

*Note: All venue coordinators have been notified to align local security and transit schedules with live match clock extensions.*`;
        }

        if (clean.includes('gate d') || clean.includes('congestion') || clean.includes('bottleneck') || clean.includes('reroute')) {
            return `### 🚨 GENAI SITUATIONAL REPORT: GATE D BOTTLENECK
            
**Current Influx Rate:** 1,142 people/min (Exceeding max safety threshold of 950 ppm by **20%**).
**Est. Delay:** 22 minutes queue time.

#### 🛠️ AI-Recommended Interventions:
1. **Dynamic Rerouting Broadcast**: Dispatched localized geofenced push alerts to 12,000 fan screens within 500m of Gate D, recommending a 4-minute walk to **Gate C (South)** or **Gate B (East)**.
2. **Volunteer Redistribution**:
    - Dispatched 8 multilingual volunteer guides from central reserves to Gate D outer perimeter to physically filter and direct families with children/wheelchairs towards priority elevators.
    - Assigned 4 ticket scanner support specialists to bolster active lanes 14-18.
3. **Staff SMS Broadcast Drafted**: *"Ops Alert: Section 116-120 pedestrian spillover. Redirect to South corridor. Volunteer units active."*

*Do you authorize launching the secondary screening corridors? (Click 'Deploy AI Redirect Protocols' below to execute).*`;
        }

        if (clean.includes('sustainability') || clean.includes('solar') || clean.includes('bin') || clean.includes('waste') || clean.includes('water')) {
            return `### 🔋 STADIUM SUSTAINABILITY & RESOURCE ANALYSIS
            
**Match Status:** Live, 81,432 attendees.
**Eco-Performance Index:** 86.2% (Target: >85%).

#### ⚡ Solar & Smart Grid:
- **Solar Generation**: Peak generation at **${this.telemetry.solar} kW** supplying 42% of stadium light arrays.
- **HVAC Eco-Optima**: Running on Intelligent Power Savings setting. Energy consumption baseline decreased by **18.5%**.

#### 💧 Rainwater Harvesting:
- Current reservoir levels: **${this.telemetry.rainwater} Gallons**. Harvesting system fully active, supplying 100% of field irrigation and restroom flushing needs.

#### ♻️ Circular Economy & Waste:
- **Smart Bin Alerts**: Sector 114 bin (Gate D perimeter) is at **${this.telemetry.bin3}% capacity**. 
- **Action Directed**: Scheduled automated collection route. Cleaning staff dispatched with compost transport carts to relieve Sector 114 before overflow hazard.
- **Green Coin Reward Payout**: 24,812 GC paid out to 852 participating transit fans today.`;
        }

        if (clean.includes('incident') || clean.includes('ticket') || clean.includes('alert') || clean.includes('staff')) {
            return `### 📋 ACTIVE INCIDENT QUEUE BRIEF & STAFFING METRICS
            
**Total Open Incident Tickets:** ${this.activeIncidentsCount} (1 Critical, 1 Medium)
**Active Volunteers in Field:** 48 units.

#### 1. CRITICAL: Gate D Crowd Bottle-neck (In progress)
- **Assigned Force**: 8 marshals.
- **AI Status**: Live redirection push notifications active. Wait lines reduced from 26m down to **${this.telemetry.avgWait}m**.

#### 2. MEDIUM: Wheelchair Assistance Section 119 (Dispatched)
- **Assigned Force**: Volunteer ID #409.
- **Kit Equipped**: Electric mobility lift, EN/DE translation badge.
- **ETA to Target**: 3 mins.

*You can trigger a simulation of a new mechanical or medical incident using the 'Simulate New Live Incident Event' trigger.*`;
        }

        return `### ⚙️ ARENAOPS EXECUTIVE INTELLIGENCE TERMINAL
        
I am ingesting live stadium telemetry. You can run pre-modeled situational analytics or construct customized dispatch directives.

#### 💡 Suggested Prompts:
- *"Today's Match Telemetry & Bracket Standings"* (to audit live stadium scopes).
- *"Draft Gate D Reroute Dispatch"* (to review crowd bottleneck mitigations).
- *"Sustainability & Solar Log Analysis"* (to check energy and waste metrics).
- *"Active Incidents Brief"* (to audit currently deployed field personnel).`;
    }

    /* Simulates volunteer dispatching and incident removal */
    dispatchVolunteers(incidentId, completionMessage) {
        const item = document.getElementById(incidentId);
        if (item) {
            // Style item as completed
            item.style.opacity = '0.5';
            item.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            item.style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
            
            // Disable button
            const btn = item.querySelector('.dispatch-btn');
            if (btn) {
                btn.setAttribute('disabled', 'true');
                btn.style.backgroundColor = 'var(--green-neon)';
                btn.innerText = 'DISPATCH COMPLETED';
            }

            // Append resolving action to system AI logs
            const badge = item.querySelector('.inc-badge');
            if (badge) {
                badge.className = "inc-badge p-green";
                badge.innerText = "RESOLVED";
            }

            // Decrement active alerts
            if (this.activeIncidentsCount > 0) {
                this.activeIncidentsCount--;
                this.opsActiveIncidentsText.innerText = this.activeIncidentsCount;
            }

            // Add volunteers
            const currentVolunteers = parseInt(this.volunteerReadyText.innerText) || 48;
            this.volunteerReadyText.innerText = `${currentVolunteers + 3} Volunteers Active`;

            alert(`✅ DISPATCH NOTIFICATION SENT:\n"${completionMessage}"`);
        }
    }

    /* Simulates a new telemetry-triggered event alert */
    simulateNewIncident() {
        this.activeIncidentsCount++;
        this.opsActiveIncidentsText.innerText = this.activeIncidentsCount;

        // Custom simulated event properties
        const incidents = [
            {
                id: `inc-sim-${Date.now()}`,
                priority: 'p-yellow',
                title: 'Water Hydration Station Anomaly - Sec 108',
                desc: 'Sensors report abnormal low water pressure at drinking fountain 4. Low eco-cup replenishment stock.',
                ai: 'Dispatched volunteer ID #214 with heavy-cargo eco-cup refills. Plumbing contractor alerted.'
            },
            {
                id: `inc-sim-${Date.now()}`,
                priority: 'p-red',
                title: 'Accessibility Lift Power-Tripped - Sec 103',
                desc: 'ADA mechanical platform lift reports a momentary circuit break. Two wheelchair users in queue.',
                ai: 'Dispatched stadium technician to breaker box North. 2 wheelchair escorts deployed to move queue to Section 104 elevator.'
            },
            {
                id: `inc-sim-${Date.now()}`,
                priority: 'p-yellow',
                title: 'Multilingual Support Request - Concession A Tacos',
                desc: 'Spanish/Portuguese-only speaking tourist having ticket payment issue with checkout scanner.',
                ai: 'Directed Volunteer Guide speaking ES/PT/EN via mobile tablet to checkout stall.'
            }
        ];

        const template = incidents[Math.floor(Math.random() * incidents.length)];
        const badgeColor = template.priority === 'p-red' ? 'CRITICAL' : 'WARNING';

        const newItem = document.createElement('div');
        newItem.className = `incident-item ${template.priority === 'p-red' ? 'priority-high' : 'priority-medium'}`;
        newItem.id = template.id;

        const metaDiv = document.createElement('div');
        metaDiv.className = 'inc-meta';
        
        const badgeSpan = document.createElement('span');
        badgeSpan.className = `inc-badge ${template.priority}`;
        badgeSpan.textContent = badgeColor;
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'inc-time mono-num';
        timeSpan.textContent = new Date().toTimeString().split(' ')[0].substring(0, 5);
        
        metaDiv.append(badgeSpan, timeSpan);
        
        const titleH4 = document.createElement('h4');
        titleH4.className = 'inc-title';
        titleH4.textContent = template.title;
        
        const descP = document.createElement('p');
        descP.className = 'inc-desc';
        descP.textContent = template.desc;
        
        const actionDiv = document.createElement('div');
        actionDiv.className = 'inc-ai-action';
        
        const strongLabel = document.createElement('strong');
        strongLabel.textContent = 'GenAI Dispatch recommendation:';
        
        const aiText = document.createTextNode(` ${template.ai}`);
        
        const dispatchBtn = document.createElement('button');
        dispatchBtn.className = 'dispatch-btn';
        dispatchBtn.setAttribute('data-incident-id', template.id);
        dispatchBtn.setAttribute('data-dispatch-msg', 'Simulated dispatch completed. Field staff reported on-scene and resolved.');
        dispatchBtn.textContent = 'Execute Dispatch Plan';
        
        actionDiv.append(strongLabel, aiText, dispatchBtn);
        
        newItem.append(metaDiv, titleH4, descP, actionDiv);

        this.incidentList.insertBefore(newItem, this.incidentList.firstChild);
        this.incidentList.scrollTop = 0;

        // Flash message
        alert(`🚨 NEW VENUE ALERT INGESTED:\n"${template.title}"\nGenAI dispatch options generated.`);
    }

    triggerOpsReroute() {
        this.telemetry.gateD_ppm = 412; // Bring down crowd metrics instantly!
        this.telemetry.gateB_ppm = 690; // Spread crowd to B
        this.telemetry.gateA_ppm = 490; // Spread crowd to A
        this.telemetry.avgWait = 4.8;
        this.updateOpsDashboard();

        alert("📡 AI CROWD REROUTING SYSTEM EXECUTED:\n- Localized mobile alerts broadcasted successfully.\n- Dynamic signage adjusted at Metro pathways.\n- Gate D line wait time reduced to 4.8 mins!");
    }

    startMatchTickerSimulation() {
        // Run match updates every 6 seconds, advancing clocks and simulating live goals
        this.tickerInterval = setInterval(() => {
            Object.keys(this.simMatches).forEach(matchId => {
                const match = this.simMatches[matchId];
                if (match.isFT) return;

                if (match.isHT) {
                    // 15% chance to start second half
                    if (Math.random() < 0.15) {
                        match.isHT = false;
                        match.time = 46;
                    }
                } else {
                    // Match is active (first or second half)
                    match.time++;

                    // Check for halftime (first half runs to 45)
                    if (match.time === 45 && matchId === 'mexeng') {
                        match.isHT = true;
                    } else if (match.time >= 90) {
                        match.isFT = true;
                        this.resolveKnockoutWinner(matchId);
                    } else {
                        // Small chance of a goal scored (approx 2% for home, 2% for away per tick)
                        const rand = Math.random();
                        if (rand < 0.02) {
                            match.homeScore++;
                            this.triggerMatchGoalAlert(matchId, match.home);
                        } else if (rand < 0.04) {
                            match.awayScore++;
                            this.triggerMatchGoalAlert(matchId, match.away);
                        }
                    }
                }

                // Sync live data to global venueData database
                const venue = this.venueData[match.venueId];
                if (venue) {
                    venue.score = `${match.homeScore} - ${match.awayScore}`;
                    if (match.isFT) {
                        // handled in resolveKnockoutWinner
                    } else if (match.isHT) {
                        venue.time = "HT";
                    } else {
                        venue.time = `${match.time}'`;
                    }
                }

                // Sync UI elements across the page
                this.updateSimulatedMatchUI(matchId);
            });
        }, 6000);
    }

    updateSimulatedMatchUI(matchId) {
        const match = this.simMatches[matchId];
        if (!match) return;

        // 1. Update multi-venue ticker bar
        const teamsEl = document.getElementById(match.tickerTeamsId);
        const timeEl = document.getElementById(match.tickerTimeId);
        if (teamsEl) {
            teamsEl.textContent = `${match.home} ${match.homeFlag} ${match.homeScore}-${match.awayScore} ${match.awayFlag} ${match.away}`;
        }
        if (timeEl) {
            if (match.isFT) {
                timeEl.innerText = "FT";
                timeEl.classList.remove('blinking');
                const parentCard = timeEl.closest('.ticker-match-card');
                if (parentCard) {
                    parentCard.classList.remove('active-match');
                    parentCard.classList.add('completed-match');
                }
            } else if (match.isHT) {
                timeEl.innerText = "HT";
                timeEl.classList.remove('blinking');
            } else {
                timeEl.innerText = `${match.time}'`;
                timeEl.classList.add('blinking');
            }
        }

        // 2. Update bracket modal overlay nodes
        const bhEl = document.getElementById(match.bracketHomeId);
        const baEl = document.getElementById(match.bracketAwayId);
        const btEl = document.getElementById(match.bracketTimeId);
        if (bhEl) bhEl.innerText = match.homeScore;
        if (baEl) baEl.innerText = match.awayScore;
        if (btEl) {
            if (match.isFT) {
                btEl.innerText = "FT";
                btEl.className = "live-tag completed";
                btEl.style.backgroundColor = "var(--gold-brand-dim)";
                btEl.style.color = "var(--gold-brand)";
                btEl.style.borderColor = "rgba(245,158,11,0.3)";
            } else if (match.isHT) {
                btEl.innerText = "HT";
                btEl.className = "live-tag halftime";
            } else {
                btEl.innerText = `LIVE ${match.time}'`;
                btEl.className = "live-tag";
            }
        }

        // 3. Update top match status ribbon (only if this match is at the active current venue)
        if (this.currentVenue === match.venueId) {
            this.updateRibbonForVenue(this.currentVenue);
            // Also keep attendance live
            this.liveAttendanceText.innerText = this.telemetry.attendance.toLocaleString();
        }
    }

    resolveKnockoutWinner(matchId) {
        const match = this.simMatches[matchId];
        if (!match) return;

        // Set live and FT score
        let winnerName = "";
        let winnerFlag = "";
        let finalScoreStr = `${match.homeScore} - ${match.awayScore}`;

        if (match.homeScore > match.awayScore) {
            winnerName = match.home;
            winnerFlag = match.homeFlag;
        } else if (match.awayScore > match.homeScore) {
            winnerName = match.away;
            winnerFlag = match.awayFlag;
        } else {
            // It's a tie! Simulate a penalty shootout for knockout phase
            const penHome = 3 + Math.floor(Math.random() * 3); // 3 to 5
            const penAway = penHome === 5 ? 4 : (Math.random() > 0.5 ? penHome + 1 : penHome - 1); // Ensure winner is decided
            const homeWinsPens = penHome > penAway;
            
            if (homeWinsPens) {
                winnerName = match.home;
                winnerFlag = match.homeFlag;
            } else {
                winnerName = match.away;
                winnerFlag = match.awayFlag;
            }
            finalScoreStr = `${match.homeScore} - ${match.awayScore} (${penHome}-${penAway} pen)`;
        }

        // Update venue data in database
        const venue = this.venueData[match.venueId];
        if (venue) {
            venue.status = "COMPLETED";
            venue.score = finalScoreStr;
            venue.time = "FT";
        }

        // Boldface and style the winner in bracket modal
        const winnerScoreId = winnerName === match.home ? match.bracketHomeId : match.bracketAwayId;
        const winnerScoreEl = document.getElementById(winnerScoreId);
        if (winnerScoreEl) {
            const teamContainer = winnerScoreEl.parentElement;
            if (teamContainer) {
                teamContainer.classList.add('winner');
            }
        }

        // Propagate team to Quarter-Final slots if applicable
        if (matchId === 'usager') {
            const slot = document.getElementById('qf-slot-winner1');
            if (slot) {
                slot.textContent = `${winnerFlag} ${winnerName}`;
                slot.classList.add('filled-team');
                slot.style.color = "var(--text-light)";
                slot.style.fontWeight = "700";
            }
        } else if (matchId === 'argfra') {
            const slot = document.getElementById('qf-slot-winner2');
            if (slot) {
                slot.textContent = `${winnerFlag} ${winnerName}`;
                slot.classList.add('filled-team');
                slot.style.color = "var(--text-light)";
                slot.style.fontWeight = "700";
            }
        }

        // If the selected venue is the venue of the finished match, trigger stadium clearance mode!
        if (this.currentVenue === match.venueId) {
            this.handleVenueChange(this.currentVenue);
        }

        // Create elegant final completion alert in chatbots
        const completionNoticeFan = `🏁 **FULL TIME WHISTLE!**
The match at **${venue.name}** has finished!
🏆 Final Score: **${match.homeFlag} ${match.home} vs ${match.awayFlag} ${match.away}** ended **${finalScoreStr}**.
👏 **${winnerFlag} ${winnerName}** advances to the Quarter-Finals!
🚌 *Operations Notice: Outbound electric shuttle services are now fully active at Gate B. Travel safe!*`;

        const completionNoticeOps = `📋 **V-OPS TRANSITION REPORT (MATCH COMPLETE):**
🏟️ **Venue:** ${venue.name}
🏁 **Result:** ${match.home} vs ${match.away} ended **${finalScoreStr}** (Winner: **${winnerName}**).
🚪 **Stadium Egress Protocol:** Activated egress routing. Crowd flow sensors peaking near Metro Gate A. Dispatched 12 additional shuttle marshals. All 16 host venues reporting normal egress parameters.`;

        this.appendChatMessage(this.fanChatMessages, "🤖", completionNoticeFan, "assistant-msg match-complete-msg");
        this.appendChatMessage(this.opsChatMessages, "📊", completionNoticeOps, "assistant-msg ops match-complete-msg");
    }

    triggerMatchGoalAlert(matchId, scoringTeam) {
        const match = this.simMatches[matchId];
        if (!match) return;

        const venue = this.venueData[match.venueId];
        const teamFlag = scoringTeam === match.home ? match.homeFlag : match.awayFlag;

        // 1. Beautiful animated alert in Fan Portal Chat
        const alertFan = `⚽ **GOAL ALERT!!!**
A thrilling goal has been scored at **${venue.name}**!
📢 **${teamFlag} ${scoringTeam}** has found the back of the net in the **${match.time}'** minute!
📊 Scoreboard: **${match.homeFlag} ${match.home} ${match.homeScore} - ${match.awayScore} ${match.awayFlag} ${match.away}**
🥳 *The stadium crowd is electric! Section decibel readings indicate 104dB surges. Enjoy the tournament!*`;

        // 2. Automated crowd response and alert in Operations Command
        const alertOps = `🔔 **TELEMETRY CRITICAL EVENT: GOAL REGISTERED**
🏟️ **Location:** ${venue.name} (Pitch Sensors Sector 4)
📊 **Match State:** ${match.home} vs ${match.away} is now **${match.homeScore} - ${match.awayScore}** (${match.time}')
📈 **Ops Dispatch Directive:**
- Decibel surge of 105dB detected at stadium sensors.
- Localized security personnel alerted to monitor North Stand crowd surge.
- Smart energy grid dynamically routed 50kW peak power to support the live replay displays.`;

        this.appendChatMessage(this.fanChatMessages, "🤖", alertFan, "assistant-msg goal-alert-msg");
        this.appendChatMessage(this.opsChatMessages, "📊", alertOps, "assistant-msg ops goal-alert-msg");

        // Force scroll container down
        this.fanChatMessages.scrollTop = this.fanChatMessages.scrollHeight;
        this.opsChatMessages.scrollTop = this.opsChatMessages.scrollHeight;
    }

    escapeHTML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    /* Helper Chat styling */
    parseMarkdownToDOM(text) {
        const container = document.createElement('div');
        const lines = text.split('\n');
        lines.forEach((line, index) => {
            if (index > 0) {
                container.appendChild(document.createElement('br'));
            }
            if (line.trim().startsWith('### ')) {
                const h3 = document.createElement('h3');
                this.parseInlineFormatting(line.trim().substring(4), h3);
                container.appendChild(h3);
            } else if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                const li = document.createElement('li');
                const cleanLine = line.trim();
                const startIdx = cleanLine.startsWith('* ') ? 2 : 2;
                this.parseInlineFormatting(cleanLine.substring(startIdx), li);
                container.appendChild(li);
            } else {
                const span = document.createElement('span');
                this.parseInlineFormatting(line, span);
                container.appendChild(span);
            }
        });
        return container;
    }

    parseInlineFormatting(text, parentEl) {
        const regex = /\*\*(.*?)\*\*/g;
        let lastIndex = 0;
        let match;
        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parentEl.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
            }
            const strong = document.createElement('strong');
            strong.textContent = match[1];
            parentEl.appendChild(strong);
            lastIndex = regex.lastIndex;
        }
        if (lastIndex < text.length) {
            parentEl.appendChild(document.createTextNode(text.substring(lastIndex)));
        }
    }

    /* Helper Chat styling */
    appendChatMessage(container, avatar, text, className) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${className}`;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = `msg-avatar ${className.includes('ops') ? 'gold-bg' : ''}`;
        avatarDiv.textContent = avatar;

        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'msg-bubble';

        const contentDiv = this.parseMarkdownToDOM(text);
        bubbleDiv.appendChild(contentDiv);

        msgDiv.append(avatarDiv, bubbleDiv);
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    }

    appendTypingIndicator(container) {
        const id = 'typing-' + Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant-msg typing-indicator-msg';
        typingDiv.id = id;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'msg-avatar';
        avatarDiv.textContent = '🤖';

        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'msg-bubble';
        bubbleDiv.style.padding = '0.5rem 1rem';

        const pEl = document.createElement('p');
        pEl.className = 'mono-num';
        pEl.style.fontSize = '1.15rem';
        pEl.style.letterSpacing = '2px';
        pEl.style.margin = '0';
        pEl.style.animation = 'blink 1.4s infinite';
        pEl.textContent = '...';

        bubbleDiv.appendChild(pEl);
        typingDiv.append(avatarDiv, bubbleDiv);
        container.appendChild(typingDiv);
        container.scrollTop = container.scrollHeight;
        return id;
    }

    removeTypingIndicator(container, id) {
        const indicator = document.getElementById(id);
        if (indicator) {
            container.removeChild(indicator);
        }
    }

    getLanguageStrings() {
        return {
            en: {
                fanLabel: "Fan Portal",
                opsLabel: "V-Ops Control",
                navTitle: "Interactive Wayfinding & Facilities",
                transitTitle: "Eco-Transit Planner",
                transitLabel: "How are you traveling?",
                venuePrompt: "My FIFA Eco-Wallet Balance",
                chatTitle: "StadiumGuide AI",
                chatSub: "2026 Multilingual Virtual Assistant",
                chatIntro: "Hello! Welcome to the FIFA World Cup 2026. I am **StadiumGuide AI**, your virtual host. How can I make your stadium experience spectacular today?",
                chatPlaceholder: "Ask StadiumGuide AI...",

            },
            es: {
                fanLabel: "Portal de Fan",
                opsLabel: "Control V-Ops",
                navTitle: "Navegación Interactiva y Servicios",
                transitTitle: "Planificador de Eco-Transporte",
                transitLabel: "¿Cómo viajas al estadio?",
                venuePrompt: "Mi saldo de Eco-Billetera FIFA",
                chatTitle: "StadiumGuide AI (ES)",
                chatSub: "Asistente Virtual Multilingüe 2026",
                chatIntro: "¡Hola! Bienvenido a la Copa Mundial de la FIFA 2026. Soy **StadiumGuide AI**, tu asistente virtual. ¿Cómo puedo hacer que tu experiencia hoy sea espectacular?",
                chatPlaceholder: "Preguntar a StadiumGuide AI...",

            },
            fr: {
                fanLabel: "Portail Supporter",
                opsLabel: "Contrôle V-Ops",
                navTitle: "Cartographie et Services Interactifs",
                transitTitle: "Planificateur d'Éco-Transit",
                transitLabel: "Comment vous déplacez-vous ?",
                venuePrompt: "Mon Solde Éco-Portefeuille FIFA",
                chatTitle: "StadiumGuide AI (FR)",
                chatSub: "Assistant Virtuel Multilingue 2026",
                chatIntro: "Bonjour ! Bienvenue à la Coupe du Monde de la FIFA 2026. Je suis **StadiumGuide AI**, votre hôte virtuel. Comment puis-je rendre votre expérience aujourd'hui spectaculaire ?",
                chatPlaceholder: "Poser une question à StadiumGuide AI...",

            },
            pt: {
                fanLabel: "Portal de Fãs",
                opsLabel: "Controle V-Ops",
                navTitle: "Navegação Interativa e Serviços",
                transitTitle: "Planejador de Eco-Trânsito",
                transitLabel: "Como você está viajando?",
                venuePrompt: "Meu Saldo de Eco-Carteira FIFA",
                chatTitle: "StadiumGuide AI (PT)",
                chatSub: "Assistente Virtual Multilíngue 2026",
                chatIntro: "Olá! Bem-vindo à Copa do Mundo da FIFA 2026. Eu sou o **StadiumGuide AI**, seu assistente virtual. Como posso tornar sua experiência no estádio espetacular hoje?",
                chatPlaceholder: "Perguntar ao StadiumGuide AI...",

            },
            ar: {
                fanLabel: "بوابة المشجعين",
                opsLabel: "إدارة العمليات V-Ops",
                navTitle: "خريطة الملاعب والخدمات التفاعلية",
                transitTitle: "مخطط النقل الصديق للبيئة",
                transitLabel: "كيف تخطط للوصول إلى الملعب؟",
                venuePrompt: "رصيد محفظة الفيفا الخضراء الخاصة بي",
                chatTitle: "StadiumGuide AI (AR)",
                chatSub: "مساعد فيفا الافتراضي متعدد اللغات",
                chatIntro: "مرحباً بك في كأس العالم لكرة القدم ٢٠٢٦! أنا **مساعد فيفا الافتراضي**. كيف يمكنني مساعدتك اليوم في تسهيل حركتك وتجربتك داخل الملعب؟",
                chatPlaceholder: "اسأل مساعد فيفا الذكي...",

            }
        };
    }

    /* Dynamically translates primary header and onboarding interface elements based on Lang Selector */
    renderLanguageStrings() {
        const strings = this.getLanguageStrings();
        const activeStrings = strings[this.currentLanguage] || strings.en;

        // Apply changes to layout text
        const labelFanText = document.getElementById('label-fan');
        if (labelFanText) labelFanText.innerText = activeStrings.fanLabel;
        const labelOpsText = document.getElementById('label-ops');
        if (labelOpsText) labelOpsText.innerText = activeStrings.opsLabel;
        
        const mapHeader = document.querySelector('#fan-map-card h2');
        if (mapHeader) mapHeader.innerText = activeStrings.navTitle;

        const transitHeader = document.querySelector('#eco-transit-card h2');
        if (transitHeader) transitHeader.innerText = activeStrings.transitTitle;

        const transitFormLabel = document.querySelector('label[for="transit-method"]');
        if (transitFormLabel) transitFormLabel.innerText = activeStrings.transitLabel;

        const walletLabelText = document.querySelector('.green-wallet-banner .wallet-text p');
        if (walletLabelText) walletLabelText.innerText = activeStrings.venuePrompt;

        const chatNameText = document.querySelector('#fan-chat-panel .chat-agent-info h2');
        if (chatNameText) chatNameText.innerText = activeStrings.chatTitle;

        const chatSubText = document.querySelector('#fan-chat-panel .chat-agent-info span');
        if (chatSubText) chatSubText.innerText = activeStrings.chatSub;

        if (this.fanChatInput) {
            this.fanChatInput.placeholder = activeStrings.chatPlaceholder;
        }



        // Post language-changed greeting update (only if conversation just started)
        if (this.fanChatMessages && this.fanChatMessages.children.length <= 1) {
            this.fanChatMessages.textContent = '';
            this.appendChatMessage(this.fanChatMessages, "🤖", activeStrings.chatIntro, "assistant-msg");
        }

        // Sync Eco-Wallet display on language change
        this.updateWalletUI();
    }


}

// Global App Instance
if (typeof window !== 'undefined') {
    const app = new SmartVenueApp();
    window.app = app; // expose to window for diagnostics
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = { SmartVenueApp };
}
