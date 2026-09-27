const fs = require('fs');
let file = './src/pages/LoginPage.css';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\.login-page__submit \{[\s\S]*?\}/, `.login-page__submit {
  position: relative;
  width: 100%;
  height: 40px;
  padding: 0 16px;
  background: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 6px;
  color: #000000;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2em;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s ease;
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    0 4px 12px rgba(0, 0, 0, 0.3);
}`);

content = content.replace(/\.login-page__submit:hover:not\(:disabled\) \{[\s\S]*?\}/, `.login-page__submit:hover:not(:disabled) {
  background: #000000;
  border-color: #ffffff;
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 6px 20px rgba(255, 255, 255, 0.15);
}`);

content = content.replace(/\.login-page__submit:hover:not\(:disabled\) \.login-page__submit-text \{[\s\S]*?\}/, `.login-page__submit:hover:not(:disabled) .login-page__submit-text {
  color: #ffffff;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}`);

fs.writeFileSync(file, content, 'utf8');
console.log('Done');
