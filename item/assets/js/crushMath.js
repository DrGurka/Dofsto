let runeDictionary = [];
let totalSink = 0;
let levelModifier = 0;
let noFocusPrice = 0;

async function crushInit(effectData, itemLevel) {
    let jsonData = await fetchJSON("/assets/php/getData.php?runePrices");

    for(let i = 0; i < jsonData.length; i++) {
        let runePrice = jsonData[i];

        let price = runePrice.price / runePrice.diceNum;
        if(runePrice.effectID == 795) {
            price = Number(runePrice.price);
        }

        if(runeDictionary[runePrice.effectID]) {
            if(runeDictionary[runePrice.effectID].price < price) {
                runeDictionary[runePrice.effectID].price = price;
                runeDictionary[runePrice.effectID].runeID = runePrice.runeID;
            }
        } else {
            runeDictionary[runePrice.effectID] = {};
            runeDictionary[runePrice.effectID].price = price;
            runeDictionary[runePrice.effectID].runeID = runePrice.runeID;
        }
    }

    for(let i = 0; i < effectData.length; i++) {
        let effect = effectData[i];

        let averageStat = getAverage(effect);
        totalSink += averageStat * effect.powerRate;
    }

    levelModifier = (Math.log2(Math.E, 2) * Number(itemLevel) + 10) / 100;
}

function getFocusResult(effect) {
    let average = getAverage(effect);
    let sink = average * effect.powerRate;

    let focusSink = totalSink - sink;
    focusSink /= 2;
    focusSink /= effect.powerRate;

    noFocusPrice += average * levelModifier * runeDictionary[effect.effectID].price;

    return (focusSink + average) * levelModifier;
}

function getNoFocus() {
    return commaSeparateNumber(Math.round(noFocusPrice)) + " K";
}

function getAverage(effect) {

    if(effect.bonusType < 1 || effect.category == 2) {
        return 0;
    }

    if(effect.effectID == 795) {
        return 1;
    }

    if(effect.diceNum * effect.diceSide == 0) {
        return Number(effect.diceNum);
    } else {
        return (Number(effect.diceNum) + Number(effect.diceSide)) / 2;
    }
}