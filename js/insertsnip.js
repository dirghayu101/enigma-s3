document
  .getElementById("snippetForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const commandInput = document.getElementById("command");
    const summaryInput = document.getElementById("summary");
    const tagsInput = document.getElementById("tags");

    const command = commandInput.value.trim();
    const summary = summaryInput.value.trim() || "";
    const tags =
      tagsInput.value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "") || [];

    const validationMessageBlock = document.querySelector(".invalid-feedback");

    // Validate command
    if (!command) {
      console.error("Validation Error.");
      validationMessageBlock.textContent = "Command is required.";
      validationMessageBlock.classList.remove("invalid-feedback");
      validationMessageBlock.classList.add("text-danger");
      return;
    }

    const bodyObj = {command, summary, tagArray:tags}
    const bodyString = JSON.stringify(bodyObj)
    // Clear validation message
    validationMessageBlock.classList.remove("text-danger");
    validationMessageBlock.classList.add("invalid-feedback");
    validationMessageBlock.textContent = "Valid input.";

    const requestPayload = {
      httpMethod: "POST",
      headers: {
        Accept: "*/*",
        Authorization: "eyJraWQiOiJLTzRVMWZs",
        "content-type": "application/json; charset=UTF-8"
      },
      queryStringParameters: null,
      pathParameters: null,
      requestContext: {
        authorizer: {
          claims: {
            "cognito:email": "dirghayujoshi48@gmail.com"
          }
        }
      },
      body: bodyString,
    };

    console.log(requestPayload.body)

    fetch("https://8ylvbtirl3.execute-api.us-east-1.amazonaws.com/test/enigma", {
      method: "POST",
      headers: {
        "Accept": "*/*",
        "Authorization": "eyJraWQiOiJLTzRVMWZs",
        "content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(requestPayload)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
