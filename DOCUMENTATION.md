## &#9733; Project Documentation &#9733; 

### Project Name: *Sticky Note Application Js*

### &#9873; Project Overview:

* **Purpose:** A web-based application for creating, managing, and organizing sticky notes.
* **Target Audience:** Users who need a simple and easiest way to take and manage notes.
* **Key Features:** 
  - Create and manage multiple sticky notes as possible.
  - Assign titles to sticky notes for easy identification.
  - Drag and move sticky notes within the browser window for arranging and organizing.
  - Customize sticky note header colors.
  - Resize sticky notes to fit your needs.
  - Copy and paste content within sticky notes.
  - Remove sticky notes when no longer needed.
  - Support system fonts and text styling.
  - Persist sticky note data in local storage for future use.

### &#9873; **Workflow**

___1. Initialization:___
  - Initializing the DOM access to color picker, add button, notes container, note template.
  - Loading events listener (window load, mouse down, mouse move, mouse up, add button click).
  - Loading saved notes from local storage if any.

___2. User Interactions:___
  - *Create New Note:*
    - Create a new sticky note object with default properties (title as current timestamp, empty content, default position, chosen color). 
    - Add the sticky note to the object array of sticky notes.
    - Render the sticky note on the UI.

  - *Focus Note:*
    - Allow the user to click anywhere (except close button) in the note to bring focus.

  - *Edit Note:*
    - Allow the user to double-click the title to edit the title.
    - Allow the user to click content body of a sticky note to edit content.
    - Update the changes corresponding sticky note object in the object array.

  - *Move Note:*
    - Allow the user to drag and drop sticky notes by click and hold in the header tab.
    - Update the sticky corresponding note position property in object array.

  - *Resize Note:*
    - Allow the user to resize sticky notes by dragging their corners.
    - Update the sticky corresponding note width and height properties in object array.

  - *Delete Note:*
    - Allow the user to delete sticky notes by clicking a Close button.
    - Remove the sticky note from the object array and update the UI.

___3. Persistence:___
  - *Save Notes:*
    - On each user interactions will save the object array of sticky notes to local storage. For avoiding unexpected data loss.
  - *Load Notes:*
    - When the application starts, load the saved sticky notes from local storage and recreate them on the UI.

___4. UI Rendering:___
  - cloneNote function will clone template from DOM and Render the sticky notes on the UI based on their properties (position, size, color, title and content).
  - Update the UI whenever a sticky note is added, removed, edited, moved, or resized.

___5. Additional Features:___
  - Color Customization: Allow users to choose different colors for sticky notes header.
  - Text Formatting: Implement basic text formatting options (bold, italic, underline) based on system shortcuts.  

### &#9873; **Code Explanation**

**Programming Language:** _Vanilla JavaScript_

#### **Key Components and Functions:**

- __Variable Initialization:__
  - Purpose: To initiate necessary variables
  - Code Example:
  ```javascript
  // getting color picker DOM reference
  const note_colorPicker = document.getElementById('note-color-picker');
  // getting add button DOM reference
  const add_button = document.getElementById('add-button');
  // getting notes container DOM reference
  const notes = document.getElementById('notes');
  // getting template DOM reference
  const note_template = document.getElementById('note-template');

  // Initializing an empty notes object
  let notes_db = {};

  // Initializing an empty object for saving drag distance
  let distance = {
    x: 0,
    y: 0
  };

  // Initializing an empty object for cursor position to saving starting point of drag
  let cursorPosition = {
    x: 0,
    y: 0
  };

  // Initializing an empty object for DOM reference of note and position of it for dragging
  let note = {
    dom: null,
    top: 0,
    left: 0
  };
  ```

- __Template:__
  - Purpose: To implement reusable note component
  - Code Example:
    ```html
      <template id="note-template">
        <div class="note">
          <div class="note-header">
            <input type="text" id="title" class="title" value="" placeholder="add your title" readonly>
            <button type="button" class="close-button">&times;</button>
          </div>
          <div class="note-body" contenteditable></div>
        </div>
      </template>
    ```

- __Window Load Event:__
  - Purpose: To call init_notes function
  - Code Example:
    ```javascript
      window.addEventListener('load', function() {
        init_notes();
      });
    ```

- __init_notes:__
  - Purpose: To initiate saved notes
  - Code Example:
  ```javascript
    // Fetch from local storage
    string_notes_db = localStorage.getItem('js-note-app');
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

  ```

- __cloneNode:__
  - Purpose: To clone template to create note
  - Code Example:
  ```javascript
    // clones the template note
    let clone = note_template.content.cloneNode(true);
    // adding preferences and content to cloned DOM
    ...
    clone.querySelector('.note-body').innerHTML = currentNote.content;
    ...
    // appending clone to the notes container
    notes.appendChild(clone); 
    // adding event listeners to cloned note
    ...
    noteBody.addEventListener('input', function(event) {
        ...
    });
    titleElement.addEventListener('dblclick', function(event) {
      ...
    });
    closeButton.addEventListener('click', function(event) {   
      ...
    });
    notes.lastElementChild.addEventListener('click', function(event) {
      ...
    });
  ```

- __noteBody input event listener:__
  - Purpose: To listen for any input in the note content for saving
  - Code Example:
  ```javascript
    // assign to notes_db object array
    notes_db[id].content = this.innerHTML;
    // update details in localStorage
    updateNote();
  ```

- __titleElement double click event listener:__
  - Purpose: To listen for any double click on the title element for changing title
  - Code Example:
  ```javascript
    // making the title text as input box
    this.readOnly = false;
    this.classList.add('active');
    // event triggers when user focus leaves from input box
    this.addEventListener('blur', function(event2) {
      ...
    });
  ```

- __titleElement blur event listener:__
  - Purpose: To save title and revert input box into title text
  - Code Example:
  ```javascript
    // making input box as title text
    this.classList.remove('active');
    let title = this.value;
    notes_db[id].title = title;
    this.readOnly = true;
    // removing unnecessary blur event listener to improve performance
    this.removeEventListener('blur', function() {});
    // update details in localStorage
    updateNote();
  ```

- __closeButton click event listener:__
  - Purpose: To call removeNote function
  - Code Example:
  ```javascript
    removeNote(id);
  ```

- __note click event listener:__
  - Purpose: To call setFocusOrder function on various scenario
  - Code Example:
  ```javascript
  // setting event target as target
  let target = event.target;
  
  // Find the note id from various child element to note element
  if (target.classList.contains('note')) {
    setFocusOrder(target.id);     
  } else if (target.offsetParent.offsetParent.classList.contains('note')) {
    setFocusOrder(target.offsetParent.offsetParent.id);     
  } else if (target.offsetParent.classList.contains('note')) {
    setFocusOrder(target.offsetParent.id);      
  }
  ```

- __updateNote:__
  - Purpose: To update details in the localStorage
  - Code Example:
  ```javascript
  let string_notes_db = null; 
  string_notes_db = JSON.stringify(notes_db);
  localStorage.setItem('js-note-app', string_notes_db);
  ```

- __removeNote:__
  - Purpose: To remove note from the UI
  - Code Example:
  ```javascript
  // selecting the note to remove by using note_id
  let element = document.getElementById(id);
  // removing resize observer to improve performance and avoid any errors in future
  elementObserver.unobserve(element.querySelector('.note-body'));
  // removing note element from DOM
  notes.removeChild(element);
  // deleting note from notes_db object array 
  delete notes_db[id];
  // update details in localStorage
  updateNote();
  ```

- __setFocusOrder:__
  - Purpose: To change the focus order of the note when user choose
  - Code Example:
  ```javascript
  // Selecting note element by note_id which is selected by user
  let element = document.getElementById(id);
  // getting that note element z-index for calculation
  let element_zIndex = element.style.zIndex;
  // Iterate through all notes in the DOM
  for (let child of notes.children) {
    // getting note id of the current iteration
    let childId = child.id;
    // comparing that is same as user chosen
    if (element === child) {
      // setting highest z-index by the count of total notes
      child.style.zIndex = notes.childElementCount;
    } else { // this will iterate through other children 
      // getting current note z-index
      let old_zIndex = child.style.zIndex;
      // comparing if current z-index is greater than user chosen note
      // This apply z-index to all the upper most notes which user chosen note is below to it
      if (old_zIndex > element_zIndex) {
        // reapplying z-index without disturbing user stacked of arrangements
        child.style.zIndex = old_zIndex-1;
      }
    }
    // finally updating z-index detail only to the notes_db object array
    notes_db[childId].zIndex = child.style.zIndex;
  }
   // update details in localStorage
  updateNote();
  ```

- __add_button click event listener:__
  - Purpose: To call add_newNote function
  - Code Example:
  ```javascript
    add_newNote();
  ```

- __add_newNote:__
  - Purpose: To create a new empty note and update in localStorage
  - Code Example:
  ```javascript
  // getting current timestamp when creating note
  let timeStamp = new Date().getTime().toString();
  // that timestamp became an unique id for the note  
  let id = 'note_' + timeStamp; 
  // creating an empty object in the object array 
  notes_db[id] = {};
  // setting default values for the new note
  notes_db[id].left = '50px';
  notes_db[id].top = '50px';
  notes_db[id].sizeX = '250px';
  notes_db[id].sizeY = 'auto';
  // assigning highest order of z-index to focus the note in top
  notes_db[id].zIndex = Number(notes.childElementCount) + 1;
  // setting user picked color as header tab background
  notes_db[id].bg = note_colorPicker.value;
  notes_db[id].timeStamp = timeStamp;
  // default title is timestamp
  notes_db[id].title = timeStamp;
  // default content for note is null
  notes_db[id].content = null;  
  // to create note in the DOM by clone the template
  cloneNote(id);
  ```

- __document mousedown event listener:__
  - Purpose: To get mouse position and note position before drag and move
  - Code Example:
  ```javascript
  // it only consider that click event on note-header or title
  if (target.classList.contains('note-header') || target.classList.contains('title')) {   
    // getting current cursor position
    cursorPosition = {
      x: event.clientX,
      y: event.clientY      
    };
    
    // selecting note DOM from either note-header or title
    let dom = null;
    // selecting through note-header
    if (target.offsetParent.classList.contains('note')) {
      dom = target.offsetParent;
    // selecting through title
    } else if (target.offsetParent.offsetParent.classList.contains('note')) {
      dom = target.offsetParent.offsetParent;
    }

    // setting note position with DOM reference
    note = {
      dom: dom,
      top: event.target.getBoundingClientRect().top,
      left: event.target.getBoundingClientRect().left
    };

  }
  ```

- __document mousemove event listener:__
  - Purpose: To move the note to new mouse position when user make drag on note
  - Code Example:
  ```javascript
  // This will proceed only has valid note DOM reference
  if (note.dom == null) { return; }
  // getting note id from note DOM reference
  let note_id = note.dom.id;

  // calculating mouse movement distance with new mouse pointer position
  distance = {
    x: event.clientX - cursorPosition.x,
    y: event.clientY - cursorPosition.y
  };

  // applying that distance to the note DOM reference 
  note.dom.style.left = (note.left + distance.x) + 'px';
  note.dom.style.top = (note.top + distance.y) + 'px';

  // update position of note
  if (notes_db[note_id] != undefined) {
    notes_db[note_id].top = note.dom.style.top;
    notes_db[note_id].left = note.dom.style.left;
    // update details in localStorage
    updateNote();
  }

  // To indicate that note is now draggable by changing cursor type
  note.dom.querySelector('.note-header').style.cursor = 'grab';
  note.dom.querySelector('.title').style.cursor = 'grab';
  ```

- __document mouseup event listener:__
  - Purpose: To release the drag event
  - Code Example:
  ```javascript
  /* 
    this will only consider when has valid DOM reference, which is previously stored in mousedown event
  */
  if (note.dom == null) { return; } 
  // To indicate that note is placed on the position and not in the draggable by changing cursor type
  note.dom.querySelector('.note-header').style.cursor = 'auto';
  note.dom.querySelector('.title').style.cursor = 'auto';
  // removing note DOM reference to avoid drag functionality
  note.dom = null;
  ```

- __Resize Observer:__
  - Purpose: To monitor any dimension changes to the note elements
  - Code Example:
  ```javascript
  // Resize Observer
  const elementObserver = new ResizeObserver(function(entries) {
    entries.forEach(function(entry) {       
      // getting note id
      let id = entry.target.parentNode.id;
      // getting parent dimension based on note-body dimension
      let width = entry.borderBoxSize[0].inlineSize;
      let height = entry.borderBoxSize[0].blockSize;

      // it will consider only note id is valid
      if (id === '' || id === undefined || id === null) { return; }

      // updating to notes objects array
      notes_db[id].sizeX = width + 'px';
      notes_db[id].sizeY = height + 'px';

      // update details in localStorage
      updateNote();
    });
  });
  ```

#### **Data Structures:**
  - Object Array to store a list of sticky note objects.
  - LocalStorage to persist sticky note data.

### &#9873; **Known Issues and Limitations**
- __Limited Functionality:__
  - This app is designed for basic note-taking and may not have advanced features like collaboration, synchronization, or rich text formatting.
- __Storage Limitations:__
  - Local storage has limitations in terms of storage capacity and data persistence. Large amounts of notes may not be suitable for this app.
- __Security Concerns:__
  - Local storage is not completely secure, and other applications or websites might potentially access the stored data.
- __Browser Compatibility:__
  - While the app is designed to work in modern browsers, there might be compatibility issues with older browsers or specific browser configurations.

&#9733; For More [README](./README.md)
