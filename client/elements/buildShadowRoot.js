export default (html, elem) => {
  const template = document.createElement('template');
  template.innerHTML = html;
  typeof ShadyCSS !== 'undefined' && ShadyCSS.prepareTemplate(template, elem.localName);

  const shadowRoot = elem.attachShadow({mode: `open`});
  shadowRoot.appendChild(template.content.cloneNode(true), true);

  typeof ShadyCSS !== 'undefined' && ShadyCSS.styleElement(elem);
  return shadowRoot;
}
