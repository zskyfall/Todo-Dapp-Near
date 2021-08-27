import 'regenerator-runtime/runtime'

import { initContract, login, logout, checkElement, convertUnixTimeToDate, hasClass, changeProcessText } from './utils'

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

// global variable used throughout
let currentTasks

const submitButton = document.querySelector('form button')

document.querySelector('form').onsubmit = async (event) => {
  event.preventDefault()

  // get elements from the form using their id attribute
  const { fieldset, author, content } = event.target.elements

  // disable the form while the value gets updated on-chain
  fieldset.disabled = true

  try {
    changeProcessText("Processing...Please wait....");
    // make an update call to the smart contract
    await window.contract.addNewTask({
      // pass the value that the user entered in the greeting field
      _author: author.value,
      _content: content.value
    })
  } catch (e) {
    alert(
      'Something went wrong! ' +
      'Maybe you need to sign out and back in? ' +
      'Check your browser console for more info.'
    )
    throw e
  } finally {
    // re-enable the form, whether the call succeeded or failed
    fieldset.disabled = false
    
    // update the greeting in the UI
    await fetchTasks()
  }
  
  changeProcessText("Process completed!");

  // disable the save button, since it now matches the persisted value
  submitButton.disabled = true
}

document.querySelector('input#content').oninput = (event) => {

  if (event.target.value !== '') {
    submitButton.disabled = false
  } else {
    submitButton.disabled = true
  }
}

// checkElement('input.isDone').then((selector) => {
//   document.querySelector('input.isDone').onclick = () => {
//     alert('click');
//   }
// });

document.addEventListener('click', async function (e) {
  if (hasClass(e.target, 'isDone')) {
      
      changeProcessText("Processing...Please wait....");

      let parent = e.target.parentElement.parentElement;
      let tskId = parent.firstChild.innerText;
          tskId = parseInt(tskId);

      let markTaskResult = await contract.toggleTaskDone({_taskId: tskId});

      if(markTaskResult) {
        parent.style.textDecorationLine = "line-through";
        alert("Marked the task as finished");
      }
      else {
        parent.style.textDecorationLine = "none";
        alert("Marked the task as unfinished");
      }

      changeProcessText("Process completed!");

      console.log(tskId);
  }
}, false);

document.querySelector('#sign-in-button').onclick = login
document.querySelector('#sign-out-button').onclick = logout


// Display the signed-out-flow container
function signedOutFlow() {
  document.querySelector('#signed-out-flow').style.display = 'block'
}

// Displaying the signed in flow container and fill in account-specific data
function signedInFlow() {
  document.querySelector('#signed-in-flow').style.display = 'block'

  document.querySelectorAll('[data-behavior=account-id]').forEach(el => {
    el.innerText = window.accountId
  })

  // populate links in the notification box
  const accountLink = document.querySelector('[data-behavior=notification] a:nth-of-type(1)')
  accountLink.href = accountLink.href + window.accountId
  accountLink.innerText = '@' + window.accountId
  const contractLink = document.querySelector('[data-behavior=notification] a:nth-of-type(2)')
  contractLink.href = contractLink.href + window.contract.contractId
  contractLink.innerText = '@' + window.contract.contractId

  // update with selected networkId
  accountLink.href = accountLink.href.replace('testnet', networkId)
  contractLink.href = contractLink.href.replace('testnet', networkId)

  fetchTasks()
}

// update global currentGreeting variable; update DOM with it
async function fetchTasks() {

  //learn previous todo list
  document.querySelector('#tblTasks').innerHTML = '';
  currentTasks = await contract.getTasksByAccountId({ _accountId: window.accountId })

  console.log(currentTasks);

  currentTasks.forEach((task)=> {
    let id = task.id;
    let author = task.author;
    let content = task.content;
    let accountId = task.accountId;
    let timestamp = task.timestamp;
        timestamp = timestamp / 1000000;
    let isDone = task.isDone;

    if(isDone) {
      document.querySelector('#tblTasks').innerHTML += '<tr><td class="tskID">' + id + '</td><td>' + convertUnixTimeToDate(timestamp) +'</td><td>' + author + '</td><td>'+ content +'</td><td><input type="checkbox" class="isDone" name="isDone" checked></td></tr>'
    }
    else {
      document.querySelector('#tblTasks').innerHTML += '<tr><td class="tskID">' + id + '</td><td>' + convertUnixTimeToDate(timestamp) +'</td><td>' + author + '</td><td>'+ content +'</td><td><input type="checkbox" class="isDone" name="isDone"></td></tr>'
    }
    
  });
}

// `nearInitPromise` gets called on page load
window.nearInitPromise = initContract()
  .then(() => {
    if (window.walletConnection.isSignedIn()) signedInFlow()
    else signedOutFlow()
  })
  .catch(console.error)
