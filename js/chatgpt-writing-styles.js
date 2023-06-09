var LOCAL_STORAGE_KEY = `secret-santa-${new Date().getFullYear()}`;

const DATA = {
    "": ""
};

document.addEventListener("DOMContentLoaded", function () {


    const table = document.getElementById("authors-table");
    const tableBody = table.getElementsByTagName("tbody")[0];
    new Sortable(tableBody, {
        animation: 150,
        draggable: "tr",
    });
});