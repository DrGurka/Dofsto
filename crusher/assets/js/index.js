
main();

async function main() {
    let result = await fetchJSON("/assets/php/getData.php?crushList");
    if(result != null) {
        $.fn.dataTable.ext.search.push(function(oSettings, aData, iDataIndex) {
            let minMulti = parseInt($('#minMultiplier').val(), 10);
            let maxMulti = parseInt($('#maxMultiplier').val(), 10);

            if(!isNaN(minMulti) && minMulti > aData[4]) {
                return false;
            }

            if(!isNaN(maxMulti) && maxMulti < aData[4]) {
                return false;
            }

            return true;
        });

        let table = $('#mainTable').DataTable({
            autoWidth: true,
            lengthMenu: [[24, 48, 96], ["24 items", "48 items", "96 items"]],
            data: result,
            pagingType: "full_numbers",
            order: [[4, 'desc']],
            stateSave: true,
            deferRender: true,
            processing: true,
            columns: [
                { data: 'iconID' },
                { data: 'itemName' },
                { data: 'jobName' },
                { data: 'level' },
                { data: 'minCoeff' },
                { data: 'statName' }
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
                    className: 'item-type',
                    render: function(data, type, row, meta) {
                        if(data == null) {
                            return 'Un-craftable';
                        }
                        return data;
                    }
                },
                {
                    targets: 3,
                    render: function(data, type, row, meta) {
                        if(type === 'display') {
                            return 'Lvl ' + data;
                        }
        
                        return data;
                    },
                    className: 'item-level'
                },
                {
                    targets: 4,
                    render: function(data, type, row, meta) {
                        if(type === 'display') {
                            return data + '%';
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

        $("#minMultiplier, #maxMultiplier").keyup(function(e) {
            table.draw();
        });

        $('#mainTable').on('click', 'tbody td', function() {
            window.location.href = "/item/?ID=" + table.row(this).data().ID;
        });

        table.draw();
    }
}
