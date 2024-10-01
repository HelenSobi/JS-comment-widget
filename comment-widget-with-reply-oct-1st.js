var editMode = false;
var editContainer;
function handleClick(){
    const inputText = document.getElementById('textAreaText').value;
    if(inputText){
        if(editMode){
            editContainer.querySelector('p').innerText=inputText;
            document.getElementById('postCommentBtn').innerText='Post a comment';
            document.getElementById('textAreaText').value='';
            updateLocalStorage(); 
        }
        else{
            addCommentsToDOM(inputText);
            addCommentsToLocalStorage(inputText); 
            document.getElementById('textAreaText').value='';
        } 
    }
}
function addCommentsToDOM(inputText){
    //create Elements to add commets to the id of div 'commentList'
    let wrapper = document.getElementById('commentList');
    let mainContainer = document.createElement('div');
    mainContainer.className='commentwrapper';
    wrapper.appendChild(mainContainer);
    let paraElement = document.createElement('p');
    paraElement.innerText=inputText;
    mainContainer.appendChild(paraElement);

    

    //add Buttons
    let buttons = document.createElement('div');
    buttons.className='button-flex';
    mainContainer.appendChild(buttons);
    //add reply button
    const replyButton = document.createElement('button');
    replyButton.innerHTML='<i class="fas fa-reply"></i>';
    buttons.appendChild(replyButton);
     //add Edit Button
    let editBtn = document.createElement('button');
    editBtn.innerHTML='<i class="fas fa-edit"></i>';
    buttons.appendChild(editBtn);       
    //add Delete Button
    let deleteBtn = document.createElement('button');
    deleteBtn.innerHTML='<i class="fas fa-trash"></i>';
    buttons.appendChild(deleteBtn);

   //Reply Button
   replyButton.addEventListener('click',()=>{ 
    // If textarea already exists, don't create another one
    if(!mainContainer.querySelector('.reply-textarea')){
        let textArea = document.createElement('textarea');
        textArea.className='reply-textarea';
        textArea.setAttribute("rows","2");
        textArea.setAttribute("cols","1");
        textArea.setAttribute("placeholder","Add a reply ...");
        mainContainer.appendChild(textArea);
        // Create a submit reply button
        let replyBtn = document.createElement('button');
        replyBtn.innerHTML='Reply';
        replyBtn.className="replybtn";
        mainContainer.appendChild(replyBtn);

        //create can button
        let cancelBtn = document.createElement('button');
        cancelBtn.innerHTML='Cancel';
        cancelBtn.className="cancelbtn";
        mainContainer.appendChild(cancelBtn);

        //Reply Button Event
        replyBtn.addEventListener('click',()=>{
            let replyTextAreaVal = textArea.value.trim();
            let replyContainer = document.createElement('div');
            replyContainer.className='replyContainer';
            replyContainer.innerHTML=`<p class="replyText">${replyTextAreaVal}</p>`;
            mainContainer.appendChild(replyContainer);

            // Clear and hide the textarea and buttons after posting
            textArea.remove();
            replyBtn.remove();
            cancelBtn.remove();
        })
        //cancel Button event
        cancelBtn.addEventListener('click',()=>{
            // Clear and hide the textarea and buttons after posting
            textArea.remove();
            replyBtn.remove();
            cancelBtn.remove();
        })
    }
    });
    
    //Edit Button Event 
    editBtn.addEventListener('click',()=>{
        editMode = true;
        editContainer = mainContainer;
        document.getElementById('textAreaText').value=inputText;
        document.getElementById('postCommentBtn').innerText='update Comment';

    })
    //Delete Button Event
    deleteBtn.addEventListener('click',()=>{
        wrapper.removeChild(mainContainer);
        updateLocalStorage();
    });

}
function addCommentsToLocalStorage(inputText){
    const comments = JSON.parse(localStorage.getItem("comments")) || [];
    comments.push(inputText);
    localStorage.setItem("comments",JSON.stringify(comments));
}
//to update Local Storage
function updateLocalStorage(){
    const comments = Array.from(document.querySelectorAll('.commentwrapper p')).map(p=>p.innerText);
    localStorage.setItem("comments",JSON.stringify(comments));
}
function loadDOMComments(){
    const comments = JSON.parse(localStorage.getItem("comments")) || [];
    document.getElementById('comment-length').innerHTML=comments.length;
    comments.forEach(comment => addCommentsToDOM(comment));
}
//load comments when the DOM is loaded
window.addEventListener('DOMContentLoaded',()=>{
    loadDOMComments();
})
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
