(() => {
    function log(...args){ console.log('[herramientas]', ...args); }

    // Cache for fetched car data
    const carDataCache = {};

    document.addEventListener('DOMContentLoaded', ()=>{
        const carsArr = window.CARSPECIO_COMPARE_CARS || window.carspecio_COMPARE_CARS || [];
        const cars = {};
        if (Array.isArray(carsArr)) {
            carsArr.forEach(c => { if (c && c.name) cars[c.name] = c; });
        } else if (typeof carsArr === 'object') {
            Object.assign(cars, carsArr);
        }

        // Calculator elements
        const modelSelect = document.getElementById('toolModelSelect');
        const kmInput = document.getElementById('kmInput');
        const fuelPriceInput = document.getElementById('fuelPriceInput');
        const deprRateInput = document.getElementById('deprRateInput');
        const kmDisplay = document.getElementById('kmDisplay');
        const fuelDisplay = document.getElementById('fuelDisplay');
        const deprDisplay = document.getElementById('deprDisplay');
        const costFuel = document.getElementById('costFuel');
        const costInsurance = document.getElementById('costInsurance');
        const costMaint = document.getElementById('costMaint');
        const costDep = document.getElementById('costDep');
        const costTotal = document.getElementById('costTotal');
        const costPerKm = document.getElementById('costPerKm');

        // Energy label elements
        const fuelLabelSpan = document.querySelector('label[for="fuelPriceInput"] > span');
        const fuelCardSpan = document.querySelector('.calc-result-card span');
        const fuelCardP = document.querySelector('.calc-result-card p');

        function formatEur(n){
            return '\u20ac' + Math.round(n).toLocaleString('es-ES');
        }

        function formatDecimal(n) {
            return n.toFixed(2).replace('.', ',');
        }

        function clearOptions(sel){
            if (!sel) return;
            while(sel.options && sel.options.length>1) sel.remove(1);
        }

        // Detect energy type from car data
        function detectEnergyType(carData) {
            if (!carData) return 'fuel';
            const pt = (carData.powertrain && carData.powertrain.type) ||
                       (carData.specs && carData.specs.engine && carData.specs.engine.fuelType) || '';
            const ptl = String(pt).toLowerCase();
            if (ptl.includes('electric') || ptl.includes('electrico') || ptl.includes('\u00e9lectrique') || ptl.includes('\u0643\u0647\u0631\u0628')) return 'electric';
            if (ptl.includes('hybrid') || ptl.includes('h\u00edbrido') || ptl.includes('hybride') || ptl.includes('phev')) return 'hybrid';
            return 'fuel';
        }

        // Get consumption value (L/100km or kWh/100km)
        function getConsumption(carData, energyType) {
            if (!carData || !carData.fuelEconomy) return 12;
            const fe = carData.fuelEconomy;

            if (energyType === 'electric') {
                const kwh = (fe.energyConsumption && fe.energyConsumption.combined && fe.energyConsumption.combined.value) ||
                            (fe.consumption && fe.consumption.combined && fe.consumption.combined.value) || 15.7;
                return kwh;
            }

            // For hybrid and petrol: use drivingStyles or combined
            if (fe.drivingStyles) {
                const ds = fe.drivingStyles;
                const norm = v => (typeof v === 'object' && v !== null) ? v.value : v;
                const mixed = norm(ds.mixed);
                if (mixed) return mixed;
            }

            const combined = (fe.consumption && fe.consumption.combined && fe.consumption.combined.value) ||
                             (fe.petrol && fe.petrol.combined && fe.petrol.combined.value) ||
                             (fe.diesel && fe.diesel.combined && fe.diesel.combined.value) || null;
            if (combined) return combined;

            return 12;
        }

        // Get price from countryPricing (Spain default)
        function getPrice(carData) {
            if (!carData) return 100000;
            if (carData.countryPricing && carData.countryPricing.es && carData.countryPricing.es.priceNew) {
                return carData.countryPricing.es.priceNew;
            }
            if (carData.pricing && carData.pricing.es) return carData.pricing.es;
            if (carData.basicInfo && carData.basicInfo.priceFrom) return carData.basicInfo.priceFrom;
            return 100000;
        }

        // Get insurance from countryPricing
        function getInsurance(carData) {
            if (!carData) return 2500;
            if (carData.countryPricing && carData.countryPricing.es && carData.countryPricing.es.insurance) {
                return carData.countryPricing.es.insurance;
            }
            if (carData.runningCosts && carData.runningCosts.es && carData.runningCosts.es.insuranceGroups) {
                return 2500;
            }
            return 2500;
        }

        // Get maintenance from countryPricing
        function getMaintenance(carData) {
            if (!carData) return 3500;
            if (carData.countryPricing && carData.countryPricing.es && carData.countryPricing.es.maintenance) {
                return carData.countryPricing.es.maintenance;
            }
            if (carData.runningCosts && carData.runningCosts.es && carData.runningCosts.es.servicing) {
                const s = carData.runningCosts.es.servicing;
                if (s.costMinor && s.costMajor) {
                    return (s.costMinor.value + s.costMajor.value) / 2;
                }
            }
            return 3500;
        }

        // Fetch car JSON data
        async function fetchCarData(carEntry) {
            if (!carEntry) return null;
            const cacheKey = carEntry.id || carEntry.name;
            if (carDataCache[cacheKey]) return carDataCache[cacheKey];

            try {
                const dataFile = carEntry.dataFile || ('../system/data/' + carEntry.id + '.json');
                const response = await fetch(dataFile);
                if (!response.ok) throw new Error('HTTP ' + response.status);
                const data = await response.json();
                carDataCache[cacheKey] = data;
                return data;
            } catch(e) {
                log('Failed to fetch car data for', carEntry.name, e.message);
                return null;
            }
        }

        // Update fuel slider based on energy type
        function updateFuelSlider(energyType) {
            if (!fuelPriceInput) return;
            if (energyType === 'electric') {
                // Electricity price: 10-50 cents/kWh -> slider 100-500 (cents/10 = EUR)
                fuelPriceInput.min = 100;
                fuelPriceInput.max = 500;
                fuelPriceInput.step = 5;
                fuelPriceInput.value = 200; // 0.20 EUR/kWh default
                if (fuelLabelSpan) fuelLabelSpan.textContent = 'Precio electricidad (\u20ac/kWh)';
                if (fuelCardSpan) fuelCardSpan.textContent = 'Energ\u00eda (el\u00e9ctrica)';
                if (fuelCardP) fuelCardP.textContent = 'Coste de recarga seg\u00fan tu kilometraje.';
            } else if (energyType === 'hybrid') {
                // PHEV uses petrol, keep fuel slider
                fuelPriceInput.min = 100;
                fuelPriceInput.max = 250;
                fuelPriceInput.step = 5;
                if (parseInt(fuelPriceInput.value) > 250 || parseInt(fuelPriceInput.value) < 100) {
                    fuelPriceInput.value = 175;
                }
                if (fuelLabelSpan) fuelLabelSpan.textContent = 'Precio combustible (\u20ac/L)';
                if (fuelCardSpan) fuelCardSpan.textContent = 'Energ\u00eda (PHEV)';
                if (fuelCardP) fuelCardP.textContent = 'Impacto del consumo seg\u00fan tu kilometraje.';
            } else {
                // Petrol/diesel
                fuelPriceInput.min = 100;
                fuelPriceInput.max = 250;
                fuelPriceInput.step = 5;
                if (parseInt(fuelPriceInput.value) > 250 || parseInt(fuelPriceInput.value) < 100) {
                    fuelPriceInput.value = 175;
                }
                if (fuelLabelSpan) fuelLabelSpan.textContent = 'Precio combustible (\u20ac/L)';
                if (fuelCardSpan) fuelCardSpan.textContent = 'Combustible anual';
                if (fuelCardP) fuelCardP.textContent = 'Impacto del consumo seg\u00fan tu kilometraje.';
            }
        }

        function populateModels(){
            if (!modelSelect) return;
            clearOptions(modelSelect);
            Object.keys(cars).forEach(name => {
                const opt = document.createElement('option');
                opt.value = name; opt.textContent = name; modelSelect.appendChild(opt);
            });
            log('models populated', Object.keys(cars).length);
        }

        // Live calculator update
        let currentEnergyType = 'fuel';
        let currentCarData = null;

        async function updateCalculator(){
            const modelName = modelSelect ? modelSelect.value : '';
            const km = kmInput ? Number(kmInput.value) || 15000 : 15000;
            const fuelPrice = fuelPriceInput ? Number(fuelPriceInput.value) / 100 : 1.75;
            const deprRate = deprRateInput ? Number(deprRateInput.value) : 10;

            // Update slider displays
            if (kmDisplay) kmDisplay.textContent = km.toLocaleString('es-ES') + ' km';
            if (fuelDisplay) fuelDisplay.textContent = formatDecimal(fuelPrice) + ' \u20ac';
            if (deprDisplay) deprDisplay.textContent = deprRate + '%';

            if (!modelName) {
                if (costFuel) costFuel.textContent = '\u20ac0';
                if (costInsurance) costInsurance.textContent = '\u20ac0';
                if (costMaint) costMaint.textContent = '\u20ac0';
                if (costDep) costDep.textContent = '\u20ac0';
                if (costTotal) costTotal.textContent = '\u20ac0';
                if (costPerKm) costPerKm.textContent = '\u20ac \u20ac0,00 / km';
                return;
            }

            const car = cars[modelName];
            if (!car) return;

            // Fetch full car data if not cached
            if (!currentCarData || (car.id && currentCarData.id !== car.id)) {
                currentCarData = await fetchCarData(car);
            }
            const cd = currentCarData;

            // Detect energy type
            currentEnergyType = detectEnergyType(cd);
            updateFuelSlider(currentEnergyType);

            // Re-read fuel price after slider update
            const adjustedFuelPrice = fuelPriceInput ? Number(fuelPriceInput.value) / 100 : (currentEnergyType === 'electric' ? 0.20 : 1.75);

            // Get consumption
            const consumption = getConsumption(cd, currentEnergyType);

            // Get price, insurance, maintenance
            const price = cd ? getPrice(cd) : (car.priceNum || 100000);
            const insurance = cd ? getInsurance(cd) : 2500;
            const maintenance = cd ? getMaintenance(cd) : 3500;

            // Calculations
            const energyAnnual = Math.round(consumption * (km / 100) * adjustedFuelPrice);
            const depreciationAnnual = Math.round(price * (deprRate / 100));
            const totalAnnual = energyAnnual + insurance + maintenance + depreciationAnnual;
            const perKmCost = km ? (totalAnnual / km) : 0;

            // Update result cards
            if (costFuel) costFuel.textContent = formatEur(energyAnnual);
            if (costInsurance) costInsurance.textContent = formatEur(insurance);
            if (costMaint) costMaint.textContent = formatEur(maintenance);
            if (costDep) costDep.textContent = formatEur(depreciationAnnual);
            if (costTotal) costTotal.textContent = formatEur(totalAnnual);
            if (costPerKm) costPerKm.textContent = '\u20ac ' + formatEur(perKmCost).replace('\u20ac','') + ' / km';

            // Update fuel display with adjusted price
            if (fuelDisplay) fuelDisplay.textContent = formatDecimal(adjustedFuelPrice) + ' \u20ac' + (currentEnergyType === 'electric' ? '/kWh' : '/L');
        }

        // Price comparator
        const priceA = document.getElementById('priceSelectA');
        const priceB = document.getElementById('priceSelectB');
        const priceBtn = document.getElementById('priceCompareBtn');
        const priceOut = document.getElementById('priceCompareResult');
        const openFull = document.getElementById('openFullCompare');

        function populatePriceSelects(){
            if (!priceA || !priceB) return;
            clearOptions(priceA); clearOptions(priceB);
            Object.keys(cars).forEach(name => {
                const o1 = document.createElement('option'); o1.value = name; o1.textContent = name;
                const o2 = document.createElement('option'); o2.value = name; o2.textContent = name;
                priceA.appendChild(o1); priceB.appendChild(o2);
            });
            log('price selects populated');
        }

        async function comparePrices(){
            if (!priceA || !priceB || !priceOut) return;
            const a = priceA.value; const b = priceB.value;
            if (!a || !b) { priceOut.textContent = 'Selecciona dos modelos distintos.'; if(openFull) openFull.style.display='none'; return; }
            if (a === b) { priceOut.textContent = 'Selecciona dos modelos diferentes.'; if(openFull) openFull.style.display='none'; return; }

            const ca = cars[a]; const cb = cars[b];
            const [da, db] = await Promise.all([fetchCarData(ca), fetchCarData(cb)]);
            const pa = da ? getPrice(da) : (ca ? (ca.priceNum||0) : 0);
            const pb = db ? getPrice(db) : (cb ? (cb.priceNum||0) : 0);
            const diff = Math.abs(pa - pb);
            const cheaper = pa < pb ? a : b;
            priceOut.innerHTML = '<p><strong>' + a + ':</strong> ' + formatEur(pa) + '</p>' +
                '<p><strong>' + b + ':</strong> ' + formatEur(pb) + '</p>' +
                '<p><strong>Diferencia:</strong> ' + formatEur(diff) + '</p>' +
                '<p>Recomendado (seg\u00fan precio): <strong>' + cheaper + '</strong></p>';
            if (openFull) {
                openFull.href = 'compare.html?car1=' + encodeURIComponent(a) + '&car2=' + encodeURIComponent(b);
                openFull.style.display='inline-flex';
            }
        }

        // Depreciation & rankings hooks
        const deprModel = document.getElementById('deprModelSelect');
        const deprYears = document.getElementById('deprYears');
        const deprRateTool = document.getElementById('deprRateTool');
        const deprBtn = document.getElementById('deprCalcBtn');
        const deprOut = document.getElementById('deprOutput');

        function populateDeprModels(){
            if (!deprModel) return;
            clearOptions(deprModel);
            Object.keys(cars).forEach(name=>{
                const o=document.createElement('option');
                o.value=name; o.textContent=name;
                deprModel.appendChild(o);
            });
            log('depr models populated');
        }

        async function calcDepreciation(){
            if (!deprModel || !deprOut) return;
            const name = deprModel.value;
            const years = Number(deprYears.value) || 5;
            const rate = Number(deprRateTool.value) || 10;
            const car = cars[name];
            if (!car){ deprOut.textContent = 'Selecciona un modelo v\u00e1lido.'; return; }

            const cd = await fetchCarData(car);
            const start = cd ? getPrice(cd) : (car.priceNum || 0);
            let value = start;
            let html = '<table style="width:100%; border-collapse:collapse"><thead><tr><th>A\u00f1o</th><th>Valor estimado</th><th>P\u00e9rdida acumulada</th></tr></thead><tbody>';
            for (let y=1;y<=years;y++){
                const loss = Math.round(value * (rate/100));
                value = Math.round(value - loss);
                const lostTotal = start - value;
                html += '<tr><td style="padding:6px">' + y + '</td><td style="padding:6px">' + formatEur(value) + '</td><td style="padding:6px">' + formatEur(lostTotal) + '</td></tr>';
            }
            html += '</tbody></table>';
            deprOut.innerHTML = html;
        }

        // Rankings
        const rankPriceBtn = document.getElementById('rankPrice');
        const rankPowerBtn = document.getElementById('rankPower');
        const rankReliBtn = document.getElementById('rankReli');
        const rankTopN = document.getElementById('rankTopN');
        const rankOut = document.getElementById('rankingsList');

        // Preload all car data for rankings
        async function preloadAllCarData() {
            const entries = Object.values(cars);
            await Promise.all(entries.map(e => fetchCarData(e)));
        }

        async function showRanking(metric, desc, topN){
            if (!rankOut) return;
            rankOut.textContent = 'Cargando datos...';

            await preloadAllCarData();

            const arr = Object.keys(cars).map(name => {
                const cd = carDataCache[cars[name].id || name];
                let v = 0;
                if (cd) {
                    if (metric === 'price') v = getPrice(cd);
                    else if (metric === 'power') v = (cd.performance && cd.performance.power && cd.performance.power.value) || 0;
                    else if (metric === 'reliability') {
                        const r = cd.rating && cd.rating.reliability;
                        v = parseFloat(String(r).replace(',', '.')) || 0;
                    }
                }
                return {name, v, raw: cars[name], cd};
            });

            if (metric === 'price') arr.sort((a,b) => a.v - b.v);
            else arr.sort((a,b) => b.v - a.v);

            const requested = Math.max(1, Math.min(50, Number(topN) || 5));
            const available = arr.length;
            const limit = Math.min(requested, available);
            let html = '<h3>Top ' + limit + ' de ' + available + ' \u2014 ' + desc + '</h3><ol>';
            arr.slice(0, limit).forEach(item => {
                let label = 'N/D';
                if (metric === 'price') label = formatEur(item.v);
                else if (metric === 'power') label = item.v + ' HP';
                else if (metric === 'reliability') label = item.v.toFixed(1) + '/10';
                html += '<li><strong>' + item.name + '</strong> \u2014 ' + label + '</li>';
            });
            html += '</ol>';
            if (requested > available) {
                html += '<p style="margin-top:10px; color:var(--text-secondary);">Solo hay ' + available + ' modelos disponibles en los datos.</p>';
            }
            rankOut.innerHTML = html;
        }

        // Number controls for rankTopN
        function changeNumberValue(targetId, delta) {
            const input = document.getElementById(targetId);
            if (!input) return;
            const min = parseFloat(input.min) || 1;
            const max = parseFloat(input.max) || 50;
            const step = parseFloat(input.step) || 1;
            let value = parseFloat(input.value) || 5;
            value = Math.max(min, Math.min(max, value + delta * step));
            input.value = value;
        }

        function setupNumberButtons() {
            const btns = document.querySelectorAll('.number-btn');
            btns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = btn.dataset.target;
                    const delta = btn.classList.contains('number-increment') ? 1 : -1;
                    changeNumberValue(targetId, delta);
                });
            });
        }

        // Wait for car data if needed
        function waitForCars(cb, attempts=12, delay=150){
            if (Object.keys(window.carspecio_COMPARE_CARS||{}).length){ cb(); }
            else if(attempts>0){ setTimeout(()=>waitForCars(cb, attempts-1, delay), delay); }
            else { console.warn('herramientas: car data not available'); cb(); }
        }

        waitForCars(()=>{
            try{
                populateModels(); populatePriceSelects(); populateDeprModels(); setupNumberButtons();
            }catch(e){ console.error('herramientas init error', e); }
        });

        // Attach listeners
        if (modelSelect) modelSelect.addEventListener('change', () => { currentCarData = null; updateCalculator(); });
        if (kmInput) kmInput.addEventListener('input', updateCalculator);
        if (fuelPriceInput) fuelPriceInput.addEventListener('input', updateCalculator);
        if (deprRateInput) deprRateInput.addEventListener('input', updateCalculator);
        if (priceBtn) priceBtn.addEventListener('click', (e) => { e.preventDefault(); comparePrices(); });
        if (deprBtn) deprBtn.addEventListener('click', (e) => { e.preventDefault(); calcDepreciation(); });
        if (rankPriceBtn) rankPriceBtn.addEventListener('click', () => showRanking('price', 'Mejor precio (m\u00e1s barato)', Number(rankTopN.value)));
        if (rankPowerBtn) rankPowerBtn.addEventListener('click', () => showRanking('power', 'M\u00e1s potencia', Number(rankTopN.value)));
        if (rankReliBtn) rankReliBtn.addEventListener('click', () => showRanking('reliability', 'Mejor fiabilidad', Number(rankTopN.value)));

        // Initial display
        updateCalculator();

        log('herramientas script initialized');
    });
})();
