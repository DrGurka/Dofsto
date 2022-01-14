
main();

async function main() {
    let result = await fetchJSON("/assets/php/getData.php?consumables");
    if(result != null) {
        let table = $('#mainTable').DataTable({
            autoWidth: true,
            lengthMenu: [[24, 48, 96], ["24 items", "48 items", "96 items"]],
            data: result,
            pagingType: "full_numbers",
            order: [[4, 'asc']],
            stateSave: true,
            deferRender: true,
            processing: true,
            columns: [
                { data: 'iconID' },
                { data: 'name' },
                { data: 'jobName' },
                { 
                    data: null,
                    render: function(data, type, row) {
                        if(row.diceSide != 0) {
                            return (Number(row.diceNum) + Number(row.diceSide)) / 2;
                        }

                        return row.diceNum;
                    }
                },
                {
                    data: null,
                    render: function(data, type, row) {
                        let price = row.price;
                        if(row.craftPrice != 0)
                            price = Math.min(price, row.craftPrice);

                        if(row.diceSide != 0) {
                            return Math.round(price / ((Number(row.diceNum) + Number(row.diceSide)) / 2) * 100) / 100;
                        }

                        return Math.round(price / Number(row.diceNum) * 100) / 100;
                    }
                }
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
                },
                {
                    targets: 2,
                    className: 'item-type'
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
        });

        table.draw();
    }
}
