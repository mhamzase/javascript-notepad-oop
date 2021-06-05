// Note Class
class Note{
    constructor(id,title,desc,color){
        this.id = id,
        this.title = title,
        this.desc = desc,
        this.color = color
    }
}


// UI Class
class UI{

    // refresh all notes
    static refreshNotes()
    {
        document.querySelector("#note-list").innerHTML = "";
        const notes = Store.getNotes();
        let i = notes.length;
        while(i--) UI.addNoteToList(notes[i]);
        UI.updateId();
    }

    // add notes to list
    static addNoteToList(note)
    {
        const list = document.querySelector('#note-list');
        let card = document.createElement("div");
        card.classList = 'card text-white bg-primary mb-3';
        
        card.innerHTML = `
            <div class="card-header">
                <span>${note.title}</span>
                <i class="fas fa-trash" noteid="${note.id}"></i>
                <i class="fas fa-pencil-alt mr-3" noteid="${note.id}"></i>
            </div>
            <div class="card-body ${note.color} ${note.color=='bg-white'?'text-dark':''}">
                <p class="card-text">${note.desc}</p>
            </div>`;
            list.appendChild(card);
    }

    // show alerts
    static showAlert(message,className)
    {
        const div = document.createElement("div");
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector("#note-form");
        container.insertBefore(div,form);

        // display for 2 seconds
        setTimeout(()=> document.querySelector('.alert').remove(),2000)
    }  

    // clear fields after submit form
    static clearFields()
    {
        document.querySelector("#title").value = "";
        document.querySelector("#desc").value = "";
        UI.updateId();
    }


    // udpate id
    static updateId(){
        document.querySelector("#noteid").value = (Store.getLastNote()==undefined)? 1: Store.getLastNote().id+1;
    }


    // remove color picker
    static removeColorPicker(){
        let swatches = document.querySelector('.swatches').children;
        let i = swatches.length;
        while(i--) swatches[i].classList.remove('active');
    }
}



// Store Class

class Store{

    // get all notes
    static getNotes(){
        let notes;
        if(localStorage.getItem('notes') == null)
        {
            notes = [];
        }
        else{
            notes = JSON.parse(localStorage.getItem('notes'));
        }

        return notes;
    }

    // get single note
    static getNote(id){
        return Store.getNotes().find(val => val.id == id);
    }

    // get last note
    static getLastNote(){
        let notes = Store.getNotes();
        return notes[notes.length-1];
    }

    // add a note
    static addNote(note){
        if(Store.getNote(note.id) !== undefined)
        {
            Store.removeNote(note.id);
        }
        const notes = Store.getNotes();
        notes.push(note);
        localStorage.setItem('notes',JSON.stringify(notes));
    }

    // remove a note
    static removeNote(id){
        const notes = Store.getNotes();
        notes.forEach((note,index) => {
            if(note.id == id){
                notes.splice(index,1);
            }
        });
        localStorage.setItem('notes',JSON.stringify(notes));
    }


    // clear all notes
    static removeAllNotes(){
        localStorage.clear();
        UI.showAlert('All notes removed','success');
        UI.refreshNotes();
    }
}


// Events: Display
document.addEventListener('DOMContentLoaded',UI.refreshNotes());


// Event: Add Note
document.querySelector("#note-form").addEventListener('submit', e => {
    e.preventDefault();

    // get form values
    const title = document.querySelector('#title').value;
    const desc = document.querySelector('#desc').value;
    const id = parseInt(document.querySelector('#noteid').value);
    const color = document.querySelector('.swatches').querySelector('.active').classList[0];


    // validate
    if(title == '' || desc == '')
    {
        UI.showAlert('Please fill all fields','danger');
    }
    else{
        // instantiate note
        const note = new Note(id,title,desc,color);

        // add note
        UI.addNoteToList(note);
        Store.addNote(note);
        UI.showAlert("Note added successfully",'success');
        UI.clearFields();
        UI.refreshNotes();
    }

})


// Event: remove/update note
document.querySelector('#note-list').addEventListener('click' , e =>{
    UI.refreshNotes();

    if(e.target.classList.contains('fa-trash'))
    {
        Store.removeNote(e.target.getAttribute('noteid'));
        UI.showAlert('Note Removed','success');
        UI.refreshNotes();
    }
    if(e.target.classList.contains('fa-pencil-alt')) {
        //update the form with selected noted
        document.querySelector('#title').value = e.target.parentElement.firstElementChild.innerText.trim();
        document.querySelector('#desc').value = e.target.parentElement.parentElement.querySelector('.card-body').innerText.trim();
        document.querySelector('#noteid').value = e.target.getAttribute('noteid');

        // switch selected color
        UI.removeColorPicker();
        document.querySelector('.'+e.target.parentElement.parentElement.querySelector('.card-body').classList[1]).classList.add('active');
    }
})

// choose color
document.querySelector('.swatches').addEventListener('click', e => {
    if(e.target.classList.contains('swatch')) {
        UI.removeColorPicker();
        e.target.classList.add('active');
    }
})

document.querySelector("#clear").addEventListener('click', e=>{
    Store.removeAllNotes();
})