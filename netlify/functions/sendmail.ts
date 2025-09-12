import type { Handler, HandlerContext, HandlerEvent } from '@netlify/functions';
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo';

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
  const transactionalEmailsApi = new TransactionalEmailsApi();
  transactionalEmailsApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.SENDGRID_API_KEY || '');

  async function sendTransactionalEmail(htmlContent: string, sender: { email: string }, to: { email: string }[]) {
    try {
      const result = await transactionalEmailsApi.sendTransacEmail({
        to,
        subject: 'Email from the Website www.desgouttes.ch',
        htmlContent,
        sender,
      });
      console.log('Email sent! Message ID:', result.body.messageId);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }

  const defaultRecipient = process.env.DEFAULT_RECIPIENT
  const defaultSender = process.env.DEFAULT_SENDER || ''
  const debugRecipient = process.env.TEST_EMAIL
  const body = JSON.parse(event.body || '{}')
  const sender = { email: defaultSender }
  const recipient = [{ email: debugRecipient || body.dest || defaultRecipient }];
  const htmlContent = `<div>Hello,</div>
<div>&nbsp;</div>
<div>This is a message sent from desgouttes.ch website contact form:</div>
<div>&nbsp;</div>
<ul>
\t<li>Sender: ${body.name}</li>
\t<li>Email: ${body.email}</li>
\t<li>Phone: ${body.phone}</li>
</ul>

<div>The message:</div>
<hr />
<div>&nbsp;</div>
<div>${body.message.replaceAll('\n', '<br/>')}</div>
<hr />
<div>&nbsp;</div>

<div>Best regards,</div>

<div>Des Gouttes Website</div>
`

  await sendTransactionalEmail(htmlContent, sender, recipient)

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  }
}

export { handler }
