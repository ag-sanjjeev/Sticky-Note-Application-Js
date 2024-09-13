/*
 ________________________________________________
(            Sticky Note Application           ()
\-----------------------------------------------\
|                                               |
|   Copyright 2024 ag-sanjjeev                  |
|                                               |
|-----------------------------------------------|
|   The source code is licensed under           |
|   MIT-style License.                          |
|                                               |
|-----------------------------------------------|
|                                               |
|   The usage, permission and condition         |
|   are applicable to this source code          |
|   as per license.                             |
|                                               |
|-----------------------------------------------|
|                                               |
|   That can be found in LICENSE file           |
|   or at https://opensource.org/licenses/MIT.  |
(_______________________________________________(

*/

const note_colorPicker = document.getElementById('note-color-picker');
const add_button = document.getElementById('add-button');
const notes = document.getElementById('notes');
const note_template = document.getElementById('note-template');

/*
	Object Structure: 
	{
		note_id : {
			left: string;
			top: string;
			sizeX: string;
			sizeY: string;
			zIndex: number;
			bg: string;
			timeStamp: number;
			title: string;
			content: string;	
		}
	}
*/
let notes_db = {};

let distance = {
	x: 0,
	y: 0
};

let cursorPosition = {
	x: 0,
	y: 0
};

let note = {
	dom: null,
	top: 0,
	left: 0
};

// Resize Observer
const elementObserver = new ResizeObserver(function(entries) {
	entries.forEach(function(entry) {				
		
		let id = entry.target.parentNode.id;
		let width = entry.borderBoxSize[0].inlineSize;
		let height = entry.borderBoxSize[0].blockSize;

		if (id === '' || id === undefined || id === null) { return; }

		notes_db[id].sizeX = width + 'px';
		notes_db[id].sizeY = height + 'px';
		updateNote();
	});
});

// Initiate notes
function init_notes() {
	let string_notes_db = null;	
	string_notes_db = localStorage.getItem('js-note-app');

	if (string_notes_db == null || string_notes_db == undefined || string_notes_db == '' || string_notes_db == {}) { return; }
	
	// try to parse JSON if has error in it then throws an error and avoid to proceed anything
	try {
		string_notes_db = JSON.parse(string_notes_db);
		notes_db = string_notes_db;
	} catch {
		throw new Error('Unable to process notes');		
	}

	// Creating saved notes to the view
	for (let i in notes_db) {
		let id = i;		
		cloneNote(id);
	}
}

// Add new note in notes_db
function add_newNote() {
	let timeStamp = new Date().getTime().toString();	
	let id = 'note_' + timeStamp;	
	notes_db[id] = {};
	notes_db[id].left = '50px';
	notes_db[id].top = '50px';
	notes_db[id].sizeX = '250px';
	notes_db[id].sizeY = 'auto';
	notes_db[id].zIndex = Number(notes.childElementCount) + 1;
	notes_db[id].bg = note_colorPicker.value;
	notes_db[id].timeStamp = timeStamp;
	notes_db[id].title = timeStamp;
	notes_db[id].content = null;	
	cloneNote(id);
}

// Update note in localStorage
function updateNote() {
	let string_notes_db = null;	
	string_notes_db = JSON.stringify(notes_db);
	localStorage.setItem('js-note-app', string_notes_db);
}

// Remove Note
function removeNote(id) {
	let element = document.getElementById(id);
	elementObserver.unobserve(element.querySelector('.note-body'));
	notes.removeChild(element);
	delete notes_db[id];
	updateNote();
}

// Set Focus Order
function setFocusOrder(id) {
	let element = document.getElementById(id);
	let element_zIndex = element.style.zIndex;
	for (let child of notes.children) {
		let childId = child.id;
		if (element === child) {
			child.style.zIndex = notes.childElementCount;
		} else {
			let old_zIndex = child.style.zIndex;
			if (old_zIndex > element_zIndex) {
				child.style.zIndex = old_zIndex-1;
			}
		}
		notes_db[childId].zIndex = child.style.zIndex;
	}
	updateNote();
}

// clone node
function cloneNote(id) {
	
	let currentNote = notes_db[id];

	let clone = note_template.content.cloneNode(true);
	clone.querySelector('.note').id = id;
	clone.querySelector('.note').style.top = currentNote.top;
	clone.querySelector('.note').style.left = currentNote.left;
	clone.querySelector('.note').style.zIndex = currentNote.zIndex;

	clone.querySelector('.note-header').style.background = currentNote.bg;
	clone.querySelector('.note-header .title').value = currentNote.title;

	clone.querySelector('.note-body').style.height = currentNote.sizeY;
	clone.querySelector('.note-body').style.width = currentNote.sizeX;
	clone.querySelector('.note-body').innerHTML = currentNote.content;
	
	notes.appendChild(clone);	

	// adding events and observers
	let noteBody = notes.lastElementChild.querySelector('.note-body');
	let titleElement = notes.lastElementChild.querySelector('.note-header .title');
	elementObserver.observe(noteBody);
	noteBody.addEventListener('input', function(event) {
		notes_db[id].content = this.innerHTML;
		updateNote();
	});
	titleElement.addEventListener('dblclick', function(event) {
		this.readOnly = false;
		this.classList.add('active');
		this.addEventListener('blur', function(event2) {
			this.classList.remove('active');
			let title = this.value;
			notes_db[id].title = title;
			this.readOnly = true;
			this.removeEventListener('blur', function() {});
			updateNote();
		});
	});
	let closeButton = notes.lastElementChild.querySelector('.close-button');
	closeButton.addEventListener('click', function(event) {		
		removeNote(id);
	});
	notes.lastElementChild.addEventListener('click', function(event) {
		let target = event.target;
		
		if (target.classList.contains('note')) {
			setFocusOrder(target.id);			
		}	else if (target.offsetParent.offsetParent.classList.contains('note')) {
			setFocusOrder(target.offsetParent.offsetParent.id);			
		} else if (target.offsetParent.classList.contains('note')) {
			setFocusOrder(target.offsetParent.id);			
		}
	});
}

// Event Listeners
window.addEventListener('load', function() {
	init_notes();
});

add_button.addEventListener('click', function(event) {
	add_newNote();
});

// Mouse click event for drag
document.addEventListener('mousedown', function(event) {
	let target = event.target;
	if (target.classList.contains('note-header') || target.classList.contains('title')) {		
		cursorPosition = {
			x: event.clientX,
			y: event.clientY			
		};
		

		let dom = null;
		if (target.offsetParent.classList.contains('note')) {
			dom = target.offsetParent;
		} else if (target.offsetParent.offsetParent.classList.contains('note')) {
			dom = target.offsetParent.offsetParent;
		}

		note = {
			dom: dom,
			top: event.target.getBoundingClientRect().top,
			left: event.target.getBoundingClientRect().left
		};

	}
});

// Mouse movement for drag event
document.addEventListener('mousemove', function(event) {

	if (note.dom == null) { return; }
	let note_id = note.dom.id;

	distance = {
		x: event.clientX - cursorPosition.x,
		y: event.clientY - cursorPosition.y
	};

	note.dom.style.left = (note.left + distance.x) + 'px';
	note.dom.style.top = (note.top + distance.y) + 'px';

	// update position of note
	if (notes_db[note_id] != undefined) {
		notes_db[note_id].top = note.dom.style.top;
		notes_db[note_id].left = note.dom.style.left;
		updateNote();
	}
	note.dom.querySelector('.note-header').style.cursor = 'grab';
	note.dom.querySelector('.title').style.cursor = 'grab';
});

// mouse up event for release drag event
document.addEventListener('mouseup', function(event) {
	if (note.dom == null) { return; }	
	note.dom.querySelector('.note-header').style.cursor = 'auto';
	note.dom.querySelector('.title').style.cursor = 'auto';
	note.dom = null;
});
