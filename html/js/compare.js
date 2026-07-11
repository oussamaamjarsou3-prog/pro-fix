/* CarSpecio — lógica comparativas */

(function () {
    // Use index instead of hardcoded car data
    const carIndex = window.CARSPECIO_COMPARE_INDEX || window.carspecio_COMPARE_CARS || [];
    const presets = window.CARSPECIO_COMPARE_PRESETS || window.carspecio_COMPARE_PRESETS || [];
    
    // Cache for loaded car data
    const carDataCache = new Map();
    
    // Convert index to object format for backward compatibility
    const cars = {};
    carIndex.forEach(car => {
        cars[car.name] = car;
    });
    
    const select1 = document.getElementById("compareSelect1");
    const select2 = document.getElementById("compareSelect2");
    const selects = [select1, select2].filter(Boolean);
    const swapBtn = document.getElementById("swapBtn");
    const runCompareBtn = document.getElementById("runCompareBtn");
    const carModelSearch = document.getElementById("carModelSearch");
    const carModelsList = document.getElementById("carModelsList");
    const categoryFilter = document.getElementById("categoryFilter");
    const budgetFilter = document.getElementById("budgetFilter");
    const searchHint = document.getElementById("searchHint");
    const popularGrid = document.getElementById("popularCompareGrid");
    const sortFilter = document.getElementById("sortFilter");
    const fuelFilter = document.getElementById("fuelFilter");

    const FUEL_PRICE = 1.75;
    const ELECTRICITY_PRICE = 0.30; // €0.30 per kWh
    const KM_YEAR = 15000;

    // Load car data dynamically from system/data/*.json
    async function loadCarData(carIndexEntry) {
        if (carDataCache.has(carIndexEntry.id)) {
            return carDataCache.get(carIndexEntry.id);
        }
        
        try {
            const response = await fetch(carIndexEntry.dataFile);
            if (!response.ok) throw new Error(`Failed to load ${carIndexEntry.dataFile}`);
            const data = await response.json();
            carDataCache.set(carIndexEntry.id, data);
            return data;
        } catch (error) {
            console.error(`Error loading car data for ${carIndexEntry.name}:`, error);
            return null;
        }
    }

    // Convert car data to compare format
    function convertCarDataToCompare(carIndexEntry, carData) {
        if (!carData) return null;
        
        // Get current language
        const currentLang = window.currentLang ? window.currentLang() : 'es';
        const isArabic = currentLang === 'ar';
        
        const specs = carData.specs || {};
        const performance = carData.performance || {};
        const dimensions = carData.dimensions || {};
        const fuelEconomy = carData.fuelEconomy || {};
        const pricing = carData.pricing || {};
        const content = carData.content || {};
        const electric = carData.electric || {};
        const basicInfo = carData.basicInfo || {};
        
        // Get fuel type
        const fuelType = specs.engine?.fuelType || carData.powertrain?.type || 'petrol';
        
        // Get fuel consumption — handle both fe.consumption and fe.petrol structures
        let fuelConsumption = 10;
        let consumptionUnit = 'L/100km';
        const consData = fuelEconomy.consumption || fuelEconomy.petrol || {};
        if (consData.combined) {
            fuelConsumption = consData.combined.value;
            consumptionUnit = consData.combined.unit || 'L/100km';
        } else if (electric.batteryCapacity) {
            fuelConsumption = electric.batteryCapacity.value;
            consumptionUnit = 'kWh/100km';
        }
        
        // Get trunk capacity — handle cargoCapacity.seatsUp, cargo.{value}, and plain number
        let trunk = 400;
        if (dimensions.cargoCapacity && dimensions.cargoCapacity.seatsUp) {
            trunk = dimensions.cargoCapacity.seatsUp.value;
        } else if (dimensions.cargo) {
            trunk = typeof dimensions.cargo === 'object' ? dimensions.cargo.value : dimensions.cargo;
        }
        
        // Get seating
        const seating = carData.seats || 5;
        
        // Get drivetrain
        const drive = (carData.drivetrain || specs.drivetrain?.type || 'AWD').toUpperCase();
        const driveAr = specs.drivetrain?.typeAr || drive;
        
        // Get weight — handle curbWeight.{value,unit} and weight.{curb,unit}
        let weight = '2,000 kg';
        if (dimensions.curbWeight) {
            const w = typeof dimensions.curbWeight === 'object' ? dimensions.curbWeight.value : dimensions.curbWeight;
            weight = `${w.toLocaleString('es-ES')} ${dimensions.curbWeight.unit || 'kg'}`;
        } else if (dimensions.weight) {
            weight = `${dimensions.weight.curb.toLocaleString('es-ES')} ${dimensions.weight.unit || 'kg'}`;
        }
        
        // Get range
        let range = '600 km';
        if (fuelEconomy.range && fuelEconomy.range.combined) {
            range = `${fuelEconomy.range.combined.value} ${fuelEconomy.range.combined.unit}`;
        } else if (electric.electricRange) {
            range = `${electric.electricRange.value} ${electric.electricRange.unit}`;
        }
        
        // Get suspension description
        const tSafe = (key, fallback) => typeof t === 'function' ? (t(key) || fallback) : fallback;
        let suspension = tSafe('compare.multiLink', 'Multi-link');
        if (specs.suspension) {
            if (specs.suspension.airSuspension) {
                suspension = tSafe('compare.airSuspension', 'Adaptive air suspension');
            } else {
                suspension = `${specs.suspension.front || ''} / ${specs.suspension.rear || ''}`;
            }
        }
        
        // Get transmission description
        let transmission = 'Automatic';
        if (specs.transmission) {
            const gearsSuffix = tSafe('compare.velocidades', 'velocidades');
            transmission = `${specs.transmission.type} ${specs.transmission.gears || ''} ${gearsSuffix}`.trim();
        }
        
        // Get chassis material
        let chassisMaterial = tSafe('compare.chassisDefault', 'Aluminio y acero');
        if (specs.engine?.blockMaterial && specs.engine?.headMaterial) {
            chassisMaterial = `${specs.engine.blockMaterial} & ${specs.engine.headMaterial}`;
        }
        
        // Get aspiration
        const aspiration = specs.engine?.aspiration || 'Turbo';
        
        // Get engine type
        const engineType = specs.engine?.type || '';
        
        // Get cylinders
        const cylUnit = tSafe('compare.cylindersUnit', 'cilindros');
        const cylinders = specs.engine?.cylinders ? `${specs.engine.cylinders} ${cylUnit}` : '';
        
        // Calculate total annual cost — handle both pricing.ownershipCosts and runningCosts.es
        let oc = pricing.ownershipCosts || {};
        if (!oc.insurance && !oc.maintenance) {
            // Fallback: derive from runningCosts.es
            const rc = (carData.runningCosts || {})[currentLang] || (carData.runningCosts || {}).es || {};
            const tyreCost = rc.tyres?.front?.costPerTyre?.value ? rc.tyres.front.costPerTyre.value * 4 : 0;
            oc = {
                insurance: { value: pricing.insurance?.annual || 2000 },
                maintenance: { value: rc.servicing?.costMinor?.value || 800 },
                fuel: { value: rc.fuel?.realWorldCombined ? Math.round(rc.fuel.realWorldCombined.value * 15000 / 100 * 1.6) : 2000 },
                tyres: { value: tyreCost || 600 },
                inspection: { value: rc.servicing?.costMajor ? Math.round(rc.servicing.costMajor.value / 3) : 150 }
            };
        }
        const totalAnnual = (oc.insurance?.value || 0) + (oc.maintenance?.value || 0) + 
                          (oc.fuel?.value || 0) + (oc.tyres?.value || 0) + (oc.inspection?.value || 0);
        
        // Get pros/cons with language support — read from content[lang] with fallback to top-level
        const langContent = content[currentLang] || content.es || content;
        const pros = langContent.pros || content.pros || [];
        const cons = langContent.cons || content.cons || [];
        
        return {
            ...carIndexEntry,
            // Use localized name
            name: currentLang === 'ar' ? (basicInfo.fullModelNameAr || basicInfo.nameAr || carIndexEntry.name) : carIndexEntry.name,
            
            // Performance data
            power: `${performance.power?.value || 0} HP`,
            powerNum: performance.power?.value || 0,
            torque: `${performance.torque?.value || 0} Nm`,
            torqueNum: performance.torque?.value || 0,
            zero: `${(performance.acceleration?.zeroToHundred || performance.acceleration?.['0-100']) || 0}s`,
            zeroNum: (performance.acceleration?.zeroToHundred || performance.acceleration?.['0-100']) || 0,
            speed: `${performance.topSpeed?.value || 0} km/h`,
            speedNum: performance.topSpeed?.value || 0,
            
            // Pricing — handle both pricing.basePrice and pricing.base
            price: (pricing.basePrice || pricing.base) ? `€${(pricing.basePrice || pricing.base).value.toLocaleString('es-ES')}` : '€0',
            priceNum: (pricing.basePrice || pricing.base)?.value || 0,
            
            // Consumption
            consumption: `${fuelConsumption} ${consumptionUnit}`,
            consumptionNum: fuelConsumption,
            
            // Dimensions
            trunk: `${trunk} L`,
            trunkNum: trunk,
            
            // Emissions — handle fe.emissions.co2 and fe.petrol.co2; electric cars have 0
            co2: (fuelEconomy.emissions?.co2 || consData.co2) ? `${(fuelEconomy.emissions?.co2 || consData.co2).value} g/km` : (specs.engine?.aspiration === 'Electric' ? '0 g/km' : '250 g/km'),
            co2Num: (fuelEconomy.emissions?.co2 || consData.co2)?.value || (specs.engine?.aspiration === 'Electric' ? 0 : 250),
            
            // Ownership costs
            insurance: oc.insurance ? `€${oc.insurance.value.toLocaleString('es-ES')}` : '€1,500',
            insuranceNum: oc.insurance?.value || 1500,
            maintenance: oc.maintenance ? `€${oc.maintenance.value.toLocaleString('es-ES')}` : '€2,000',
            maintenanceNum: oc.maintenance?.value || 2000,
            annualCost: `€${totalAnnual.toLocaleString('es-ES')}`,
            annualCostNum: totalAnnual,
            
            // Reliability
            reliability: carData.rating ? `${carData.rating.reliability || 8}/10` : '8/10',
            reliabilityNum: carData.rating?.reliability || 8,
            
            // Pros/Cons (already localized above)
            pros: pros,
            cons: cons,
            buy: pros.slice(0, 3) || [],
            
            // Technical specs with language support
            drivetrain: drive,
            seats: seating.toString(),
            bestFor: carIndexEntry.category === 'deportivos' ? (typeof t === 'function' ? t('compare.bestForPerformance') : 'Rendimiento y lujo') : (typeof t === 'function' ? t('compare.bestForDaily') : 'Uso diario'),
            itv: oc.inspection ? `€${oc.inspection.value}` : '€60',
            engineType: engineType,
            cylinders: cylinders,
            aspiration: aspiration,
            weight: weight,
            chassisMaterial: chassisMaterial,
            range: range,
            suspension: suspension,
            transmission: transmission,
            
            // Fuel type for dynamic rows
            fuelType: fuelType,
            
            // Electric specific
            batteryCapacity: electric.batteryCapacity ? `${electric.batteryCapacity.value} ${electric.batteryCapacity.unit}` : null,
            batteryCapacityNum: electric.batteryCapacity?.value || null,
            electricRange: electric.electricRange ? `${electric.electricRange.value} ${electric.electricRange.unit}` : null,
            electricRangeNum: electric.electricRange?.value || null,
            chargingTime: electric.charging?.dc?.time ? `${electric.charging.dc.time.value} min (0-${electric.charging.dc.time.percentage}%)` : null,
            chargingSpeed: electric.charging?.dc?.power ? `${electric.charging.dc.power} kW` : null,
            chargingSpeedNum: electric.charging?.dc?.power || null,
            electricConsumption: fuelEconomy.energyConsumption?.combined ? `${fuelEconomy.energyConsumption.combined.value} ${fuelEconomy.energyConsumption.combined.unit}` : null,
            electricConsumptionNum: fuelEconomy.energyConsumption?.combined?.value || null,
            
            // Hybrid specific
            electricOnlyRange: electric.electricRange ? `${electric.electricRange.value} ${electric.electricRange.unit}` : null,
            electricOnlyRangeNum: electric.electricRange?.value || null,
            combinedEfficiency: fuelConsumption ? `${fuelConsumption} ${consumptionUnit}` : null,
            combinedEfficiencyNum: fuelConsumption || null,
            batteryCapacity: electric.batteryCapacity ? `${electric.batteryCapacity.value} ${electric.batteryCapacity.unit}` : null,
            batteryCapacityNum: electric.batteryCapacity?.value || null,
            chargingType: specs.engine?.mhev ? tSafe('compare.mildHybrid', 'Mild Hybrid') : (electric.batteryCapacity ? tSafe('compare.pluginHybrid', 'Plug-in Hybrid') : null),
            electricModeSpeed: specs.engine?.mhev ? '140 km/h' : null
        };
    }

    function fuelAnnualEur(car) {
        const fuelType = car.fuelType || getFuelType(car);
        if (fuelType === 'electric') {
            // Calculate electric cost: kWh/100km * (km/100) * price/kWh
            const consumption = car.electricConsumptionNum || car.consumptionNum || 15;
            return Math.round(consumption * (KM_YEAR / 100) * ELECTRICITY_PRICE);
        } else if (fuelType === 'hybrid') {
            // Calculate hybrid cost using combined efficiency
            const consumption = car.combinedEfficiencyNum || car.consumptionNum || 10;
            return Math.round(consumption * (KM_YEAR / 100) * FUEL_PRICE);
        } else {
            // Calculate fuel cost for traditional vehicles
            return Math.round(car.consumptionNum * (KM_YEAR / 100) * FUEL_PRICE);
        }
    }

    function parseEuro(str) {
        return parseInt(String(str).replace(/[^\d]/g, ""), 10) || 0;
    }

    function totalAnnualEur(car) {
        return (
            fuelAnnualEur(car) +
            parseEuro(car.insurance) +
            parseEuro(car.maintenance) +
            parseEuro(car.itv || "60")
        );
    }

    function formatEur(n) {
        return "€" + n.toLocaleString("es-ES");
    }

    function getFuelType(car) {
        if (!car) return 'gasolina';
        // If fuelType is already set, use it
        if (car.fuelType) return car.fuelType;
        // Otherwise try to determine from engine type
        const eng = (car.engineType || '').toLowerCase();
        const cat = (car.category || '').toLowerCase();
        if (cat === 'electricos' || cat === 'electric' || eng.includes('electric')) return 'electric';
        if (eng.includes('hybrid') || eng.includes('híbrido') || eng.includes('mhev') || eng.includes('phev')) return 'hybrid';
        if (eng.includes('diesel') || eng.includes('tdi')) return 'diesel';
        return 'gasolina';
    }

    function populateCategoryFilter() {
        if (!categoryFilter) return;
        const cats = new Set();
        carIndex.forEach(c => { if (c.category) cats.add(c.category); });
        const sorted = Array.from(cats).sort();
        categoryFilter.innerHTML = '<option value="">Todas</option>';
        sorted.forEach(id => {
            const opt = document.createElement('option');
            opt.value = id;
            opt.textContent = id.charAt(0).toUpperCase() + id.slice(1);
            categoryFilter.appendChild(opt);
        });
    }

    function populateBudgetFilter() {
        // No-op: budget is now a free number input
    }

    async function getCarFuelType(carIndexEntry) {
        const carData = await loadCarData(carIndexEntry);
        if (!carData) return 'gasolina';
        const fuelType = carData.specs?.engine?.fuelType || carData.powertrain?.type || 'petrol';
        return fuelType;
    }

    async function getFilteredCars() {
        const cat = categoryFilter ? categoryFilter.value : "";
        const budgetVal = budgetFilter ? budgetFilter.value : "";
        const fuel = fuelFilter ? fuelFilter.value : "";
        const sort = sortFilter ? sortFilter.value : "";
        const q = carModelSearch ? carModelSearch.value.toLowerCase().trim() : "";

        let filtered = carIndex.filter((car) => {
            if (cat && car.category !== cat) return false;
            if (budgetVal) {
                const max = parseInt(budgetVal, 10);
                if (!isNaN(max) && car.priceNum && car.priceNum > max) return false;
            }
            if (q && !car.name.toLowerCase().includes(q) && !car.brand.toLowerCase().includes(q)) return false;
            return true;
        });

        // Filter by fuel type - need to load data for this
        if (fuel) {
            const fuelFiltered = [];
            for (const car of filtered) {
                const carFuelType = await getCarFuelType(car);
                if (carFuelType === fuel) {
                    fuelFiltered.push(car);
                }
            }
            filtered = fuelFiltered;
        }

        // Sort
        if (sort === 'price_asc') {
            filtered.sort((a, b) => (a.priceNum || 0) - (b.priceNum || 0));
        } else if (sort === 'price_desc') {
            filtered.sort((a, b) => (b.priceNum || 0) - (a.priceNum || 0));
        } else if (sort === 'power_desc') {
            // Need to load data for power comparison
            const withPower = await Promise.all(filtered.map(async (car) => {
                const data = await loadCarData(car);
                return { car, power: data?.performance?.power?.value || 0 };
            }));
            withPower.sort((a, b) => b.power - a.power);
            filtered = withPower.map(item => item.car);
        } else if (sort === 'consumption_asc') {
            // Need to load data for consumption comparison
            const withConsumption = await Promise.all(filtered.map(async (car) => {
                const data = await loadCarData(car);
                const consumption = data?.fuelEconomy?.consumption?.combined?.value || 
                                   data?.electric?.batteryCapacity?.value || 10;
                return { car, consumption };
            }));
            withConsumption.sort((a, b) => a.consumption - b.consumption);
            filtered = withConsumption.map(item => item.car);
        }

        return filtered.map(car => car.name);
    }

    function fillSelect(select, names) {
        if (!select) return;
        const current = select.value;
        select.innerHTML = "";
        const currentLang = window.currentLang ? window.currentLang() : 'es';
        const isArabic = currentLang === 'ar';
        
        names.forEach((name) => {
            const opt = document.createElement("option");
            // Use Arabic name if available and language is Arabic
            const car = carIndex.find(c => c.name === name);
            const displayName = isArabic && car?.nameAr ? car.nameAr : name;
            opt.value = name;
            opt.textContent = displayName;
            select.appendChild(opt);
        });
        if (current && names.includes(current)) select.value = current;
        else if (names.length) select.selectedIndex = Math.min(select === select2 ? 1 : 0, names.length - 1);
    }

    async function refreshSelectOptions() {
        const names = await getFilteredCars();
        fillSelect(select1, names);
        fillSelect(select2, names);
        if (select1 && select2 && select1.value === select2.value && names.length > 1) {
            select2.selectedIndex = select1.selectedIndex === 0 ? 1 : 0;
        }
        if (searchHint) {
            if (!names.length) {
                searchHint.textContent = typeof t === 'function' ? t('compare.searchHintEmpty') : "No hay modelos con estos filtros — prueba otra categoría o presupuesto";
            } else {
                let msg = typeof t === 'function' ? t('compare.modelsAvailable', { count: names.length }) : names.length + " modelos disponibles";
                const bv = budgetFilter ? budgetFilter.value : "";
                if (bv) {
                    msg += " — hasta " + formatEur(parseInt(bv, 10));
                }
                const fv = fuelFilter ? fuelFilter.value : "";
                if (fv) {
                    const fuelLabels = { gasolina: "gasolina", diesel: "diésel", electric: "eléctrico", hybrid: "híbrido" };
                    msg += " — " + (fuelLabels[fv] || fv);
                }
                const cv = categoryFilter ? categoryFilter.value : "";
                if (cv) {
                    msg += " — " + cv;
                }
                searchHint.textContent = msg;
            }
        }
        updateCompare();
    }

    function populateDatalist() {
        if (!carModelsList) return;
        carModelsList.innerHTML = "";
        carIndex.forEach((car) => {
            const opt = document.createElement("option");
            opt.value = car.name;
            carModelsList.appendChild(opt);
        });
    }

    function setCell(row, col, text, isBest) {
        if (!row || !row.children[col]) return;
        row.children[col].textContent = text;
        row.children[col].classList.toggle("best", !!isBest);
    }

    const rows = document.querySelectorAll(".compare-table .table-row");
    const tableTitle = document.querySelector(".compare-table-section h2");
    const car1Image = document.getElementById("car1Image");
    const car2Image = document.getElementById("car2Image");
    const car1Name = document.getElementById("car1Name");
    const car2Name = document.getElementById("car2Name");
    const car1Link = document.getElementById("car1Link");
    const car2Link = document.getElementById("car2Link");
    const insurance1 = document.getElementById("insurance1");
    const insurance2 = document.getElementById("insurance2");
    const maintenance1 = document.getElementById("maintenance1");
    const maintenance2 = document.getElementById("maintenance2");
    const consumption1 = document.getElementById("consumption1");
    const consumption2 = document.getElementById("consumption2");
    const fuelAnnual1 = document.getElementById("fuelAnnual1");
    const fuelAnnual2 = document.getElementById("fuelAnnual2");
    const totalAnnual1 = document.getElementById("totalAnnual1");
    const totalAnnual2 = document.getElementById("totalAnnual2");
    const reliability1 = document.getElementById("reliability1");
    const reliability2 = document.getElementById("reliability2");
    const costCar1 = document.getElementById("costCar1");
    const costCar2 = document.getElementById("costCar2");
    const costHeader1 = document.getElementById("costHeader1");
    const costHeader2 = document.getElementById("costHeader2");
    const fastestCar = document.getElementById("fastestCar");
    const powerCar = document.getElementById("powerCar");
    const efficientCar = document.getElementById("efficientCar");
    const car1Pros = document.getElementById("car1Pros");
    const car1Cons = document.getElementById("car1Cons");
    const car2Pros = document.getElementById("car2Pros");
    const car2Cons = document.getElementById("car2Cons");
    const car1ProsName = document.getElementById("car1ProsName");
    const car2ProsName = document.getElementById("car2ProsName");
    const buy1Title = document.getElementById("buy1Title");
    const buy2Title = document.getElementById("buy2Title");
    const buy1List = document.getElementById("buy1List");
    const buy2List = document.getElementById("buy2List");
    const winnerTitle = document.getElementById("winnerTitle");
    const winnerText = document.getElementById("winnerText");
    const winnerLink = document.getElementById("winnerLink");
    const detailCar1 = document.getElementById("detailCar1");
    const detailCar2 = document.getElementById("detailCar2");
    const driveRow1 = document.getElementById("driveRow1");
    const driveRow2 = document.getElementById("driveRow2");
    const seatsRow1 = document.getElementById("seatsRow1");
    const seatsRow2 = document.getElementById("seatsRow2");
    const relRow1 = document.getElementById("relRow1");
    const relRow2 = document.getElementById("relRow2");
    const scorePower1 = document.getElementById("scorePower1");
    const scorePower2 = document.getElementById("scorePower2");
    const scoreAccel1 = document.getElementById("scoreAccel1");
    const scoreAccel2 = document.getElementById("scoreAccel2");
    const scoreValue1 = document.getElementById("scoreValue1");
    const scoreValue2 = document.getElementById("scoreValue2");
    const insightBestFor1 = document.getElementById("insightBestFor1");
    const insightBestFor2 = document.getElementById("insightBestFor2");
    const insightDrive1 = document.getElementById("insightDrive1");
    const insightDrive2 = document.getElementById("insightDrive2");
    const insightSeats1 = document.getElementById("insightSeats1");
    const insightSeats2 = document.getElementById("insightSeats2");
    const insightFuelSave = document.getElementById("insightFuelSave");
    const insightPriceDiff = document.getElementById("insightPriceDiff");
    const insightRunningCost = document.getElementById("insightRunningCost");
    const faqReliable = document.getElementById("faqReliable");
    const faqConsumption = document.getElementById("faqConsumption");
    const faqTravel = document.getElementById("faqTravel");
    const detailSubtitle = document.getElementById("detailSubtitle");
    const relatedGrid = document.getElementById("relatedGrid");
    const ctaImage = document.getElementById("ctaImage");
    const ctaTitle = document.getElementById("ctaTitle");
    const ctaDesc = document.getElementById("ctaDesc");
    const ctaLink = document.getElementById("ctaLink");
    const itv1 = document.getElementById("itv1");
    const itv2 = document.getElementById("itv2");
    const batteryRow1 = document.getElementById("batteryRow1");
    const batteryRow2 = document.getElementById("batteryRow2");
    const electricRangeRow1 = document.getElementById("electricRangeRow1");
    const electricRangeRow2 = document.getElementById("electricRangeRow2");
    const chargingTimeRow1 = document.getElementById("chargingTimeRow1");
    const chargingTimeRow2 = document.getElementById("chargingTimeRow2");
    const chargingSpeedRow1 = document.getElementById("chargingSpeedRow1");
    const chargingSpeedRow2 = document.getElementById("chargingSpeedRow2");
    const electricModeRow1 = document.getElementById("electricModeRow1");
    const electricModeRow2 = document.getElementById("electricModeRow2");

    function setBar(el, pct) {
        if (!el) return;
        const fill = el.querySelector(".score-fill");
        if (fill) fill.style.width = Math.min(100, Math.max(8, pct)) + "%";
    }

    async function updateCompare() {
        if (!select1 || !select2) return;
        const name1 = select1.value;
        const name2 = select2.value;
        
        const carIndex1 = carIndex.find(c => c.name === name1);
        const carIndex2 = carIndex.find(c => c.name === name2);
        
        if (!carIndex1 || !carIndex2) {
            return;
        }

        if (name1 === name2) {
            if (tableTitle) tableTitle.textContent = typeof t === 'function' ? t('compare.selectTwoCars') : "Selecciona dos coches diferentes";
            return;
        }

        // Load car data dynamically
        const carData1 = await loadCarData(carIndex1);
        const carData2 = await loadCarData(carIndex2);
        
        // Convert to compare format
        const c1 = convertCarDataToCompare(carIndex1, carData1);
        const c2 = convertCarDataToCompare(carIndex2, carData2);
        
        if (!c1 || !c2) return;

        if (tableTitle) tableTitle.textContent = c1.name + " vs " + c2.name;

        if (car1Image) car1Image.src = c1.image;
        if (car2Image) car2Image.src = c2.image;
        if (car1Link) car1Link.href = c1.htmlFile;
        if (car2Link) car2Link.href = c2.htmlFile;
        if (car1Name) car1Name.textContent = c1.name;
        if (car2Name) car2Name.textContent = c2.name;
        if (costCar1) costCar1.textContent = c1.name;
        if (costCar2) costCar2.textContent = c2.name;
        if (costHeader1) costHeader1.textContent = c1.name;
        if (costHeader2) costHeader2.textContent = c2.name;
        if (detailCar1) detailCar1.textContent = c1.name;
        if (detailCar2) detailCar2.textContent = c2.name;

        const bestZero = c1.zeroNum <= c2.zeroNum ? 1 : 2;
        const bestPower = c1.powerNum >= c2.powerNum ? 1 : 2;
        const bestCons = c1.consumptionNum <= c2.consumptionNum ? 1 : 2;
        const bestPrice = c1.priceNum <= c2.priceNum ? 1 : 2;
        const fuel1 = fuelAnnualEur(c1);
        const fuel2 = fuelAnnualEur(c2);
        const total1 = totalAnnualEur(c1);
        const total2 = totalAnnualEur(c2);
        const bestFuel = fuel1 <= fuel2 ? 1 : 2;
        const bestTotal = total1 <= total2 ? 1 : 2;

        setCell(rows[0], 1, c1.name, false);
        setCell(rows[0], 2, c2.name, false);
        setCell(rows[1], 1, c1.power, bestPower === 1);
        setCell(rows[1], 2, c2.power, bestPower === 2);
        setCell(rows[2], 1, c1.zero, bestZero === 1);
        setCell(rows[2], 2, c2.zero, bestZero === 2);
        setCell(rows[3], 1, c1.speed, false);
        setCell(rows[3], 2, c2.speed, false);
        setCell(rows[4], 1, c1.price, bestPrice === 1);
        setCell(rows[4], 2, c2.price, bestPrice === 2);
        setCell(rows[5], 1, c1.consumption, bestCons === 1);
        setCell(rows[5], 2, c2.consumption, bestCons === 2);
        if (rows[6]) {
            setCell(rows[6], 1, c1.torque, false);
            setCell(rows[6], 2, c2.torque, false);
        }
        if (rows[7]) {
            setCell(rows[7], 1, c1.trunk, false);
            setCell(rows[7], 2, c2.trunk, false);
        }
        if (rows[8]) {
            setCell(rows[8], 1, c1.co2, false);
            setCell(rows[8], 2, c2.co2, false);
        }
        if (rows[9]) {
            setCell(rows[9], 1, c1.drivetrain, false);
            setCell(rows[9], 2, c2.drivetrain, false);
        }
        if (rows[10]) {
            setCell(rows[10], 1, c1.seats, false);
            setCell(rows[10], 2, c2.seats, false);
        }
        if (rows[11]) {
            setCell(rows[11], 1, c1.reliability, false);
            setCell(rows[11], 2, c2.reliability, false);
        }

        if (driveRow1) driveRow1.textContent = c1.drivetrain;
        if (driveRow2) driveRow2.textContent = c2.drivetrain;
        if (seatsRow1) seatsRow1.textContent = c1.seats;
        if (seatsRow2) seatsRow2.textContent = c2.seats;
        if (relRow1) relRow1.textContent = c1.reliability;
        if (relRow2) relRow2.textContent = c2.reliability;

        // Show/hide electric/hybrid rows based on fuel types
        const fuelType1 = c1.fuelType || getFuelType(c1);
        const fuelType2 = c2.fuelType || getFuelType(c2);
        const hasElectric = fuelType1 === 'electric' || fuelType2 === 'electric';
        const hasHybrid = fuelType1 === 'hybrid' || fuelType2 === 'hybrid';

        // Toggle electric/hybrid rows visibility
        document.querySelectorAll('.electric-hybrid-row').forEach(row => {
            row.style.display = (hasElectric || hasHybrid) ? '' : 'none';
        });
        document.querySelectorAll('.electric-row').forEach(row => {
            row.style.display = hasElectric ? '' : 'none';
        });
        document.querySelectorAll('.hybrid-row').forEach(row => {
            row.style.display = hasHybrid ? '' : 'none';
        });

        // Populate electric/hybrid specific data
        if (batteryRow1) batteryRow1.textContent = c1.batteryCapacity || '--';
        if (batteryRow2) batteryRow2.textContent = c2.batteryCapacity || '--';
        if (electricRangeRow1) electricRangeRow1.textContent = c1.electricRange || c1.electricOnlyRange || '--';
        if (electricRangeRow2) electricRangeRow2.textContent = c2.electricRange || c2.electricOnlyRange || '--';
        if (chargingTimeRow1) chargingTimeRow1.textContent = c1.chargingTime || '--';
        if (chargingTimeRow2) chargingTimeRow2.textContent = c2.chargingTime || '--';
        if (chargingSpeedRow1) chargingSpeedRow1.textContent = c1.chargingSpeed || '--';
        if (chargingSpeedRow2) chargingSpeedRow2.textContent = c2.chargingSpeed || '--';
        if (electricModeRow1) electricModeRow1.textContent = c1.electricModeSpeed ? c1.electricModeSpeed + (typeof t === 'function' ? ' ' + t('compare.maxSpeed') : ' máx') : '--';
        if (electricModeRow2) electricModeRow2.textContent = c2.electricModeSpeed ? c2.electricModeSpeed + (typeof t === 'function' ? ' ' + t('compare.maxSpeed') : ' máx') : '--';

        if (insurance1) insurance1.textContent = c1.insurance;
        if (insurance2) insurance2.textContent = c2.insurance;
        if (itv1) itv1.textContent = c1.itv;
        if (itv2) itv2.textContent = c2.itv;
        if (maintenance1) maintenance1.textContent = c1.maintenance;
        if (maintenance2) maintenance2.textContent = c2.maintenance;
        if (consumption1) consumption1.textContent = c1.consumption;
        if (consumption2) consumption2.textContent = c2.consumption;
        if (fuelAnnual1) fuelAnnual1.textContent = formatEur(fuel1) + (typeof t === 'function' ? t('compare.fuelAnnual').replace(/.*\//, '/') : "/año");
        if (fuelAnnual2) fuelAnnual2.textContent = formatEur(fuel2) + (typeof t === 'function' ? t('compare.fuelAnnual').replace(/.*\//, '/') : "/año");
        if (totalAnnual1) {
            totalAnnual1.textContent = formatEur(total1) + (typeof t === 'function' ? t('compare.totalAnnual').replace(/.*\//, '/') : "/año");
            totalAnnual1.classList.toggle("best", bestTotal === 1);
        }
        if (totalAnnual2) {
            totalAnnual2.textContent = formatEur(total2) + (typeof t === 'function' ? t('compare.totalAnnual').replace(/.*\//, '/') : "/año");
            totalAnnual2.classList.toggle("best", bestTotal === 2);
        }
        if (reliability1) reliability1.textContent = c1.reliability;
        if (reliability2) reliability2.textContent = c2.reliability;

        // Detailed Analysis card population
        const dMap = {
            Engine: 'engineType', Cylinders: 'cylinders', Aspiration: 'aspiration',
            Torque: 'torque', Weight: 'weight', Chassis: 'chassisMaterial',
            Consumption: 'consumption', Range: 'range', Suspension: 'suspension',
            Drivetrain: 'drivetrain', Transmission: 'transmission',
            Maintenance: 'maintenance', Reliability: 'reliability'
        };
        Object.keys(dMap).forEach(idSuffix => {
            const el1 = document.getElementById('d1' + idSuffix);
            const el2 = document.getElementById('d2' + idSuffix);
            const key = dMap[idSuffix];
            if (el1 && c1[key]) el1.textContent = c1[key];
            if (el2 && c2[key]) el2.textContent = c2[key];
        });

        // Section headers
        const setTxt = (id, val) => { const el = document.getElementById(id); if (el && val != null) el.textContent = val; };
        setTxt('dimHeader1', c1.name); setTxt('dimHeader2', c2.name);
        setTxt('consHeader1', c1.name); setTxt('consHeader2', c2.name);
        setTxt('depHeader1', c1.name); setTxt('depHeader2', c2.name);
        setTxt('featCar1', c1.name); setTxt('featCar2', c2.name);
        setTxt('intTechCar1', c1.name); setTxt('intTechCar2', c2.name);

        // Dimensions — handle {value,unit}, plain numbers, and alternate keys
        const dims1 = carData1?.dimensions || {};
        const dims2 = carData2?.dimensions || {};
        const fmtDim = (d, fallbackUnit) => {
            if (d == null) return '--';
            if (typeof d === 'number') return `${d} ${fallbackUnit || ''}`.trim();
            if (typeof d === 'object' && d.value != null) return `${d.value} ${d.unit || fallbackUnit || ''}`.trim();
            return '--';
        };
        const getWeight = (dims) => {
            if (dims.curbWeight) return typeof dims.curbWeight === 'object' ? fmtDim(dims.curbWeight, 'kg') : `${dims.curbWeight} kg`;
            if (dims.weight) return `${dims.weight.curb} ${dims.weight.unit || 'kg'}`;
            return '--';
        };
        const getCargo = (dims) => {
            if (dims.cargoCapacity?.seatsUp) return fmtDim(dims.cargoCapacity.seatsUp, 'L');
            if (dims.cargo) return typeof dims.cargo === 'object' ? fmtDim(dims.cargo, 'L') : `${dims.cargo} L`;
            return '--';
        };
        setTxt('length1', fmtDim(dims1.length, 'mm')); setTxt('length2', fmtDim(dims2.length, 'mm'));
        setTxt('width1', fmtDim(dims1.width, 'mm')); setTxt('width2', fmtDim(dims2.width, 'mm'));
        setTxt('height1', fmtDim(dims1.height, 'mm')); setTxt('height2', fmtDim(dims2.height, 'mm'));
        setTxt('wheelbase1', fmtDim(dims1.wheelbase, 'mm')); setTxt('wheelbase2', fmtDim(dims2.wheelbase, 'mm'));
        setTxt('weight1', getWeight(dims1)); setTxt('weight2', getWeight(dims2));
        setTxt('trunk1', getCargo(dims1)); setTxt('trunk2', getCargo(dims2));
        setTxt('fuelTank1', fmtDim(dims1.fuelTank, 'L')); setTxt('fuelTank2', fmtDim(dims2.fuelTank, 'L'));

        // Consumption details — handle fe.consumption and fe.petrol structures
        const fe1 = carData1?.fuelEconomy || {};
        const fe2 = carData2?.fuelEconomy || {};
        const cons1 = fe1.consumption || fe1.petrol || {};
        const cons2 = fe2.consumption || fe2.petrol || {};
        const fmtCons = (c) => c ? `${c.value} ${c.unit}` : '--';
        setTxt('cityCons1', fmtCons(cons1.city)); setTxt('cityCons2', fmtCons(cons2.city));
        setTxt('highwayCons1', fmtCons(cons1.highway)); setTxt('highwayCons2', fmtCons(cons2.highway));
        setTxt('combinedCons1', fmtCons(cons1.combined)); setTxt('combinedCons2', fmtCons(cons2.combined));
        setTxt('calmCons1', fmtCons(fe1.drivingStyles?.calm || cons1.drivingStyles?.calm)); setTxt('calmCons2', fmtCons(fe2.drivingStyles?.calm || cons2.drivingStyles?.calm));
        setTxt('sportCons1', fmtCons(fe1.drivingStyles?.sport || cons1.drivingStyles?.sport)); setTxt('sportCons2', fmtCons(fe2.drivingStyles?.sport || cons2.drivingStyles?.sport));
        setTxt('rangeCity1', fmtCons(fe1.range?.city || cons1.range?.city)); setTxt('rangeCity2', fmtCons(fe2.range?.city || cons2.range?.city));
        setTxt('rangeHighway1', fmtCons(fe1.range?.highway || cons1.range?.highway)); setTxt('rangeHighway2', fmtCons(fe2.range?.highway || cons2.range?.highway));

        // Depreciation
        const dep1 = carData1?.depreciation || {};
        const dep2 = carData2?.depreciation || {};
        const fmtDep = (d, price) => {
            if (!d || !d.percentage) return '--';
            const val = Math.round(price * d.percentage / 100);
            return `€${val.toLocaleString('es-ES')} (${d.percentage}%)`;
        };
        setTxt('depYear1_1', fmtDep(dep1.year1, c1.priceNum)); setTxt('depYear1_2', fmtDep(dep2.year1, c2.priceNum));
        setTxt('depYear3_1', fmtDep(dep1.year3, c1.priceNum)); setTxt('depYear3_2', fmtDep(dep2.year3, c2.priceNum));
        setTxt('depYear5_1', fmtDep(dep1.year5, c1.priceNum)); setTxt('depYear5_2', fmtDep(dep2.year5, c2.priceNum));

        // Features
        const feat1 = carData1?.features || {};
        const feat2 = carData2?.features || {};
        const lang = window.currentLang ? window.currentLang() : 'es';
        const featList = (items) => {
            if (!items || !items.length) return '<li style="color:var(--text-muted)">—</li>';
            return items.map(f => {
                if (typeof f === 'string') return `<li>${f}</li>`;
                // If the item itself is {es,en,fr,ar} directly (no name/id keys)
                if (f[lang] && typeof f[lang] === 'string' && !f.name && !f.id) {
                    return `<li>${f[lang]}</li>`;
                }
                let name = f.name || f.id || '';
                if (typeof name === 'object') name = name[lang] || name.es || name.en || f.id || '';
                if (!name && f[lang]) name = f[lang]; // fallback for direct {es,en,fr,ar} objects
                return `<li>${name}</li>`;
            }).join('');
        };
        const setList = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
        setList('featExt1', featList(feat1.exterior)); setList('featExt2', featList(feat2.exterior));
        setList('featInt1', featList(feat1.interior)); setList('featInt2', featList(feat2.interior));
        setList('featTech1', featList(feat1.technology)); setList('featTech2', featList(feat2.technology));
        // Safety: prefer localized driverAssist from safety[lang], fallback to features.safety array
        const safe1 = carData1?.safety?.[lang]?.driverAssist || feat1.safety || [];
        const safe2 = carData2?.safety?.[lang]?.driverAssist || feat2.safety || [];
        setList('featSafe1', featList(safe1));
        setList('featSafe2', featList(safe2));

        // Interior tech cards
        const renderIntCards = (carData, carId) => {
            let cards = carData?.interiorCards || [];
            // Structure 2: interiorCards is {es:[...], en:[...], ...} — pick the lang array
            if (!Array.isArray(cards) && cards[lang]) {
                cards = cards[lang];
            } else if (!Array.isArray(cards) && cards.es) {
                cards = cards.es;
            }
            if (!cards.length) return '<p style="color:var(--text-muted);font-size:13px">' + (typeof t === 'function' ? t('compare.noData') : 'Sin datos') + '</p>';
            // interiorText[lang] can be: (1) object keyed by card.id with {title,desc}, or (2) array of strings
            const texts = carData?.interiorText?.[lang] || carData?.interiorText?.['es'] || {};
            return cards.map(card => {
                // Try interiorText lookup first (Audi RS7 style)
                const txt = texts[card.id] || {};
                let title = txt.title || '';
                let desc = txt.desc || '';
                // Fallback: read from card.title/description directly (Mercedes/Nissan/Porsche style)
                if (!title && card.title) {
                    title = typeof card.title === 'object' ? (card.title[lang] || card.title.es || card.title.en || '') : card.title;
                }
                if (!desc && card.description) {
                    desc = typeof card.description === 'object' ? (card.description[lang] || card.description.es || card.description.en || '') : card.description;
                }
                if (!title) title = card.id || '';
                return `<div class="int-card">
                    <h4>${title}</h4>
                    <p>${desc}</p>
                </div>`;
            }).join('');
        };
        setList('intTechCards1', renderIntCards(carData1, carIndex1.id));
        setList('intTechCards2', renderIntCards(carData2, carIndex2.id));

        if (fastestCar) fastestCar.textContent = bestZero === 1 ? c1.name : c2.name;
        if (powerCar) powerCar.textContent = bestPower === 1 ? c1.name : c2.name;
        if (efficientCar) efficientCar.textContent = bestCons === 1 ? c1.name : c2.name;

        if (car1ProsName) car1ProsName.textContent = c1.name;
        if (car2ProsName) car2ProsName.textContent = c2.name;
        if (car1Pros) car1Pros.innerHTML = c1.pros.map((x) => "<li>✓ " + x + "</li>").join("");
        if (car2Pros) car2Pros.innerHTML = c2.pros.map((x) => "<li>✓ " + x + "</li>").join("");
        if (car1Cons) car1Cons.innerHTML = c1.cons.map((x) => "<li>✗ " + x + "</li>").join("");
        if (car2Cons) car2Cons.innerHTML = c2.cons.map((x) => "<li>✗ " + x + "</li>").join("");

        if (buy1Title) buy1Title.textContent = typeof t === 'function' ? t('compare.buyIfWithCar', { car: c1.name }) : "Compra " + c1.name + " si…";
        if (buy2Title) buy2Title.textContent = typeof t === 'function' ? t('compare.buyIfWithCar', { car: c2.name }) : "Compra " + c2.name + " si…";
        if (buy1List) buy1List.innerHTML = c1.buy.map((x) => "<li>→ " + x + "</li>").join("");
        if (buy2List) buy2List.innerHTML = c2.buy.map((x) => "<li>→ " + x + "</li>").join("");

        const winner = bestPower === 1 ? c1.name : c2.name;
        const winnerData = bestPower === 1 ? c1 : c2;
        if (winnerTitle) winnerTitle.textContent = winner + " " + (typeof t === 'function' ? t('compare.winnerSuffix') : "— más potente");
        if (winnerText) {
            const _winnerDesc = typeof t === 'function' ? t('compare.winnerDesc', { power: winnerData.power, totalCost: formatEur(bestTotal === 1 ? total1 : total2) }) : null;
            winnerText.textContent = _winnerDesc || (winner + " entrega " + winnerData.power + " y coste total estimado " + formatEur(bestTotal === 1 ? total1 : total2) + "/año (combustible + seguro + mantenimiento).");
        }
        if (winnerLink) winnerLink.href = winnerData.htmlFile;

        // Dynamic subtitle
        if (detailSubtitle) detailSubtitle.textContent = typeof t === 'function' ? t('compare.detailSubtitle', { car1: c1.name, car2: c2.name }) : "Comparación detallada entre " + c1.name + " y " + c2.name + ".";

        // Dynamic CTA section (shows the winner car)
        if (ctaImage) { ctaImage.src = winnerData.image; ctaImage.alt = winner; }
        if (ctaTitle) ctaTitle.textContent = typeof t === 'function' ? t('compare.discoverCar', { car: winner }) : "Descubre el " + winner + " completo";
        if (ctaDesc) ctaDesc.textContent = typeof t === 'function' ? t('compare.fullAnalysisDesc', { car: winner }) : "Mira el análisis completo del " + winner + ": precio, consumo real, interior, motor, mantenimiento y experiencia de conducción.";
        if (ctaLink) { ctaLink.href = winnerData.htmlFile; ctaLink.textContent = typeof t === 'function' ? t('compare.ctaBtn') : "Ver página completa →"; }

        const maxP = Math.max(c1.powerNum, c2.powerNum) || 1;
        const minZ = Math.min(c1.zeroNum, c2.zeroNum) || 1;
        setBar(scorePower1, (c1.powerNum / maxP) * 100);
        setBar(scorePower2, (c2.powerNum / maxP) * 100);
        setBar(scoreAccel1, (minZ / c1.zeroNum) * 100);
        setBar(scoreAccel2, (minZ / c2.zeroNum) * 100);
        const maxPrice = Math.max(c1.priceNum, c2.priceNum) || 1;
        setBar(scoreValue1, ((maxPrice - c1.priceNum) / maxPrice) * 100 + 15);
        setBar(scoreValue2, ((maxPrice - c2.priceNum) / maxPrice) * 100 + 15);

        [[scorePower1, c1], [scorePower2, c2], [scoreAccel1, c1], [scoreAccel2, c2], [scoreValue1, c1], [scoreValue2, c2]].forEach(([el, car]) => {
            const label = el && el.querySelector(".score-label");
            if (label && car) label.textContent = car.brand;
        });

        if (insightBestFor1) insightBestFor1.textContent = c1.name + ": " + c1.bestFor;
        if (insightBestFor2) insightBestFor2.textContent = c2.name + ": " + c2.bestFor;
        if (insightDrive1) insightDrive1.textContent = c1.drivetrain;
        if (insightDrive2) insightDrive2.textContent = c2.drivetrain;
        if (insightSeats1) insightSeats1.textContent = c1.seats;
        if (insightSeats2) insightSeats2.textContent = c2.seats;
        if (insightFuelSave) {
            const diff = Math.abs(fuel1 - fuel2);
            const cheaper = bestFuel === 1 ? c1.name : c2.name;
            insightFuelSave.textContent = typeof t === 'function' ? t('compare.fuelSavingsText', { car: cheaper, amount: formatEur(diff) }) : cheaper + " ahorra ~" + formatEur(diff) + "/año en combustible (15.000 km).";
        }
        if (insightPriceDiff) {
            const diff = Math.abs(c1.priceNum - c2.priceNum);
            const pricier = c1.priceNum >= c2.priceNum ? c1.name : c2.name;
            insightPriceDiff.textContent = typeof t === 'function' ? t('compare.priceDiffText', { car: pricier, amount: formatEur(diff) }) : pricier + " cuesta " + formatEur(diff) + " más de precio de compra.";
        }
        if (insightRunningCost) {
            const amt1 = formatEur(parseEuro(c1.insurance) + parseEuro(c1.maintenance));
            const amt2 = formatEur(parseEuro(c2.insurance) + parseEuro(c2.maintenance));
            insightRunningCost.textContent = typeof t === 'function' ? t('compare.runningCostText', { car1: c1.name, amount1: amt1, car2: c2.name, amount2: amt2 }) : c1.name + ": " + amt1 + "/año — " + c2.name + ": " + amt2 + "/año (sin combustible).";
        }

        // Update FAQ section dynamically
        if (faqReliable) {
            const moreReliable = c1.reliability >= c2.reliability ? c1.name : c2.name;
            faqReliable.textContent = typeof t === 'function' ? t('compare.faqReliableText', { car: moreReliable }) : moreReliable + " suele tener mejor fiabilidad mecánica a largo plazo.";
        }
        if (faqConsumption) {
            const lessCons = bestCons === 1 ? c1.name : c2.name;
            const moreCons = bestCons === 1 ? c2.name : c1.name;
            faqConsumption.textContent = typeof t === 'function' ? t('compare.faqConsumptionText', { car: lessCons, car2: moreCons }) : lessCons + " consume menos combustible que el " + moreCons + ".";
        }
        if (faqTravel) {
            const betterForTravel = c1.seats >= c2.seats ? c1.name : c2.name;
            faqTravel.textContent = typeof t === 'function' ? t('compare.faqTravelText', { car: betterForTravel }) : betterForTravel + " es más cómodo para trayectos largos.";
        }

        // Populate related cars grid (3 random, excluding current)
        if (relatedGrid) {
            const allNames = carIndex.filter(c => c.name !== name1 && c.name !== name2).map(c => c.name);
            const shuffled = allNames.sort(() => 0.5 - Math.random());
            const picks = shuffled.slice(0, 3);
            relatedGrid.innerHTML = picks.map(name => {
                const car = carIndex.find(c => c.name === name);
                return '<a href="' + car.htmlFile + '" class="related-card">' +
                    '<img src="' + car.image + '" alt="' + name + '">' +
                    '<h3>' + name + '</h3>' +
                '</a>';
            }).join('');
        }
    }

    async function loadPreset(car1, car2, scroll) {
        const carIndex1 = carIndex.find(c => c.name === car1);
        const carIndex2 = carIndex.find(c => c.name === car2);
        if (!carIndex1 || !carIndex2) return;
        if (categoryFilter) categoryFilter.value = "";
        if (budgetFilter) budgetFilter.value = "";
        if (carModelSearch) carModelSearch.value = "";
        await refreshSelectOptions();
        select1.value = car1;
        select2.value = car2;
        await updateCompare();
        if (scroll !== false) {
            const target = document.getElementById("compareAnchor");
            if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    async function applySearchToSelect1() {
        if (!carModelSearch || !select1) return;
        const q = carModelSearch.value.trim();
        if (!q) return;
        const match = carIndex.find((c) => c.name.toLowerCase() === q.toLowerCase());
        if (match) {
            select1.value = match.name;
            await updateCompare();
        }
    }

    // Listen for language changes and re-render
    document.addEventListener("i18n:ready", () => {
        // Re-run comparison with new language
        if (select1 && select2 && select1.value && select2.value) {
            updateCompare();
        }
        // Refresh select options with localized names
        refreshSelectOptions();
    });

    populateDatalist();
    populateCategoryFilter();

    (async () => {
        await refreshSelectOptions();

        if (select1) select1.value = "Audi RS7";
        if (select2) select2.value = "BMW M5 PHEV Competition";

        const params = new URLSearchParams(window.location.search);
        if (params.get("car1") && params.get("car2")) {
            loadPreset(params.get("car1"), params.get("car2"), false);
        } else {
            updateCompare();
        }
    })();

    selects.forEach((sel) => sel.addEventListener("change", () => updateCompare()));

    [categoryFilter, fuelFilter, sortFilter].forEach((el) => {
        if (el) el.addEventListener("change", () => refreshSelectOptions());
    });
    if (budgetFilter) {
        budgetFilter.addEventListener("input", () => refreshSelectOptions());
    }

    const BUDGET_STEP = 5000;
    const budgetMinus = document.getElementById("budgetMinus");
    const budgetPlus = document.getElementById("budgetPlus");

    function adjustBudget(delta) {
        if (!budgetFilter) return;
        let val = parseInt(budgetFilter.value, 10);
        if (isNaN(val)) val = 0;
        val = Math.max(0, val + delta);
        budgetFilter.value = val > 0 ? val.toString() : "";
        refreshSelectOptions();
    }

    if (budgetMinus) {
        budgetMinus.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            adjustBudget(-BUDGET_STEP);
        });
    }
    if (budgetPlus) {
        budgetPlus.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            adjustBudget(BUDGET_STEP);
        });
    }

    if (carModelSearch) {
        carModelSearch.addEventListener("input", () => {
            refreshSelectOptions();
            const names = getFilteredCars();
            if (names.length === 1 && select1) {
                select1.value = names[0];
                updateCompare();
            }
        });
        carModelSearch.addEventListener("change", applySearchToSelect1);
    }

    if (swapBtn) {
        swapBtn.addEventListener("click", () => {
            const t = select1.value;
            select1.value = select2.value;
            select2.value = t;
            updateCompare();
        });
    }

    if (runCompareBtn) {
        runCompareBtn.addEventListener("click", () => {
            updateCompare();
            const target = document.getElementById("compareAnchor");
            if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    const floatCompareBtn = document.getElementById("floatCompareBtn");
    if (floatCompareBtn) {
        // Show/hide based on scroll
        window.addEventListener("scroll", () => {
            if (window.pageYOffset > 600) {
                floatCompareBtn.classList.add("visible");
            } else {
                floatCompareBtn.classList.remove("visible");
            }
        }, { passive: true });
        // Scroll to top on click
        floatCompareBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    document.querySelectorAll("[data-preset]").forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const parts = link.getAttribute("data-preset").split("|");
            if (parts.length === 2) loadPreset(parts[0], parts[1]);
        });
    });

    if (popularGrid) {
        presets.forEach((preset) => {
            const card = document.createElement("button");
            card.type = "button";
            card.className = "popular-compare-card";
            card.innerHTML =
                '<span class="popular-tag">' +
                preset.label +
                "</span><strong>" +
                preset.car1 +
                '</strong><span class="popular-vs">VS</span><strong>' +
                preset.car2 +
                "</strong>";
            card.addEventListener("click", () => loadPreset(preset.car1, preset.car2));
            popularGrid.appendChild(card);
        });
    }

    const filtersToggle = document.getElementById("filtersToggle");
    const collapsibleFilters = document.getElementById("collapsibleFilters");
    if (filtersToggle && collapsibleFilters) {
        filtersToggle.addEventListener("click", () => {
            const isOpen = collapsibleFilters.classList.toggle("open");
            filtersToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
    }
})();
