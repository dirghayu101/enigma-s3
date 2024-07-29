document.getElementById('blue-button').style.display = "none";
document
  .getElementById("snippetForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    
    const commandInput = document.getElementById("command");
    const summaryInput = document.getElementById("summary");
    const tagsInput = document.getElementById("tags");

    const command = commandInput.value.trim();
    const summary = summaryInput.value.trim() || "";
    const tags = tagsInput.value
      ? tagsInput.value
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "")
      : [];

    const validationMessageBlock = document.querySelector(".invalid-feedback");

    
  // Validate command
    if (!command) {
      console.error("Validation Error.");
      validationMessageBlock.textContent = "Command is required.";
      validationMessageBlock.classList.remove("invalid-feedback");
      validationMessageBlock.classList.add("text-danger");
      return;
    }

    // Clear validation message
    validationMessageBlock.classList.remove("text-danger");
    validationMessageBlock.classList.add("invalid-feedback");
    validationMessageBlock.textContent = "";

    try {
      const enigmaUser = localStorage.getItem("enigmaUser");
      if (!enigmaUser) {
        throw new Error("User not found in localStorage");
      }
      const enigmaUserObj = JSON.parse(enigmaUser);
      let { idToken, email } = enigmaUserObj;
      if (!idToken && !idToken.jwtToken && email) {
        throw new Error("Invalid user token");
      }
      const bodyObj = { email, command, summary, tags };
      const bodyString = JSON.stringify(bodyObj);
      idToken = idToken.jwtToken;

      fetch("https://s403743k2b.execute-api.us-east-1.amazonaws.com/test", {
        method: "POST",
        headers: {
          Accept: "*/*",
          Authorization: idToken,
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: bodyString,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          insertData(data);
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred: ", error);
        }); 
    } catch (error) {
      console.error("Error:", error);
      validationMessageBlock.textContent =
        "An error occurred. Please try again.";
      validationMessageBlock.classList.remove("invalid-feedback");
      validationMessageBlock.classList.add("text-danger");
    }
  });

const insertData = (data) => {
  document.getElementById('blue-button').style.display = "";
  let { snippetData: snippet } = JSON.parse(data.body);
  console.log("JSON parsed result: ", Object.keys(snippet));
  console.log("Received data keys:");
  document.getElementById("snippetForm").style.display = "none";
  const container = document.getElementById("snippet-container");
  container.innerHTML = "";
  const snippetDiv = document.createElement("div");
  snippetDiv.classList.add("snippet");
  const commandDiv = document.createElement("div");
  commandDiv.classList.add("snippet-command");
  commandDiv.textContent = snippet.command;
  const copyButton = document.createElement("button");
  copyButton.classList.add("copy-button");
  copyButton.textContent = "Copy";
  copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(snippet.command);
    alert("Command copied to clipboard!");
  });
  const summaryDiv = document.createElement("div");
  summaryDiv.classList.add("snippet-summary");
  summaryDiv.textContent = snippet.summary;
  const tagsDiv = document.createElement("div");
  tagsDiv.classList.add("snippet-tags");
  snippet.tagArray.forEach((tag) => {
    const tagSpan = document.createElement("span");
    tagSpan.textContent = tag;
    tagsDiv.appendChild(tagSpan);
  });
  commandDiv.appendChild(copyButton);
  snippetDiv.appendChild(commandDiv);
  snippetDiv.appendChild(summaryDiv);
  snippetDiv.appendChild(tagsDiv);
  container.appendChild(snippetDiv);
};