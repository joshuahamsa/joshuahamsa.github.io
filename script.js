document.addEventListener("DOMContentLoaded", () => {
  // Update current year in footer
  const yearElements = document.querySelectorAll("#current-year")
  yearElements.forEach((element) => {
    element.textContent = new Date().getFullYear()
  })

  // Only run the typing effect on the home page
  const introText = document.getElementById("intro-text")
  if (introText) {
    const commands = [
      { command: "whoami", response: "Joshua Hamsa" },
      { command: "pwd", response: "/home/hamsa" },
      { command: "cat bio.txt", response: "Builder, creator, and continuous learner." },
    ]

    let currentCommandIndex = 0
    let isTyping = false

    function typeNextCommand() {
      if (currentCommandIndex >= commands.length) {
        // Add `clear` command and response
        const clearCmd = document.createElement("div")
        clearCmd.innerHTML = `<span class="prompt">$</span> <span class="command">clear</span>`
        introText.appendChild(clearCmd)

        setTimeout(() => {
          introText.innerHTML = "" // Now clear screen like a real terminal
          currentCommandIndex = 0
          typeNextCommand()
        }, 500)

        return
      }

      const commandData = commands[currentCommandIndex]
      const commandElement = document.createElement("div")
      commandElement.innerHTML = `<span class="prompt">$</span> <span class="command"></span>`
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
          setTimeout(() => {
            const responseElement = document.createElement("div")
            responseElement.className = "response"
            responseElement.textContent = commandData.response
            introText.appendChild(responseElement)

            // Add cursor for next command
            const cursorElement = document.createElement("div")
            cursorElement.innerHTML = `<span class="prompt">$</span> <span class="cursor"></span>`
            introText.appendChild(cursorElement)

            currentCommandIndex++

            // Type next command after delay
            setTimeout(() => {
              introText.removeChild(cursorElement)
              typeNextCommand()
            }, 2000)
          }, 500)
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

  // Add smooth scrolling for navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: "smooth",
        })
      }
    })
  })
})
