Back up your working n8n workflow.
Deploy the n8n backend using free hosting.
Restore the workflow and reconnect its credentials.
Test the public Chat Trigger webhook.
Deploy your Vite frontend.
Connect the frontend to the live backend and test persistent chat sessions.


### Chat Files uplaod
    Turn on Allow File Uploads in the Chat Trigger and choose the allowed file types.
The upload only reaches the workflow as binary data. The agent won’t read it unless you add a step for that.
For PDFs or text, add an Extract From File node before the agent.
For images, check the agent’s option to pass binary images through.
To attach a file to an outgoing email, the Gmail send node must use that binary field.