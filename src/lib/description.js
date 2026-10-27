import DOMPurify from 'dompurify'

let hooked = false

function setupHook() {
  if (hooked) return
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      node.setAttribute('target', '_blank')
      node.setAttribute('rel', 'noopener noreferrer')
    }
  })
  hooked = true
}

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Turns a stored description (HTML or plain text) into safe HTML
export function descriptionToHtml(raw) {
  if (!raw) return ''
  setupHook()
  let text = String(raw)

  // Some sources store HTML as escaped text (&lt;p&gt;); turn it back
  if (/&lt;\/?[a-z]/i.test(text)) {
    const box = document.createElement('textarea')
    box.innerHTML = text
    text = box.value
  }

  if (/<\/?[a-z][\s\S]*?>/i.test(text)) {
    return DOMPurify.sanitize(text, {
      ALLOWED_TAGS: [
        'p', 'br', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'u',
        'h1', 'h2', 'h3', 'h4', 'a', 'div', 'span', 'blockquote',
      ],
      ALLOWED_ATTR: ['href'],
    })
  }

  // Plain text: blank lines become paragraphs
  return text
    .split(/\n{2,}/)
    .map((p) => `<p>${escapeHtml(p.trim()).replace(/\n/g, '<br>')}</p>`)
    .join('')
}