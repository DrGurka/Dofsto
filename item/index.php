<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Dofsto</title>
        <link type="text/css" rel="stylesheet" href="/assets/css/default.css">
        <link type="text/css" rel="stylesheet" href="assets/css/default.css">
    </head>
    <body>
        <?php 
            $path = $_SERVER['DOCUMENT_ROOT'];
            $path .= "/assets/php/common.html";
            include($path); 
        ?>
        <div class="content">
            <div id="panel-container" class="container">
                <div class="titleContainer">
                    <h1 id="itemName">
                        <span class="ak-icon-big havenbag"></span>
                    </h1>
                </div>
                <div class="ak-container ak-panel">
                    <div class="ak-panel-content">
                        <div class="row">
                            <div class="col-sm-3">
                                <div id="imageBox" class="ak-encyclo-detail-illu">

                                </div>
                            </div>
                            <div class="col-sm-9">
                                <div class="ak-encyclo-detail-right ak-nocontentpadding">
                                    <div class="ak-encyclo-block-info ">
                                        <div class="row">
                                            <div class="ak-encyclo-detail-type col-xs-6">
                                                <strong>Type</strong>
                                                :
                                                <span id="itemType" class="itemType"></span>
                                            </div>
                                            <div class="ak-encyclo-detail-level col-xs-6 text-right" id="itemLevel">
                                                Level: 
                                            </div>
                                        </div>
                                    </div>
                                    <div id="top-content-flex" class="ak-container ak-content-list ak-displaymode-image-col">
                                        <div class="ak-column">
                                            <div class="ak-list-element">
                                                <div class="ak-main">
                                                    <div class="ak-main-content">
                                                        <div class="ak-content">
                                                            <div class="ak-big-text">
                                                                <span class="ak-linker">
                                                                    Market price 
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div id="currentPrice" class="ak-big-text-aside"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="clearfix visible-xs"></div>
                                        <div class="ak-column">
                                            <div class="ak-list-element">
                                                <div class="ak-main">
                                                    <div class="ak-main-content">
                                                        <div class="ak-image">
                                                            <a href="/item.html?id=14635">
                                                                <span class="ak-linker">
                                                                    <img src="/images/items/50718.png" width=48 height=48 >
                                                                </span>
                                                            </a>
                                                        </div>
                                                        <div class="ak-content">
                                                            <div class="ak-title">
                                                                <a href="/item.html?id=14635">
                                                                    <span class="ak-linker">
                                                                        Nugget
                                                                    </span>
                                                                </a>
                                                            </div>
                                                            <div id="nuggetAmount" class="ak-text"></div>
                                                        </div>
                                                        <div id="nugSale" class="ak-big-text-aside"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="clearfix visible-xs"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="effectPanel"></div>
                <div id="recipePanel"></div>
                <div id="chart-panel" class="ak-panel">
                    <div class="ak-panel-title">
                        <span class="ak-panel-title-icon"></span>
                        Chart
                    </div>
                    <div class="ak-panel-content">
                        <div class="itemBorder">
                            <canvas id="priceChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <section>
            <script src="/node_modules/chart.js/dist/Chart.bundle.js"></script>
            <script src="/node_modules/jquery/dist/jquery.min.js"></script>
            <script src="/node_modules/datatables.net/js/jquery.dataTables.js"></script>
            <script src="/assets/js/common.js"></script>
            <script src="assets/js/crushMath.js"></script>
            <script src="assets/js/index.js"></script>
        </section>
    </body>
</html>