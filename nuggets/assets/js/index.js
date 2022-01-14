main();
var nuggetPrice;

async function main() {
    let nuggetObject = await fetchJSON("/assets/php/getData.php?nuggetPrice");
    nuggetPrice = nuggetObject[0].price;

    let result = await fetchJSON("/assets/php/getData.php?nuggets");
    if(result != null) {
        let table = $('#mainTable').DataTable({
            autoWidth: true,
            lengthMenu: [[24, 48, 96], ["24 items", "48 items", "96 items"]],
            data: result,
            pagingType: "full_numbers",
            order: [[3, 'desc']],
            stateSave: true,
            deferRender: true,
            processing: true,
            columns: [
                { data: 'iconID' },
                { data: 'name' },
                { data: 'nuggets' },
                {
                    data: null, 
                    render: function(data, type, row) {
                        let difference = row.price - row.craftPrice;
                        if(row.craftPrice != 0) {
                            difference = row.nuggets * nuggetPrice - Math.min(row.price, row.craftPrice);
                        } else {
                            difference = row.nuggets * nuggetPrice - row.price;
                        }
                        difference = Math.floor(difference);

                        if(type === 'display')
                        {
                            let label;
                            if(difference > 0) {
                                label = 'positive';
                            } else if(difference < 0) {
                                label = 'negative';
                            } else {
                                label = "neutral";
                            }
                            return "<label class='label label-"+label+"'>"+commaSeparateNumber(difference)+"</label>";
                        } else {
                            return difference;
                        }
                    }
                },
                { 
                    data: null,
                    render: function(data, type, row) {
                        let percentage = 0;
                        if(row.craftPrice != 0) {
                            percentage = row.nuggets * nuggetPrice / Math.min(row.price, row.craftPrice);
                        } else {
                            percentage = row.nuggets * nuggetPrice / row.price;
                        }

                        if(type === 'display')
                        {
                            return Math.floor(percentage * 100) + "%";
                        } else {
                            return percentage;
                        }
                    }
                },
            ],
            rowId: 'ID',
            columnDefs: [ {
                    targets: 0,
                    orderable: false,
                    render: function(data, type, row, meta) {
                        if(type === 'display') {
                            return '<img class="lazy" data-src="/images/items/' + data + '.png" width=40 height=40/>'
                        }
        
                        return data;
                    }
                }],
            drawCallback: function() {
                $("img.lazy").Lazy();
            },
            language: {
                lengthMenu: "_MENU_",
                search: "",
                searchPlaceholder: "Search...",
                paginate: {
                    first: "<<",
                    last: ">>",
                    next: ">",
                    previous: "<"
                }
            }
        });

        $('#mainTable').on('click', 'tbody td', function() {
            window.location.href = "/item/?ID=" + table.row(this).data().ID;
        })
    }
}
