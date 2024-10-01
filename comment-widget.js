var editMode = false;
var editContainer;

function handleClick() {
    const inputText = document.getElementById('textAreaText').value;
    if (inputText) {
        if (editMode) {
            editContainer.querySelector('p').innerText = inputText;
            document.getElementById('postCommentBtn').innerText = 'Post a comment';
            document.getElementById('textAreaText').value = '';
            updateLocalStorage();
        } else {
            addCommentsToDOM(inputText);
            addCommentsToLocalStorage(inputText);
            document.getElementById('textAreaText').value = '';
        }
    }
}

function addCommentsToDOM(inputText, replies = []) {
    // Create Elements to add comments to the div with id 'commentList'
    let wrapper = document.getElementById('commentList');
    let mainContainer = document.createElement('div');
    mainContainer.className = 'commentwrapper';
    wrapper.appendChild(mainContainer);

    let paraElement = document.createElement('p');
    paraElement.innerText = inputText;
    mainContainer.appendChild(paraElement);

    // Add Buttons
    let buttons = document.createElement('div');
    buttons.className = 'button-flex';
    mainContainer.appendChild(buttons);

    // Add reply button
    const replyButton = document.createElement('button');
    replyButton.innerHTML = '<i class="fas fa-reply"></i>';
    buttons.appendChild(replyButton);

    // Add Edit button
    let editBtn = document.createElement('button');
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    buttons.appendChild(editBtn);

    // Add Delete button
    let deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    buttons.appendChild(deleteBtn);

    // Load existing replies
    const repliesContainer = document.createElement('div');
    repliesContainer.className = 'replies-container';
    mainContainer.appendChild(repliesContainer);

    replies.forEach(replyText => {
        addReplyToDOM(replyText, repliesContainer);
    });

    // Reply Button Event
    replyButton.addEventListener('click', () => {
        // If textarea already exists, don't create another one
        if (!mainContainer.querySelector('.reply-textarea')) {
            let textArea = document.createElement('textarea');
            textArea.className = 'reply-textarea';
            textArea.setAttribute("rows", "2");
            textArea.setAttribute("cols", "1");
            textArea.setAttribute("placeholder", "Add a reply ...");
            mainContainer.appendChild(textArea);

            // Create a submit reply button
            let replyBtn = document.createElement('button');
            replyBtn.innerHTML = 'Reply';
            replyBtn.className = "replybtn";
            mainContainer.appendChild(replyBtn);

            // Create a cancel button
            let cancelBtn = document.createElement('button');
            cancelBtn.innerHTML = 'Cancel';
            cancelBtn.className = "cancelbtn";
            mainContainer.appendChild(cancelBtn);

            // Reply Button Event
            replyBtn.addEventListener('click', () => {
                let replyTextAreaVal = textArea.value.trim();
                if (replyTextAreaVal) {
                    addReplyToDOM(replyTextAreaVal, repliesContainer);

                    // Update local storage by adding the reply
                    addReplyToLocalStorage(inputText, replyTextAreaVal);

                    // Clear and remove textarea and buttons after posting
                    textArea.remove();
                    replyBtn.remove();
                    cancelBtn.remove();
                }
            });

            // Cancel Button Event
            cancelBtn.addEventListener('click', () => {
                // Clear and remove textarea and buttons
                textArea.remove();
                replyBtn.remove();
                cancelBtn.remove();
            });
        }
    });

    // Edit Button Event
    editBtn.addEventListener('click', () => {
        editMode = true;
        editContainer = mainContainer;
        document.getElementById('textAreaText').value = inputText;
        document.getElementById('postCommentBtn').innerText = 'Update Comment';
    });

    // Delete Button Event
    deleteBtn.addEventListener('click', () => {
        wrapper.removeChild(mainContainer);
        deleteCommentFromLocalStorage(inputText); // Delete comment from local storage
    });
}

function addReplyToDOM(replyText, container) {
    let replyContainer = document.createElement('div');
    replyContainer.className = 'replyContainer';
    replyContainer.innerHTML = `<p class="replyText">${replyText}</p>`;
    container.appendChild(replyContainer);
}

// Add comments and replies to local storage
function addCommentsToLocalStorage(inputText) {
    const comments = JSON.parse(localStorage.getItem("comments")) || [];
    comments.push({ comment: inputText, replies: [] }); // Store each comment as an object with replies array
    localStorage.setItem("comments", JSON.stringify(comments));
}

// Add reply to the corresponding comment in local storage
function addReplyToLocalStorage(commentText, replyText) {
    const comments = JSON.parse(localStorage.getItem("comments")) || [];
    const commentIndex = comments.findIndex(c => c.comment === commentText);
    if (commentIndex > -1) {
        comments[commentIndex].replies.push(replyText); // Add reply to replies array
    }
    localStorage.setItem("comments", JSON.stringify(comments));
}

// Delete comment from local storage
function deleteCommentFromLocalStorage(commentText) {
    const comments = JSON.parse(localStorage.getItem("comments")) || [];
    const updatedComments = comments.filter(c => c.comment !== commentText);
    localStorage.setItem("comments", JSON.stringify(updatedComments));
}

// Update local storage after editing
function updateLocalStorage() {
    const comments = Array.from(document.querySelectorAll('.commentwrapper p')).map(p => ({
        comment: p.innerText,
        replies: [] // We can further update this part to handle replies
    }));
    localStorage.setItem("comments", JSON.stringify(comments));
}

// Load comments and replies from local storage
function loadDOMComments() {
    const comments = JSON.parse(localStorage.getItem("comments")) || [];
    document.getElementById('comment-length').innerText = comments.length;
    comments.forEach(comment => {
        addCommentsToDOM(comment.comment, comment.replies); // Pass both comment and replies to addCommentsToDOM
    });
}

// Load comments when the DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    loadDOMComments();
});

//  Step-by-Step Explanation:
//  Array.from() is used to create Javascript arrays from iterable objects. ES6 feature.
// JSON.parse() is used to convert JSON strings into JavaScript objects or arrays.
// JSON.stringify() is used to conver JSON array or object into JSON strings.

//  const allComments = Array.from(document.querySelectorAll('.commentwrapper p')).map(p => p.textContent);
// 1. document.querySelectorAll('.commentwrapper p'):

// This part of the code selects all the <p> elements that are inside elements with the class .commentwrapper.
// querySelectorAll() returns a NodeList (a collection of all matching elements) containing all the <p> tags within .commentwrapper. These <p> elements represent the individual comments displayed on the page
// Array.from(...):

// Array.from() converts the NodeList returned by querySelectorAll() into a real JavaScript array.
// While a NodeList looks similar to an array, it does not have array methods like map(). So, we use Array.from() to transform the NodeList into an array, which will allow us to perform array operations like map().
// .map(p => p.textContent):

// The map() method is used to transform each element of the array (in this case, each <p> tag) into something else.
// p => p.textContent is an arrow function that, for each <p> element (p), retrieves its text content (p.textContent). The textContent property gets the inner text of the element, which is the actual comment text.
// comments.forEach(commentText => addCommentToDOM(commentText));
// comments:

// This is an array that contains a list of comment texts, typically loaded from localStorage or created dynamically.
// forEach():

// The forEach() method is an array method in JavaScript that allows you to iterate over each element in the array and apply a function to it.
// It takes a callback function and applies that function to every item in the array, one at a time.
// In this case, for each item (which is each comment text in the comments array), the addCommentToDOM() function is called.
// commentText => addCommentToDOM(commentText):

// This is an arrow function that takes one parameter, commentText, which represents the text of each comment in the array.
// Purpose:
// The line comments.forEach(commentText => addCommentToDOM(commentText)); iterates over all comments in the comments array and adds each comment to the DOM by calling the addCommentToDOM() function.
