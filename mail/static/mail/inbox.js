document.addEventListener('DOMContentLoaded', function() 
{
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');

  // Add Event Listener to trigger the send email function when the compose form is submitted
  document.querySelector('#compose-form').addEventListener('submit', send_email);
});

function compose_email() 
{

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

// Track current mailbox
let current_mailbox = '';
function load_mailbox(mailbox) 
{
  
  // Update current mailbox
  current_mailbox = mailbox;
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Get all the emails in that inbox
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then( emails => {
    // Display each email in its own box: sender, subject, timestamp
    emails.forEach(email => 
    {
      const email_div = document.createElement('div');
      email_div.innerHTML = `
        <tr>
          <td>${email.sender}</td>
          <td>${email.subject}</td>
          <td>${email.timestamp}</td>
        </tr>
        <hr>
      `;

      if (!email.read)
      {
        email_div.style.backgroundColor = 'lightgray';
      }

      email_div.addEventListener('click', () => view_email(email.id));

      document.querySelector('#emails-view').append(email_div);
    })
  });
}

function send_email(event) 
{
  // console.log("Send Email function opened");
  event.preventDefault(); // Prevent default submission and unnecessary submission

  // Capture form submission
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;


  // Send email to backend server via POST request
  fetch('/emails', 
  {
    method: 'POST',
    body : JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json ())
  .then(result => {
    console.log(result);

  // Success or Failure
  // Load Sent mailbox
  if (!result.error)
  {
    load_mailbox('sent');
  }
  
  else 
  {
    alert(result.error);
  }
  })
  .catch( error => 
  {
    console.error('Error:', error);
    alert('An error occured while sending email. Please try again.');
  }); 
}

function view_email(email_id) 
{
  // Change email status to read
  fetch(`/emails/${email_id}`, 
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'read': true})
  })
  .then(response => 
    {
    if (response.ok) 
    {
      // Fetch and display the email details
      return fetch(`/emails/${email_id}`);
    } 
    
    else 
    {
      throw new Error('Failed to mark email as read');
    }
  })
  .then(response => response.json())
  .then(email => {
    // Show the Email view
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#email-view').style.display = 'block';
    document.querySelector('#email-view').innerHTML = `
      <h3>${email.subject}</h3>
      <p><strong>From:</strong> ${email.sender}</p>
      <p><strong>To:</strong> ${email.recipients.join(', ')}</p>
      <p><strong>Sent on:</strong> ${email.timestamp}</p>
      <hr>
      <p>${email.body}</p>
    `;

    // Conditionally show the Archive/Unarchive button
    const archive_or_unarchive_div = document.createElement('div');
    if (current_mailbox == 'inbox')
    {
      const archive_button = document.createElement('button');
      archive_button.innerHTML = 'Archive';
      archive_button.addEventListener('click', () => archive_or_unarchive_email(email_id, false));
      archive_or_unarchive_div.appendChild(archive_button);

    }

    else if (current_mailbox = 'archived')
    {
      const unarchive_button = document.createElement('button');
      unarchive_button.innerHTML = 'Unarchive';
      unarchive_button.addEventListener('click', () => archive_or_unarchive_email(email_id));
      archive_or_unarchive_div.appendChild(unarchive_button);
    }

    document.querySelector('#email-view').appendChild(archive_or_unarchive_div);
  })
}

function archive_or_unarchive_email(email_id, archive_status)
{
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => 
    {
      // Change the archive status
      const new_archive_status = !email.archived;

      return fetch(`/emails/${email_id}`, 
      {
        method: 'PUT',
        body: JSON.stringify({'archived': new_archive_status})
      });
    })
    .then (response => 
      {
        if(!response.ok) 
        {
          throw new Error('Failed to update archive status');
        }

        // Reload to the appropiate mailbox
        if (current_mailbox == 'inbox')
        {
          load_mailbox('archive');
        }

        else
        {
          load_mailbox('inbox');
        }
      })
}




