import 'regenerator-runtime/runtime'

import { initContract, login, logout } from './utils'

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

// global variable used throughout
let currentGreeting

const submitButton = document.querySelector('form button')

document.querySelector('form').onsubmit = async (event) => {
  event.preventDefault()

  // get elements from the form using their id attribute
  const { fieldset, author, content } = event.target.elements

  // disable the form while the value gets updated on-chain
  fieldset.disabled = true

  try {
    // make an update call to the smart contract
    await window.contract.addNewTask({
      // pass the value that the user entered in the greeting field
      author: author.value,
      content: content.value
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
    let tasks = [];
    let tblTask = document.querySelector('#tblTasks').innerHTML;
    tasks = await contract.getTasksByAccountId({ _accountId: window.accountId })
    console.log(tasks); 

    tasks.forEach((task)=> {
      let id = task.id;
      let author = task.author;
      let content = task.content;
      let accountId = task.accountId;
      let timestamp = task.timestamp;
      let isDone

      document.querySelector('#tblTasks').innerHTML += '<tr><td>' + id + '</td><td>' + timestamp +'</td><td>' + author + '</td><td>'+ content +'</td><td>' + isDone + '</td></tr>';

    });

    //document.querySelector('#tblTasks').innerHTML += '<tr><td>Thang</td><td>Doe</td><td>john@example.com</td><td></td><td></td></tr>';
  }

  // disable the save button, since it now matches the persisted value
  submitButton.disabled = true

  // update the greeting in the UI
  //await fetchGreeting()

}

document.querySelector('input#content').oninput = (event) => {

  if (event.target.value !== '') {
    submitButton.disabled = false
  } else {
    submitButton.disabled = true
  }
}

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

  //fetchGreeting()
}

// update global currentGreeting variable; update DOM with it
// async function fetchGreeting() {
//   currentGreeting = await contract.getGreeting({ accountId: window.accountId })
//   document.querySelectorAll('[data-behavior=greeting]').forEach(el => {
//     // set divs, spans, etc
//     el.innerText = currentGreeting

//     // set input elements
//     el.value = currentGreeting
//   })
// }

// `nearInitPromise` gets called on page load
window.nearInitPromise = initContract()
  .then(() => {
    if (window.walletConnection.isSignedIn()) signedInFlow()
    else signedOutFlow()
  })
  .catch(console.error)
