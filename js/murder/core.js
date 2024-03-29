async function checkAnswer() {
    const message = document.getElementById("answer").value;
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    if (hashHex === "86f7e437faa5a7fce15d1ddcb9eaeaea377667b8") {
        alert("Congratulations, you caught the killer!");
    } else {
        alert("Sorry, that's not correct.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("checkAnswer").addEventListener("click", checkAnswer);
    
    const decoder = new TextDecoder();
    const url = new Uint8Array([67,108,117,101,32,52,32,111,102,32,55,58,32,84,104,101,32,111,119,110,101,114,32,111,102,32,116,104,101,32,99,97,110,100,108,101,115,116,105,99,107,32,97,114,114,105,118,101,100,32,98,101,102,111,114,101,32,116,104,101,32,111,119,110,101,114,32,111,102,32,116,104,101,32,98,105,99,121,99,108,101,46]);;
    fetch(decoder.decode(url))
        .then(resp => {
            if (!resp.ok) {
                const x = new Uint8Array([67,108,117,101,32,53,32,111,102,32,55,58,32,67,104,97,114,108,105,101,32,97,114,114,105,118,101,100,32,97,102,116,101,114,32,116,104,101,32,111,119,110,101,114,32,111,102,32,116,104,101,32,112,97,114,114,111,116,46]);;
                throw new Error(decoder.decode(x));
            }
        });
    const x = new Uint8Array([67,108,117,101,32,54,32,111,102,32,55,58,32,67,104,97,114,108,105,101,32,97,114,114,105,118,101,100,32,115,101,99,111,110,100,32,119,105,116,104,32,104,105,115,32,103,111,108,100,102,105,115,104,46]);;
    sessionStorage.setItem("clue", decoder.decode(x));
}, false);