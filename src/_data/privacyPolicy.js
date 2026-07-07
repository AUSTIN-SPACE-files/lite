// Shared privacy-policy boilerplate. businessName / privacyContactEmail /
// policyLastUpdated are deliberately NOT interpolated here — they stay as
// live {{ }} expressions in privacy-content.njk so Nunjucks autoescape
// handles them (this data is rendered as HTML via `| safe`, so anything
// baked in here would bypass escaping).
export default {
  sections: [
    {
      heading: "What we collect",
      body: `<p>We only collect personal information when you choose to send us a message using the contact form on this page. That form asks for your name, your email address, and the message you write.</p>
<p>We do not use tracking cookies, analytics, or advertising technology on this site. We do not build profiles, and we do not collect anything about you in the background as you browse.</p>`,
    },
    {
      heading: "Why we collect it, and our lawful basis",
      body: `<p>We use the information you submit for one purpose only: to read your enquiry and reply to it. Our lawful basis under UK GDPR is legitimate interests — specifically, responding to a message you have chosen to send us. You are never required to use the form; you can contact us by phone or email instead if you prefer.</p>`,
    },
    {
      heading: "How your message reaches us",
      body: `<p>When you submit the form, your message is processed by a small number of service providers acting on our behalf. Cloudflare hosts this website and runs the form-handling service, and provides the anti-spam check (Cloudflare Turnstile) that protects the form from automated abuse. Resend delivers your message to our inbox as an email.</p>
<p>These providers process your information only to pass your message to us. They act as our processors and do not use your enquiry for their own purposes.</p>`,
    },
    {
      heading: "How long we keep it",
      body: `<p>We keep enquiry messages for up to 12 months, after which they are deleted. If your enquiry leads to an ongoing relationship, any information we retain beyond that is covered separately by the records we keep for that purpose.</p>`,
    },
  ],
  // "Your rights" is split out of `sections` because its middle paragraph
  // contains live values (privacyContactEmail, businessName) that must be
  // rendered by the template, not baked into this static string.
  rightsIntro: `<p>Under UK data protection law you have the right to ask us to access the personal information we hold about you, correct it if it is wrong, delete it, and object to or restrict how we use it.</p>`,
  rightsComplaint: `<p>You also have the right to complain to the UK's data protection regulator, the Information Commissioner's Office (ICO), at <a href="https://ico.org.uk">ico.org.uk</a>.</p>`,
  changes: `<p>If we change how we handle personal information, we will update this notice on this page.</p>`,
};
