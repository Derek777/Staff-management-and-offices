$(document).ready(function(){
    var $checkboxes = $('input[type=checkbox]');
    var selectArr = [];// масив для select
    var allWorkers=[];
    var office;



    // Отримую і встановлюю дані з сервера
    var result;
    $.get("http://dev.smartpelican.com/public/test_task/departments.php")
        .then(function(val){
            result= JSON.parse(val);
            $("#one").text(result[0].name);
            $("#two").text(result[1].name);
            $("#three").text(result[2].name);
            $("#four").text(result[3].name);
            $.each($(".officeName"), function(index, value){
                selectArr[index]=value.innerHTML});
            inSelect();
            return result;
        });


    //кнпка додає офіси
    document.querySelector('#razinput').onclick = function() {
        var $text = $("#newOfficeName");
        var val = $text.val();

        if (!val){
            alert("Enter office");
            return;
        }

        if (selectArr.indexOf(val) === -1){
            $("#offices").append('<tr class="officeNode"><td><input class="office" type="checkbox"></td><td class="officeName">'+$text.val()+'</td></tr>');
            selectArr.push($text.val());
            inSelect();
            $text.val("");
        } else{
            $text.val("");
            alert("This office already exist");
        }
    };


    //видаляю офіси
    document.querySelector('#dwainput').onclick = function() {
        var $officeTr = $('.office:checkbox:checked').parents('.officeNode');
        office =$officeTr.children(".officeName").text(function(index, text){
            return text+=" ";
        }).text();
        var mass= office.split(" ");
        $("#vstavka").html("<span class='textInPopup text-info'>"+addProbel(mass)+"</span>");
        popupControl();

        document.querySelector('#officeYes').onclick = function() {
            mass=removeProbel(mass);
            for(var i=0; i<mass.length; i++){
                $("#workers tr").each(function(j, elem){
                    if(mass[i]==$(elem).find(".workersOffice").text()){
                        this.remove();
                    }})}
            $officeTr.remove();
            officeDelete();
            inSelect();
            hide();
        };

        document.querySelector('#officeNo').onclick = function() {
            hide();
        };
    };

    //видалення рядків з офісами
    function officeDelete(){
        var masivOff = office.split(" ");
        for(var i = 0; i<selectArr.length; i++){
            for(var k =0; k<masivOff.length; k++){
                if(selectArr[i] == masivOff[k]){
                    selectArr.splice(i,1);
                    i--;
                }
            }
        }
        return selectArr;
    }

    //Оновлює select з офісами
    function inSelect(){
        $("select").empty();
        var options = '';
        for (var i in selectArr)
        {
            options += '<option>'+selectArr[i]+'</option>';
        }
        $('#select').append(options);
    }
    //додає пробіли в вікно #popup;
    function addProbel(w){
        var str="";
        w.pop();
        for(var i = 0; i< w.length; i++){
            w[i]+=", ";
            str+=w[i];
        }
        str = str.slice(0,-2);
        return str+" ?";
    }

    // видаляє зайві пробіли з масиву
    function removeProbel(w){
        var str=[];
        for(var i = 0; i< w.length; i++){
            var a = w[i].slice(0,-2);
            str[i]=a;
        }
        return str;
    }

    //Форматую дату
    function formatDate(date) {
        var dd = date.getDate();
        if (dd < 10) dd = '0' + dd;
        var mm = date.getMonth() + 1;
        if (mm < 10) mm = '0' + mm;
        var yy = date.getFullYear() % 100;
        if (yy < 10) yy = '0' + yy;
        return dd + '.' + mm + '.' + yy;
    }
    //Валідація #popup :)
    function popupControl(){
        if($(".textInPopup").text()==" ?"){
            $("#popup").hide();
        }else{
            $("#popup").show();
        }
    }
    //Показати #popup
    function hide(){
        $("#popup").hide();
    }

    //Сховати #popup
    function show(){
        $("#popup").show();
    }

    // Додаю працівника
    document.querySelector('#addWorker').onclick = function() {
        var now = new Date();
        var workerName =$("#newWorkers");
        if(workerName.val()===""){
            alert("Enter workers name");
        }else {
            allWorkers.push($('<tr class="strWorker"><td><input type="checkbox" class="workersCheck"></td><td class="workName">' + workerName.val() + '</td><td class="workersOffice">' + $("#select :selected").val() + '</td><td>' + formatDate(now) + '</td></tr>'));
            for (var i = 0; i < selectArr.length; i++) {
                for (var k = 0; k < allWorkers.length; k++) {
                    if (selectArr[i] === $("#select :selected").val()) {
                        $("#workers").append(allWorkers[k]);
                        workerName.val("");
                    }
                }
            }
        }
    };

    //Видаляю працівника
    document.querySelector('#removeWorker').onclick = function() {
        var workChecked =$('.workersCheck:checkbox:checked').parents('.strWorker');
        var wwww= workChecked.children(".workName").text(function(index, text){
            return text+=" ";
        }).text();
        var worki =wwww.split(" ");
        $("#popupText").text("Do you really want to dismiss this employee(s)?");
        $("#vstavka").html("<span class='textInPopup text-info'>"+addProbel(worki)+"</span>");
        popupControl();

        document.querySelector('#officeYes').onclick = function() {
            workChecked.remove();
            hide();
        };
        document.querySelector('#officeNo').onclick = function() {
            hide();
        };

        allWorkers=[];
        $("tr.strWorker #workers").each(function(i, elem){
            allWorkers.push(elem[i]);
        });
    };

    // По по зміні в checkbox'ах, міняю колір
    $(document).bind("change", $checkboxes, function() {
        $('input[type=checkbox]').each(function(){
            if (this.checked){
                $(this).closest("tr").addClass("danger");
            }
            else{
                $(this).closest("tr").removeClass("danger");
            }
        });
    });
});


