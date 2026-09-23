document.addEventListener("DOMContentLoaded", () => {
  // Update current year in footer
  const yearElements = document.querySelectorAll("#current-year")
  yearElements.forEach((element) => {
    element.textContent = new Date().getFullYear()
  })

  // Starship's time sticker: stamp prompts with the current HH:MM
  function currentTime() {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
  }

  document.querySelectorAll(".prompt-time").forEach((element) => {
    element.textContent = currentTime()
  })

  // Only run the typing effect on the home page
  const introText = document.getElementById("intro-text")
  if (introText) {
    // Set by `export XRPL_NET=mainnet`; adds the XRPL MAINNET sticker before ❯
    let onMainnet = false

    // Starship prompt (LFG config), rendered fresh so the time sticker stays current
    function prompt() {
      const network = onMainnet ? `<span class="sticker sticker--mainnet">&#xf071; XRPL MAINNET</span> ` : ""
      return `<span class="prompt"><span class="prompt-line"><span class="sticker sticker--lfg">LFG!</span> <span class="sticker sticker--dir">~</span> <span class="sticker sticker--time">&#xf017; ${currentTime()}</span></span>${network}<span class="prompt-char">❯</span></span>`
    }

    const commands = [
      { command: "whoami", response: "Joshua Hamsa" },
      { command: "pwd", response: "/home/hamsa" },
      { command: "echo $SHELL", response: "/bin/zsh" },
      { command: "cat bio.txt", response: "Builder, creator, and continuous learner." },
      { command: "export XRPL_NET=mainnet", response: null },
      { command: "clear", response: null }
    ]

    let currentCommandIndex = 0
    let isTyping = false

    function typeNextCommand() {
      if (currentCommandIndex >= commands.length) {
        return
      }

      const commandData = commands[currentCommandIndex]
      const commandElement = document.createElement("div")
      commandElement.innerHTML = `${prompt()} <span class="command"></span>`
      const commandSpan = commandElement.querySelector(".command")

      introText.appendChild(commandElement)

      let i = 0
      isTyping = true

      function typeCommand() {
        if (i < commandData.command.length) {
          commandSpan.textContent += commandData.command.charAt(i)
          i++
          setTimeout(typeCommand, 100)
        } else {
          isTyping = false

          if (commandData.command !== "clear") {
            setTimeout(() => {
              if (commandData.command.startsWith("export XRPL_NET=")) {
                onMainnet = true
              }

              if (commandData.response !== null) {
                const responseElement = document.createElement("div")
                responseElement.className = "response"
                responseElement.textContent = commandData.response
                introText.appendChild(responseElement)
              } else {
                // No output: keep Starship's blank line before the next prompt
                commandElement.classList.add("no-output")
              }

              const cursorElement = document.createElement("div")
              cursorElement.innerHTML = `${prompt()} <span class="cursor"></span>`
              introText.appendChild(cursorElement)

              currentCommandIndex++

              setTimeout(() => {
                introText.removeChild(cursorElement)
                typeNextCommand()
              }, 2000)
            }, 500)
          } else {
            // "clear" resets the screen and starts the loop over
            setTimeout(() => {
              currentCommandIndex = 0
              onMainnet = false
              introText.innerHTML = ""
              typeNextCommand()
            }, 500)
          }
        }
      }

      typeCommand()
    }

    // Start typing effect after a short delay
    setTimeout(() => {
      introText.innerHTML = "" // Clear initial content
      typeNextCommand()
    }, 1000)
  }
})