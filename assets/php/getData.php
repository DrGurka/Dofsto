<?php

    $queryString;
    if(isset($_GET["items"])) {
        $queryString = "select Items.ID, Items.name, level, iconID, Types.name as 'typeName' from Items left join Types on Items.typeID = Types.ID";
    } else if(isset($_GET["crafting"])) {
        $queryString = "select * from Craftables";
    } else if(isset($_GET["nuggets"])) {
        $queryString = "select * from Nuggets";
    } else if(isset($_GET["nuggetPrice"])) {
        $queryString = "select price from Prices where itemID = 14635";
    } else if(isset($_GET["consumables"])) {
        $queryString = "select * from Consumables inner join EffectInstances on Consumables.ID = EffectInstances.itemID where effectID = 110";
    } else if(!empty($_GET["itemID"])) {
        if(isset($_GET["minimal"])) {
            $queryString = "select Items.ID, Items.name, level, iconID, price, craftPrice, Types.name as 'typeName' from Items left join RecentPrices on Items.ID = RecentPrices.itemID inner join Types on Items.typeID = Types.ID where Items.ID = " . $_GET["itemID"];
        } else {
            $queryString = "select Items.name, level, iconID, nuggets, nuggetsLength, price, craftPrice, Types.name as 'typeName', categoryID from Items left join RecentPrices on Items.ID = RecentPrices.itemID inner join Types on Items.typeID = Types.ID where Items.ID = " . $_GET["itemID"];
        }
        
    } else if(!empty($_GET["recipeID"])) {
        $queryString = "select name, items from Recipes inner join Jobs on Recipes.jobID = Jobs.ID where resultID = " . $_GET["recipeID"];
    } else if(!empty($_GET["priceID"])) {
        $queryString = "select price as 'y', date as 't' from Prices where itemID = " . $_GET["priceID"];
    } else if(!empty($_GET["craftPriceID"])) {
        $queryString = "select craftPrice as 'y', date as 't' from Prices where itemID = " . $_GET["craftPriceID"];
    } else if(isset($_GET["crushList"])) {
        $queryString = "select * from CrushList";
    } else if(!empty($_GET["effects"])) {
        $queryString = "select diceNum, diceSide, bonusType, category, name, effectID, powerRate, asset from EffectInstances inner join Effects on EffectInstances.effectID = Effects.ID inner join Characteristics on Effects.characteristicID = Characteristics.ID where itemID = " . $_GET["effects"];
    } else if(isset($_GET["runePrices"])) {
        $queryString = "select * from SmithmagicRunes";
    }

    $connection = new mysqli('localhost', 'dofsto', '!b$YKh3CWLsC9ToBc!bTdl4Bt', 'DofusData');
    if($connecton->connect_error) {
        die('Connection failed: ' . $connection->connect_error);
    }


    $result = $connection->query($queryString);
    $output = $result->fetch_all(MYSQLI_ASSOC);
    $json = json_encode($output);
    echo $json;

    $connection->close();
?>