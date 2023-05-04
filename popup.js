let scrapeEmails=document.getElementById('scrapeEmails');

let list=document.getElementById('emaillist');
//handler to recieve emails from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    //get emails
    let emails=request.emails;
    // alert(emails);
    
    //display emails on popup
    if( emails== null || emails.length==0 )
    {
        //no emails
        let li=document.createElement('li');
        li.innerText= "No emails found";
        list.appendChild(li);
    }
    else {
        //display emails
        emails.forEach((email)=> {
            let li=document.createElement('li');
            li.innerText= email;
            list.appendChild(li);
        })
    }
})

//button's click event listener
scrapeEmails.addEventListener("click",async ()=>{
    //Get current active tab
    let [tab]= await chrome.tabs.query({active:true, currentWindow: true});

    //execute script to parse emails on page
    chrome.scripting.executeScript({
        target: {tabId : tab.id},
        func: scrapeEmailsFromPage,
    });
})

//fuction to scrape emails
function scrapeEmailsFromPage(){
    //regex to parse emails from html code
const emailRegEx= /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/gim;


//parse emails from the html of the page
let emails= document.body.innerHTML.match(emailRegEx);
// alert(emails)
//send emails to popup
chrome.runtime.sendMessage({emails}); 
}