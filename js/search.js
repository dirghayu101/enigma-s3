function validateAndSplitSearchTerm(searchTerm) {
  if (!searchTerm || searchTerm.trim() === "") {
    throw new Error("Invalid search term");
  }
  return searchTerm.trim().split(/\s+/);
}

const insertData = (data) => {
    document.getElementById('search-form').style.display = "none";
    document.getElementById('blue-button').style.display = "";
    console.log("Data value received: ", data);

    const container = document.getElementById("snippet-container");
    container.innerHTML = ""; // Clear the container once

    data.forEach((snippet) => {
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
    });
};
async function fetchData(searchTerm, userId, idToken) {
  const url = new URL("https://s403743k2b.execute-api.us-east-1.amazonaws.com/test/");
  url.search = new URLSearchParams({ searchTerm, userId});

  console.log
  const headers = new Headers({
    Accept: "*/*",
    Authorization: idToken,
    "Content-Type": "application/json; charset=UTF-8"
  });

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const {result} = await response.json();
    insertData(result)
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

document
  .querySelector(".search-bar")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("Search processing...")
    const searchTerm = event.target.search.value;
    console.log("Term received: ", searchTerm)
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
      if (!searchTerm || searchTerm.trim() === "") {
        throw new Error("Invalid search term");
      }
      idToken = idToken.jwtToken;
      fetchData(searchTerm, email, idToken);
    } catch (error) {
      console.error("Error processing search term:", error);
    }
  });
