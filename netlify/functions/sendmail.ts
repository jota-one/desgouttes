import { Handler, HandlerContext, HandlerEvent } from '@netlify/functions'
import sgMail from '@sendgrid/mail'

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const defaultRecipient = process.env.DEFAULT_RECIPIENT
  const defaultSender = process.env.DEFAULT_SENDER
  const debugRecipient = process.env.TEST_EMAIL
  const body = JSON.parse(event.body)
  const msg = {
    to: debugRecipient || body.dest || defaultRecipient,
    from: defaultSender,
    subject: 'Email from the Website www.desgouttes.ch',
    html: `<div>Hello,</div>
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
`,
  }
  const data = await sgMail.send(msg)

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  }
}

export { handler }
