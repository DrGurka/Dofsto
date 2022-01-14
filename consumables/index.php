<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Dofsto</title>
        <link type="text/css" rel="stylesheet" href="/assets/css/default.css">
    </head>
    <body>
        <?php 
            $path = $_SERVER['DOCUMENT_ROOT'];
            $path .= "/assets/php/common.html";
            include($path); 
        ?>
        <div class="content">
            <div class="container">
                <div class="titleContainer">
                    <h1>
                        <span class="ak-icon-big consumable"></span>
                        Consumables
                    </h1>
                </div>
                <div class="mainTable">
                    <table id="mainTable" class="display" style="width:100%">
                        <thead>
                            <tr>
                                <th class="img-first-column"></th>
                                <th>Name</th>
                                <th>Profession</th>
                                <th>Hit points</th>
                                <th>Kama/HP</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>
        <section>
            <script src="/node_modules/jquery/dist/jquery.js"></script>
            <script src="/node_modules/datatables.net/js/jquery.dataTables.js"></script>
            <script src="/node_modules/jquery-lazy/jquery.lazy.min.js"></script>
            <script src="/assets/js/common.js"></script>
            <script src="assets/js/index.js"></script>
        </section>
    </body>
    
</html>