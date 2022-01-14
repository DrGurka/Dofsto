const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

main();
var itemID;

async function main() {
    if(urlParams.has('ID')) {
        itemID = Number(urlParams.get('ID'));
        let json = await fetchJSON("/assets/php/getData.php?itemID=" + itemID);
        let result = json[0];

        if(result != null) {
            document.getElementById('itemName').innerHTML += result.name;

            let image = document.createElement('img');
            image.src = "/images/items/" + result.iconID + ".png";
            image.width = 200;
            image.height = 200;
            image.className = "itemImage itemBorder";
            document.getElementById('imageBox').appendChild(image);

            document.getElementById('itemType').innerHTML = result.typeName;
            document.getElementById('itemLevel').innerHTML = "Level: " + result.level;

            document.getElementById('nuggetAmount').innerHTML = result.nuggets + "x";
            document.getElementById('currentPrice').innerHTML = commaSeparateNumber(Number(result.price)) + " K";

            setupEffects(result.level);

            if(result.nuggets != 0)
                setupNuggets(Number(result.nuggets));

            setupPriceChart();
            await setupRecipe(result.level, result.craftPrice);

            if(result.categoryID == 2 && result.nuggets != 0)
                setupPetExperience(Number(result.nuggets), Number(result.nuggetsLength));
        }
    }
}

function setupPetExperience(nuggets, nuggetsLength) {
    let topContent = document.getElementById("top-content-flex");
    topContent.appendChild(createTopPanel("Pet experience", commaSeparateNumber(Math.round(nuggets / nuggetsLength * 5 * 1000) / 1000)));

    let clearFix = document.createElement('div');
    clearFix.className = "clearfix visible-xs";
    topContent.appendChild(clearFix);
}

async function setupPriceChart() {
    let ctx = document.getElementById('priceChart').getContext('2d');
    let result = await fetchJSON("/assets/php/getData.php?priceID="+itemID);

    if(result != null) {
        priceChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: "Market price",
                    data: result,
                    backgroundColor: "rgba(151, 168, 0, 0.35)",
                    tension: 0,
                    pointRadius: 4,
                    pointBackgroundColor: "rgba(151, 168, 0, 0.8)",
                }]
            },
            options: {
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            parser: "YYYY-MM-DD",
                            displayFormats: {
                                month: 'MMM YYYY'
                            }
                        },
                        ticks: {
                            source: "data"
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            callback: function(value, index, values) {
                                if(Number.isInteger(value)) {
                                    return commaSeparateNumber(value);
                                }
                            }
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItems, data) {
                            return commaSeparateNumber(tooltipItems.yLabel);
                        }
                    }
                }
            },
        });

        setupCraftChart(priceChart, itemID);
    }
}

async function setupNuggets(nuggets) {
    let json = await fetchJSON("/assets/php/getData.php?nuggetPrice");
    let result = json[0];

    if(result != null) {
        document.getElementById('nugSale').innerHTML = commaSeparateNumber(Math.floor(nuggets * Number(result.price))) + " K";
    }
}

async function setupEffects(itemLevel) {
    let jsonData = await fetchJSON("/assets/php/getData.php?effects="+itemID);
    await crushInit(jsonData, itemLevel);

    if(jsonData.length != 0) {
        let effectPanel = createPanel('Effects', null, null, document.getElementById("effectPanel"));

        let row = document.createElement('div');
        row.className = 'row';
        effectPanel.appendChild(row);

        let effectTable = document.createElement('div');
        effectTable.className = 'mainTable';
        effectTable.style = 'padding-left: 6px; padding-right: 6px;'
        row.appendChild(effectTable);

        let table = document.createElement('table');
        table.className = 'display';
        table.id = 'effectTable';
        table.style = 'width: 100%;';
        effectTable.appendChild(table);

        let thead = document.createElement('thead');
        table.appendChild(thead);

        let tr = document.createElement('tr');
        thead.appendChild(tr);

        let imageColumn = document.createElement('th');
        imageColumn.className = 'img-first-column';
        tr.appendChild(imageColumn);

        let nameColumn = document.createElement('th');
        nameColumn.innerHTML = 'Effect';
        tr.appendChild(nameColumn);

        let focusColumn = document.createElement('th');
        focusColumn.innerHTML = 'Focus';
        tr.appendChild(focusColumn);

        let priceColumn = document.createElement('th');
        priceColumn.innerHTML = 'Price';
        tr.appendChild(priceColumn);

        let secondRow = document.createElement('div');
        secondRow.style = "margin-top: 12px";
        secondRow.className = 'row ak-container ak-content-list ak-displaymode-image-col';
        effectPanel.appendChild(secondRow);

        let effectArray = [];

        for(let i = 0; i < jsonData.length; i++) {
            let effect = jsonData[i];

            if(effect.bonusType > 0 && effect.category != 2) {
                
                let focusResult = getFocusResult(effect);
                let price = Math.round(focusResult * runeDictionary[effect.effectID].price);
                if(focusResult > 0) {
                    let effectString = "";
                    if(effect.diceSide * effect.diceNum == 0) {
                        effectString = (effect.diceNum * effect.bonusType) + " " + effect.name;
                    } else {
                        effectString = (effect.diceNum * effect.bonusType) + " to " + (effect.diceSide * effect.bonusType) + " " + effect.name;
                    }

                    let obj = {};
                    obj['iconName'] = effect.asset;
                    obj['effectString'] = effectString;
                    obj['focusResult'] = Math.round(focusResult * 100) / 100;
                    obj['price'] = price;
                    obj['runeID'] = runeDictionary[effect.effectID].runeID;

                    effectArray.push(obj);
                }
            }
        }

        secondRow.appendChild(createTopPanel("NO FOCUS", getNoFocus()));

        let runeTable = $('#effectTable').DataTable({
            autoWidth: true,
            data: effectArray,
            order: [[3, 'desc']],
            searching: false,
            lengthChange: false,
            paging: false,
            info: false,
            columns: [
                {
                    data: 'iconName',
                    orderable: false,
                    render: function(data, type, row, meta) {
                        if(type === 'display') {
                            return '<span class="ak-icons-bg ak-icon-small ak-' + data + '"></span>';
                        }

                        return data;
                    }
                },
                { data: 'effectString', orderable: false },
                { data: 'focusResult', orderable: false },
                {
                    data: 'price',
                    render: function(data, type, row, meta) {
                        if(type === 'display') {
                            return commaSeparateNumber(data) + " K";
                        }
        
                        return data;
                    }
                }
            ]
        });

        $('#effectTable').on('click', 'tbody td', function() {
            window.location.href = "/item/?ID=" + runeTable.row(this).data().runeID;
        });
    }
}

async function setupRecipe(itemLevel, craftCost) {
    let jsonData = await fetchJSON("/assets/php/getData.php?recipeID="+itemID);
    let result = jsonData[0];

    if(result != null) {
        let recipePanel = createPanel('Recipe', result.name, itemLevel, document.getElementById("recipePanel"));
    
        let topContent = document.getElementById("top-content-flex");
        topContent.appendChild(createTopPanel("Craft cost", commaSeparateNumber(craftCost) + " K"));

        let clearFix = document.createElement('div');
        clearFix.className = "clearfix visible-xs";
        topContent.appendChild(clearFix);

        let contentList = document.createElement('div');
        contentList.className = 'ak-container ak-content-list ak-displaymode-image-col';
        recipePanel.appendChild(contentList);

        let container = document.createElement('div');
        container.className = "row ak-container";
        contentList.appendChild(container);

        let recipe = JSON.parse(result.items);
        recipe.ingredientIds.forEach(async function(id, index) {
            let itemJSON = await fetchJSON("/assets/php/getData.php?itemID="+id+"&minimal");
            let itemData = itemJSON[0];

            if(itemData != null) {
                let craft = itemData.price > itemData.craftPrice && itemData.craftPrice != 0;
                container.appendChild(createItemPanel(itemData.name, itemData.ID, itemData.typeName, itemData.level, itemData.iconID, recipe.quantities[index], craft));
            
                let clearFix = document.createElement('div');
                if((container.childNodes.length + 1) % 4 == 0) {
                    clearFix.className = "clearfix visible-xs visible-sm visible-md visible-lg";
                } else {
                    clearFix.className = "clearfix visible-xs";
                }
                
                container.appendChild(clearFix);
            }
        });
    }
}

async function setupCraftChart(priceChart, itemID) {
    let result = await fetchJSON("/assets/php/getData.php?craftPriceID="+itemID);

    if(result != null) {
        var dataset = {
            label: "Craft cost",
            backgroundColor: 'rgba(197, 111, 7, 0.35)',
            data: result,
            tension: 0,
            pointRadius: 4,
            pointBackgroundColor: 'rgba(197, 111, 7, 0.8)'
        }

        priceChart.data.datasets.push(dataset);
        priceChart.update();
    }
}

function createPanel(panelName, job, level, containerElement) {
    
    let panel = document.createElement('div');
    panel.className = "ak-panel";

    let panelTitle = document.createElement('div');
    panelTitle.className = "ak-panel-title";
    panelTitle.innerHTML = '<span class="ak-panel-title-icon"></span>' + panelName;
    panel.appendChild(panelTitle);

    let panelContent = document.createElement('div');
    panelContent.className = 'ak-panel-content';
    panel.appendChild(panelContent);

    if(job != null) {
        
        let panelIntro = document.createElement('div');
        panelIntro.className = "ak-panel-intro";
        panelIntro.innerHTML = job + " ";
        panelContent.appendChild(panelIntro);

        let levelElement = document.createElement('span');
        levelElement.innerHTML = "Level " + level;
        panelIntro.appendChild(levelElement);
    }

    containerElement.appendChild(panel);
    return panelContent;
}

function createItemPanel(name, ID, type, level, iconID, amount, craft) {

    let container = document.createElement('div');
    container.className = "ak-column ak-container col-xs-12 col-sm-6";

    let listElement = document.createElement('div');
    listElement.className = "ak-list-element";
    container.appendChild(listElement);

    let amountElement = document.createElement('div');
    amountElement.className = "ak-front";
    amountElement.innerHTML = amount + " x";
    listElement.appendChild(amountElement);

    let main = document.createElement('div');
    main.className = "ak-main";
    listElement.appendChild(main);

    let mainContent = document.createElement('div');
    mainContent.className = "ak-main-content";
    if(craft) {
        mainContent.style = "border: 1px solid #c56f07;"
    }
    main.appendChild(mainContent);

    let image = document.createElement('div');
    image.className = "ak-image";
    mainContent.appendChild(image);

    let link = document.createElement('a');
    link.href = "/item/?ID=" + ID;
    image.appendChild(link);

    let linker = document.createElement('span');
    linker.className = "ak-linker";
    link.appendChild(linker);

    let itemImage = document.createElement('img');
    itemImage.src = "/images/items/" + iconID + ".png";
    itemImage.width = 48;
    itemImage.height = 48;
    linker.appendChild(itemImage);

    let content = document.createElement('div');
    content.className = "ak-content";
    mainContent.appendChild(content);

    let title = document.createElement('div');
    title.className = "ak-title";
    content.appendChild(title);

    link = document.createElement('a');
    link.href = "/item/?ID=" + ID;
    title.appendChild(link);

    linker = document.createElement('span');
    linker.className = "ak-linker";
    link.appendChild(linker);
    linker.innerHTML = name;

    let typeElement = document.createElement('div');
    typeElement.className = "ak-text";
    typeElement.innerHTML = type;
    content.appendChild(typeElement);

    let levelElement = document.createElement('div');
    levelElement.className = "ak-aside";
    levelElement.innerHTML = "Level: " + level;

    mainContent.appendChild(levelElement);

    return container;
}

function createTopPanel(title, description) {
    let column = document.createElement('div');
    column.className = "ak-column";

    let listElement = document.createElement('div');
    listElement.className = "ak-list-element";
    column.appendChild(listElement);

    let main = document.createElement('div');
    main.className = "ak-main";
    listElement.appendChild(main);

    let mainContent = document.createElement('div');
    mainContent.className = "ak-main-content";
    main.appendChild(mainContent);

    let content = document.createElement('div');
    content.className = "ak-content";
    mainContent.appendChild(content);

    let bigText = document.createElement('div');
    bigText.className = "ak-big-text";
    content.appendChild(bigText);

    let linker = document.createElement('span');
    linker.className = "ak-linker";
    linker.innerHTML = title;
    bigText.appendChild(linker);

    let asideElement = document.createElement('div');
    asideElement.className = "ak-big-text-aside";
    asideElement.innerHTML = description;
    mainContent.appendChild(asideElement);

    return column;
}

