
'use strict'

const serverList = $("#mainList");

const clearList = function(){
    serverList.html('');
}

const makeList = function(inData){
        inData.forEach(function(items){
            const itemID = items.id;
            let li = $("<li>"+ items.message + ' <button id=' + items.id+
                ' onclick="deleteItem(this.id)" class="todo_items"></button><input type="checkbox" id="'+ items.id + '"' + "</li>");
            const chkBt = li.find('input');
            chkBt.prop('checked',items.checked);
            chkBt.on('change',function(event){
                let sndChk;
                if(chkBt.is(':checked')) {
                    sndChk = true;
                } else {
                    sndChk = false;
                }
                let chkID = event.target.id;
                updateLi(sndChk,chkID);
            });
            serverList.append(li);
        })
};

const getList = function(){
    $.ajax({
        url: "/todo",
        type: "get",
        dataType: "json",
        success: function(inData){
          makeList(inData);
        },
        error: function(){
            alert("Something went wrong");
        }
    })
};

// Plus button

const addItem = function(){

    let itemTxt = $("#saveTxt").val();

    $.ajax({
        url: "/todo",
        type: "post",
        dataType: "json",
        data: JSON.stringify({
            message: itemTxt
        }),
        success: function(data){
            clearList();
            makeList(data);
        },
        error: function(){
            alert("Unable to add list element");
        }
    })
}

//  Delete button

const deleteItem = function(elID){

    console.log(elID);

    $.ajax({
        url: "/todo",
        type: "delete",
        dataType: "json",
        data: JSON.stringify({
            id: elID
        }),
        success: function(data){
            clearList();
            makeList(data);
        },
        error: function(){
            alert("Unable to delete item");
        }
    })
};

//  updating checkbox

const updateLi = function(chkIn,ID){
    $.ajax({
        url: "/todo",
        type: "put",
        dataType: "json",
        data: JSON.stringify({
            checked: chkIn,
            id: ID
        }),
        success: function(data){
        },
        error: function(){
            alert("Unable to update list");
        }
    })
}

//  search inside the list

const searchItems = function(){

    let searchInfo = $("#searchTxt").val();
    console.log(searchInfo);

    $.ajax({
        url: "/todo",
        type: "get",
        dataType: "json",
        data:{
            searchText: searchInfo
        },
        success: function(data){
            clearList();
            makeList(data);
        },
        error: function(){
            alert("Can't find the item. Something went wrong!")
        }
    })

};

//  Plus button

$("#addBtn").on('click',function(){
    addItem();
});

//  Search button

$("#searchBtn").on('click',function(){
    searchItems();
});

$('#searchTxt').keypress(function(e){
    if(e.keyCode===13)
        $("#searchBtn").click();
})

$('#saveTxt').keypress(function(e){
    if(e.keyCode===13)
        $("#addBtn").click();
})

getList();