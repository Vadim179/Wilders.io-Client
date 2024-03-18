export function createChatGUI() {
  const chatBox = document.createElement("div");

  chatBox.classList.add("chat-box", "animate__animated", "animate__bounceIn");
  chatBox.style.display = "none";

  const chatInput = document.createElement("input");

  chatInput.classList.add("chat-input");
  chatInput.placeholder = "Type a message...";

  chatBox.appendChild(chatInput);
  document.body.appendChild(chatBox);
  return { chatBox, chatInput };
}
