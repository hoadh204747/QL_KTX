const search = document.forms['searchPost'].querySelector('input');
    search.addEventListener('keyup', function(e){
        const term = e.target.value.toLowerCase();
        const books = list.getElementsByTagName('li');
        for(let i=0; i<books.length; i++){
            const title = books[i].textContent.toLowerCase();
            if(title.indexOf(term) != -1){
                books[i].style.display = 'block';
            } else {
                books[i].style.display = 'none';
            }
        }
    })

document.querySelector('#search').addEventListener('input', handleSearch)
function handleSearch(){
    let filter = document.getElementById('search').value.toLowerCase();
    let table = document.getElementById('table');
    let tr = table.getElementsByTagName('tr');
    for(var i = 0; i<tr.length; i++){   
        let td = tr[i].getElementsByTagName('td')[0];
        if(td){
            let textValue = td.textContent || td.innerHTML;

            if(textValue.toLowerCase().includes(filter)){
                tr[i].style.display = ""
            } else {
                tr[i].style.display = "none"
            }
        }
    }
}