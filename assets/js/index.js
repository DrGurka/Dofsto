main();

async function main() {
    let result = await fetchJSON("assets/php/getData.php?items");

    if(result != null) {
        let table = $('#mainTable').DataTable({
            autoWidth: true,
            lengthMenu: [[24, 48, 96], ["24 items", "48 items", "96 items"]],
            data: result,
            pagingType: "full_numbers",
            order: [[1, 'asc']],
            stateSave: true,
            deferRender: true,
            processing: true,
            columns: [
                { data: 'iconID' },
                { data: 'name' },
                { data: 'typeName' },
                { data: 'level' }
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
            window.location.href = "item/?ID=" + table.row(this).data().ID;
        })
    }
}
