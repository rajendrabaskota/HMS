
var count = 2;
var deleteBtn =[1];
$(document).ready(function(){

    $(".add-another-medicine-field").on('click',add_another_medicine_field);
    
    $(".add-another-new-dealer-setup").on('click', add_another_new_dealer_setup);

    $("#recent-transactions-button").on('click', view_recent_transactions);

    $(".add-new-medicine-storeout").on('click', add_new_medicine_storeout);

    $(".add-another-medicine-setup").on('click', add_another_medicine_setup);

    $("#delete-row-1").click(function(e){
        // console.log($(this).parent().parent());
        // document.getElementById('delete-row-'+count)
        // if($(this).id.split('-').pop() == count-1) {
        //     document.getElementById
        // }
        if(deleteBtn.length>=2){
            var id = $(this).data('id');
            console.log(id);
            deleteBtn.splice(deleteBtn.indexOf(id), 1);
            $(this).parent().parent().remove();
        }
        console.log(deleteBtn);
        // if($(this).parent().parent().remove()){

        // }
    }); 

});

function add_another_medicine_setup(){
    document.getElementById('add-another-medicine-setup').remove()
    $("#medicine-details-body").append(`
    <tr>
        <td>
            <div id="medicine-name-div-${count}" class="autocomplete">
                <input type="text" name="medicine_name[]" id="medicine-name-${count}"
                    onkeyup="key_up(this)" onkeydown="key_down(this)" required="true">
            </div>
        </td>
        <td>
            <input type="text" name="common_name[]" id="common-name-${count}">
        </td>
        <td>
            <input type="number" name="foils_per_packet[]" id="foils-per-packet-${count}" class="number-input-field">
        </td>
        <td>
            <input type="number" name="capsules_per_foil[]" id="capsules-per-foil-${count}" class="number-input-field">
        </td>
        <td>
            <input type="number" name="selling_rate[]" id="selling-rate-${count}" class="number-input-field">
        </td>
        <td id="span-td-${count}">
            <span id="add-another-medicine-setup" onclick="add_another_medicine_setup()"><i class="fas fa-plus"></i></span>
            <span id="delete-row-${count}" data-id='${count}'><i class="fa fa-trash" aria-hidden="true"></i></span>
        </td>

        <script>
            $("#delete-row-${count}").click(function(e){
                if($(this).parent().parent().children().first().children().first().attr('id').split('-').pop() == (deleteBtn[deleteBtn.length - 1])) {
                    if(deleteBtn.length >= 2){
                        var id = $(this).data('id');
                        console.log(id);
                        deleteBtn.splice(deleteBtn.indexOf(id), 1);
                        $(this).parent().parent().remove();
                        create_span('medicinesetup');
                    }
                } else{
                    var id = $(this).data('id');
                    deleteBtn.splice(deleteBtn.indexOf(id), 1);
                    $(this).parent().parent().remove();
                }
                console.log(deleteBtn);
                
            });
        </script>

    </tr>
    `)
    deleteBtn.push(count);
    count++;
}

function add_another_medicine_field(){
    document.getElementById('add-another-medicine-field').remove()
    $("#medicine-details-body").append(`
    <tr>
        <td>
            <div id="medicine-name-div-${count}" class="autocomplete">
                <input type="text" name="medicine_name[]" id="medicine-name-${count}"  onkeyup="key_up(this)" onkeydown="key_down(this)" required="true">
            </div>
        </td>
        <td>
            <input type="text" name="common_name[]" id="common-name-${count}">
        </td>
        <td>
            <input type="number" name="batch_number[]" class="number-input-field" id="batch-number-${count}" required="true">
        </td>
        <td>
            <input type="number" name="packets[]" class="number-input-field" id="packets-${count}" required="true">
        </td>
        <td>
            <input type="number" name="foils_per_packet[]" id="foils-per-packet-${count}">
        </td>
        <td>
            <input type="number" name="capsules_per_foil[]" id="capsules-per-foil-${count}">
        </td>
        <td>
            <input type="number" name="selling_rate[]" class="number-input-field" id="selling-rate-${count}">
        </td>
        <td>
            <input type="date" name="expiry_date[]" id="expiry-date-${count}" required="true">
        </td>
        <td>
            <input type="number" name="in_stock[]" id="in-stock-${count}" readonly>
        </td>
        <td>
            <input type="number" name="total_price[]" class="number-input-field" id="total-price-${count}" required="true">
        </td>
        <td id="span-td-${count}">
            <span id="add-another-medicine-field" onclick="add_another_medicine_field()"><i class="fas fa-plus"></i></span>
            <span id="delete-row-${count}" data-id="${count}"><i class="fa fa-trash" aria-hidden="true"></i></span>
        </td>

        <script>
            $("#delete-row-${count}").click(function(e){
                if($(this).parent().parent().children().first().children().first().attr('id').split('-').pop() == (deleteBtn[deleteBtn.length - 1])) {
                    if(deleteBtn.length >= 2){
                        var id = $(this).data('id');
                        console.log(id);
                        deleteBtn.splice(deleteBtn.indexOf(id), 1);
                        $(this).parent().parent().remove();
                        create_span('storein');
                    }
                } else{
                    var id = $(this).data('id');
                    deleteBtn.splice(deleteBtn.indexOf(id), 1);
                    $(this).parent().parent().remove();
                }
                console.log(deleteBtn);
                
            });
        </script>
    
    </tr>
`)
    deleteBtn.push(count);
    count++; 
}

function create_span(app) {
    var info = {
        'id': {
            'storein': "add-another-medicine-field",
            'newdealersetup': "add-another-new-dealer-setup",
            'storeout': "add-new-medicine-storeout",
            'medicinesetup': "add-another-medicine-setup",
        },

        'functions': {
            'storein': "add_another_medicine_field()",
            'newdealersetup': "add_another_new_dealer_setup()",
            'storeout': "add_new_medicine_storeout()",
            'medicinesetup': "add_another_medicine_setup()",
        },   
    }
    
    $("#delete-row-"+(deleteBtn[deleteBtn.length - 1])).remove();
    $("#span-td-"+(deleteBtn[deleteBtn.length - 1])).append(`
        <span id=${info['id'][app]} onclick=${info['functions'][app]}><i class="fas fa-plus"></i></span>
        <span id="delete-row-${deleteBtn[deleteBtn.length - 1]}" data-id="${deleteBtn[deleteBtn.length - 1]}"><i class="fa fa-trash" aria-hidden="true"></i></span>

        <script>
            $("#delete-row-${deleteBtn[deleteBtn.length - 1]}").click(function(e){
                if($(this).parent().parent().children().first().children().first().attr('id').split('-').pop() == (deleteBtn[deleteBtn.length - 1])) {
                    if(deleteBtn.length >= 2){
                        var id = $(this).data('id');
                        deleteBtn.splice(deleteBtn.indexOf(id), 1);
                        $(this).parent().parent().remove();
                        create_span('${app}');
                    }
                } else{
                    var id = $(this).data('id');
                    deleteBtn.splice(deleteBtn.indexOf(id), 1);
                    $(this).parent().parent().remove();
                }
                console.log(deleteBtn);
                
            });
        </script>>

    `);
    count--;
}

function add_another_new_dealer_setup() {
    document.getElementById('add-another-new-dealer-setup').remove();
    $("#dealer-details-body").append(`
        <tr>
            <td>
                <div id="dealer-name-div-${count}" class="autocomplete">
                    <input type="text" name="dealer_name[]" id="dealer-name-${count}"
                        onkeyup="key_up(this)" onkeydown="key_down(this)">
                </div>
            </td>
            <td>
                <input type="text" name="dealer_address[]" id="dealer-address-${count}">
            </td>
            <td>
                <input type="number" name="dealer_phone[]" id="dealer-phone-${count}" class="number-input-field">
            </td>
            <td>
                <input type="email" name="dealer_email[]" id="dealer-email-${count}" placeholder="Optional">
            </td>
            <td>
                <input type="number" name="dealer_remaining_balance[]" id="dealer-remaining-balance-${count}" class="number-input-field">
            </td>
            
            <td id="span-td-${count}">
                <span id="add-another-new-dealer-setup" onclick="add_another_new_dealer_setup()"><i class="fas fa-plus"></i></span>
                <span id="delete-row-${count}" data-id='${count}'><i class="fa fa-trash" aria-hidden="true"></i></span>
            </td>

            <script>
                $("#delete-row-${count}").click(function(e){
                    if($(this).parent().parent().children().first().children().first().attr('id').split('-').pop() == (deleteBtn[deleteBtn.length - 1])) {
                        if(deleteBtn.length >= 2){
                            var id = $(this).data('id');
                            console.log(id);
                            deleteBtn.splice(deleteBtn.indexOf(id), 1);
                            $(this).parent().parent().remove();
                            create_span('newdealersetup');
                        }
                    } else{
                        var id = $(this).data('id');
                        deleteBtn.splice(deleteBtn.indexOf(id), 1);
                        $(this).parent().parent().remove();
                    }
                    console.log(deleteBtn);
                    
                });
            </script>
        </tr>
    `)
    deleteBtn.push(count);
    deleteHavingPlusBtn = count;    
    count++;
}

function add_new_medicine_storeout() {
    document.getElementById('add-new-medicine-storeout').remove();
    $("#medicine-details-body-storeout").append(`
    <tr>
        <td>
            <div id="medicine-name-div-${count}" class="autocomplete">
                <input type="text" name="medicine_name[]" id="medicine-name-${count}" onkeyup="key_up(this)" data-out="true" onkeydown="key_down(this)">
            </div>
        </td>
        <td>
            <input type="number" name="medicine_quantity[]" id="medicine-quantity-${count}" class="number-input-field" onkeyup="calculate_medicine_price(this)">
        </td>
        <td>
            <input type="number" name="in_stock[]" id="in-stock-${count}" class="number-input-field" readonly>
        </td>
        <td>
            <input type="number" name="selling_rate[]" id="selling-rate-${count}" class="number-input-field" readonly>
        </td>
        <td>
            <input type="number" name="total_price[]" id="total-price-${count}" class="number-input-field">
        </td>
        
        <td id="span-td-${count}">
            <span id="add-new-medicine-storeout" onclick="add_new_medicine_storeout()"><i class="fas fa-plus"></i></span>
            <span id="delete-row-${count}" data-id="${count}"><i class="fa fa-trash" aria-hidden="true"></i></span>
        </td>

        <script>
            $("#delete-row-${count}").click(function(e){
                if($(this).parent().parent().children().first().children().first().attr('id').split('-').pop() == (deleteBtn[deleteBtn.length - 1])) {
                    if(deleteBtn.length >= 2){
                        var id = $(this).data('id');
                        console.log(id);
                        deleteBtn.splice(deleteBtn.indexOf(id), 1);
                        $(this).parent().parent().remove();
                        create_span('storeout');
                    }
                } else{
                    var id = $(this).data('id');
                    deleteBtn.splice(deleteBtn.indexOf(id), 1);
                    $(this).parent().parent().remove();
                }
                console.log(deleteBtn);
                
            });
        </script>

    </tr>
    
    `)
    deleteBtn.push(count);  
    count++;
}

async function get_data(api_url, entered_name, options={name:'dealer_name'}) {
    const response = await fetch(api_url);
    const data = await response.json();
    //console.log(data);
    //if(data.length!=0){
    //    let myArray = [];
    //    for(let i=0;i<data.length;i++){
    //        myArray.push(data[i][options.name]);
    //    }
    autocomplete(entered_name, data, options);
        // console.log(data[0][options.name]);
    //}
}


function autocomplete(entered_name, data, options) {
    closeAllLists(options);

    let myArray = [];
    if(data.length!=0){
        for(let i=0;i<data.length;i++){
            myArray.push(data[i][options.name]);
        }
    
        dropbox_div = document.createElement('div');
        dropbox_div.setAttribute("id", options.name_id + "-autocomplete-list");
        dropbox_div.setAttribute("class", "autocomplete-items-"+options.options_for);
        document.getElementById(options.name_id).parentNode.appendChild(dropbox_div);

        for(let i=0; i < myArray.length; i++) {
            if (myArray[i].substr(0, entered_name.length).toUpperCase() == entered_name.toUpperCase()) {
                drop_item_element = document.createElement('div');
                drop_item_element.setAttribute('data-value',myArray[i]);
                drop_item_element.innerHTML = "<strong>" + myArray[i].substr(0, entered_name.length) + "</strong>";
                drop_item_element.innerHTML += myArray[i].substr(entered_name.length);
                drop_item_element.innerHTML += "<input type='hidden' value='" + myArray[i] + "'>";

                drop_item_element.addEventListener("click", (e) => element_selected(myArray[i], data, options));
                dropbox_div.appendChild(drop_item_element);
            }
            
        }
    }
}

function closeAllLists(options) {
    var dropbox_class = document.getElementsByClassName("autocomplete-items-"+options.options_for);
    for (var i=0; i<dropbox_class.length; i++) {
        dropbox_class[i].parentNode.removeChild(dropbox_class[i]);
    }
}

function element_selected(selected_element, data, options) {
    for (let i=0; i<data.length; i++) {
        if (data[i][options.name] == selected_element) {
            let values = Object.values(options.datas)
            let keys = Object.keys(options.datas)
            for(value in values){
                if(values[value] in data[i]){
                    document.getElementById(options[keys[value]]).value = data[i][values[value]];
                    if(options[keys[value]].split('-')[0] == 'in'){
                        if(parseInt(options[keys[value]].value) <= 10) {
                            document.getElementById(options[keys[value]]).style.border= "2px solid red";
                        } 
                    }
                }
            }
          
            document.getElementById(options.name_id).value = selected_element;
            // document.getElementById(options.email_id).value = data[i][options.email];

            if(options.options_for == 'dealer') {
                var button = document.createElement('input');
                button.setAttribute('type', 'button');
                button.value = 'View Recent Transactions';
                button.setAttribute('onclick', 'view_recent_transactions()');
                button.setAttribute('id', 'recent-transactions-button');
                //button.setAttribute('class', 'btn btn-primary btn-sm');
                //button.setAttribute('name', 'View Recent Transactions');
                document.getElementById('recent-transaction-button-div').appendChild(button);
            }

            break;

              
        }
    }

    closeAllLists(options);
}


function remove_active(x){
    for(let i=0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
    }
}


function add_active(x) {
    console.log(x);
    remove_active(x);
    if (current_focus >= x.length) {
        current_focus = 0;
    } else if (current_focus < 0) {
        current_focus = x.length - 1;
    }

    console.log(current_focus);
    x[current_focus].classList.add("autocomplete-active");
}

// function dealer_key_up(dealer_name) {
//     if (event.keyCode == 40) {

//     }

//     var options = {
//         options_for: 'dealer',
//         name: 'dealer_name',
//         name_id : 'dealer-name-box',
//         address_id: 'dealer-address-box',
//         phone_id: 'dealer-phone-box',
//         payment_id: 'dealer-payment-box',
//         datas:{
//             address_id: 'dealer_address',
//             phone_id: 'dealer_phone',
//         }
        

//     }
//     const api_url = '/api/v1/dealer/?search='+dealer_name;
//     api_data = get_data(api_url, dealer_name, options);
// }

var current_focus;

function key_down(input_field) {
    if (event.keyCode == 13){
        event.preventDefault()
        var x = document.getElementById(input_field.id + "-autocomplete-list");
        if (x) {
            x = x.getElementsByTagName("div");
            x[current_focus].click()
        }
        
    }  
}


function key_up(input_field) {
   
    if (event.keyCode == 40 || event.keyCode == 38){
        var x = document.getElementById(input_field.id + "-autocomplete-list");
        console.log(x);
        if (x) {
            x = x.getElementsByTagName("div");

            if (event.keyCode == 40) {
                current_focus++;
                add_active(x)
            } else if(event.keyCode == 38) {
                current_focus--;
                add_active(x);
            } 
        }
    } else if (event.keyCode == 13) {
        closeAllLists(options);
    }
    else {
        current_focus = -1;

        if (input_field.id.split('-')[0] == 'medicine') {
            var index = input_field.attributes.id.value.split('-').pop()
            console.log(index)
            if('out' in input_field.dataset){
                var options = {
                    options_for: 'medicine',
                    name: 'medicine_name',
                    name_id: input_field.attributes.id.value,
                 
                    selling_rate_id: 'selling-rate-'+index,
                
                    in_stock_id: 'in-stock-'+index,
                    datas: {
                        selling_rate_id: 'selling_rate',
                        in_stock_id: 'present_quantity',
                    }
                }
            }else{
                var options = {
                    options_for: 'medicine',
                    name: 'medicine_name',
                    name_id: input_field.attributes.id.value,
                    common_name_id: 'common-name-'+index,
                    selling_rate_id: 'selling-rate-'+index,
                    foils_per_packet_id: 'foils-per-packet-'+index,
                    capsules_per_foil_id: 'capsules-per-foil-'+index,
                    in_stock_id: 'in-stock-'+index,
                    datas: {
                        common_name_id: 'common_name',
                        selling_rate_id: 'selling_rate',
                        foils_per_packet_id: 'foils_per_packet',
                        capsules_per_foil_id: 'capsules_per_foil',
                        in_stock_id: 'present_quantity',
                    }
                }
            }
            
            entered_name = input_field.value
            if(entered_name!=''){
                const api_url = '/api/v1/medicines/?search='+entered_name;
                api_data = get_data(api_url, entered_name, options)
            } else{
                if (event.keyCode != 13) {
                    closeAllLists(options);
                }
            } 
        } else if (input_field.id.split('-')[0] == 'dealer') {
            var index = input_field.id.split('-').pop()
            var options = {
                options_for: 'dealer',
                name: 'dealer_name',
                name_id : 'dealer-name-'+index,
                address_id: 'dealer-address-'+index,
                phone_id: 'dealer-phone-'+index,
                payment_id: 'dealer-payment-'+index,
                remaining_balance_id: 'dealer-remaining-balance-'+index,
                datas:{
                    address_id: 'dealer_address',
                    phone_id: 'dealer_phone',
                    remaining_balance_id: 'remaining_balance',
                }
            }
            entered_name = input_field.value
            if(entered_name != ''){
                const api_url = '/api/v1/dealer/?search='+entered_name;
                api_data = get_data(api_url, entered_name, options);
            } else{
                closeAllLists(options);
            }
        }

    }
}

function calculate_medicine_price(input_field) {
    var entered_quantity = parseInt(input_field.value, 10)
    var index = input_field.id.split('-').pop()
    var selling_rate = document.getElementById('selling-rate-'+index)
    selling_rate = parseFloat(selling_rate.value)
    var total_price = document.getElementById('total-price-'+index)
    total_price.value = entered_quantity * selling_rate
}

function hide_recent_transactions() {
    document.getElementById('recent-transactions').remove()
    button = document.getElementById('recent-transactions-button');
    button.value = 'View Recent Transactions';
    button.setAttribute('onclick', 'view_recent_transactions()');
}

async function view_recent_transactions(){
    dealer_name = document.getElementById('dealer-name-1').value;
    const api_url = '/api/v1/dealer/get_invoices/?dealer='+dealer_name;
    // const response = await fetch(api_url);
    // const data = await response.body;
    console.log(data);

    div = document.createElement('div');
    div.setAttribute('id', 'recent-transactions');
    document.getElementById('recent-transaction-button-div').appendChild(div);


    $.get(api_url,function(res){
        $('#recent-transactions').append(res);
    })

    
    button = document.getElementById('recent-transactions-button');
    button.value = 'Hide Recent Transactions';
    button.setAttribute('onclick', 'hide_recent_transactions()');
   
}

function tabs(event, entity, item){
    var tabs_list = document.getElementsByClassName('tablinks');
    for(let i=0; i<tabs_list.length; i++){
        tabs_list[i].classList.remove('active');
    }
    document.getElementById('tabcontent').remove();
    var tabcontentDiv = document.createElement('div');
    tabcontentDiv.setAttribute('id', 'tabcontent');
    name = document.getElementById(entity+'-name').value;

    const api_url = '/api/v1/'+entity+'/get_invoices/?'+entity+'='+name+'&type='+item;
    $.get(api_url,function(res){
        $('#tabcontent').append(res);
    });

    document.getElementById('transaction-container').appendChild(tabcontentDiv);
    event.currentTarget.classList.add('active');
}

