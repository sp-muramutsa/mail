## PROJECT OVERVIEW
This project implements a single-page app email client using JavaScript, HTML, and CSS. The application allows users to send, receive, view, archive, unarchive, and reply to emails.

## IMPLEMENTATION DETAILS
1. **Sending Mail**: JavaScript code is added to handle sending emails when the user submits the email composition form.
2. **Mailbox**: The application queries the API for the latest emails in the Inbox, Sent, or Archive mailbox when visited by the user.
3. **Viewing Email**: Users can click on an email to view its content, and the email is marked as read.
4. **Archive and Unarchive**: Users can archive or unarchive emails from the Inbox or Archive mailbox.
5. **Replying to Emails**: Users can reply to emails, with the composition form pre-filled with relevant details.

## FEATURES

1. **Sending Mail**
   - Emails are sent via a POST request to `/emails` with recipient, subject, and body details.
   - Upon sending, the sent mailbox is loaded.

2. **Mailbox**
   - The appropriate mailbox (Inbox, Sent, or Archive) is loaded when the user visits it.
   - Emails are displayed with sender, subject, and timestamp.
   - Read and unread emails are visually differentiated.

3. **Viewing Email**
   - Clicking on an email displays its content, including sender, recipients, subject, timestamp, and body.
   - Emails are marked as read when viewed.

4. **Archive and Unarchive**
   - Users can archive or unarchive emails from the Inbox or Archive mailbox.
   - Archiving moves emails to the Archive mailbox, while unarchiving moves them back to the Inbox.

5. **Replying to Emails**
   - Users can reply to emails, with the composition form pre-filled with relevant details.
   - The subject line is prefixed with "Re: " if not already present.

