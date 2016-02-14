function remove_lines_table() {
    $("#linesBtnGrp").remove();
}

function generate_lines_table(data) {
    var lines_list = JSON.parse(data);

    if (lines_list) {
        remove_lines_table();
        $("#linesDiv").append('<div class="btn-group-vertical" role="group" id="linesBtnGrp"></div>');

        lines_list.forEach(function (line_obj) {
            $("#linesBtnGrp:last-child").append('<button type="button" class="btn btn-default">' + line_obj.name + '</button>');
        });
    }
}

function get_lines_and_create_table() {
    remove_lines_table();
    $.get("/api/lines", generate_lines_table);
}



function remove_kx_table() {
    $("#resultPanel div.panel-body span").text("Click on the Button to refresh");
    $("#resultPanel table tbody").children().remove();
    $("#resultPanel").hide();
}

function get_kx_and_create_table() {
    $.get("/api/kc", function (data) {
        rows = JSON.parse(data);
        if (rows.length === 0) {
            $("#resultPanel div.panel-body span").text("No trains Found");
            $("#resultPanel div.panel-body span").show();
            $("#resultPanel table").hide();
        } else {
            remove_kx_table();
            rows.forEach(function (currentValue, index, array) {
                var html_row = "<tr> <td>" + currentValue.lineName + "</td> <td>" + currentValue.timeToStation + "</td> <td>" + currentValue.platformName + "</td> </tr>";
                $("#resultPanel table tbody:last-child").append(
                    html_row
                );
            });
            $("#resultPanel div.panel-body span").hide();
            $("#resultPanel table").show();
        }

        $("#resultPanel").show();
    });
}

$(document).ready(function () {
    get_lines_and_create_table();

    $("#getLinesBtn").click(get_lines_and_create_table);
    $("#getbtn").click(get_kx_and_create_table);
    $("#resetbtn").click(remove_kx_table);
});
