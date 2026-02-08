// 1. Select ALL forms on the page
const forms = document.querySelectorAll("form")

// 2. Loop through each form found
forms.forEach(form => {
  
  // 3. Add the event listener to THIS specific form
  form.addEventListener("change", function () {
    
    // 4. Find the button ONLY inside this specific form
    const updateBtn = form.querySelector("button")
    
    // 5. Enable the button
    updateBtn.removeAttribute("disabled")
  })
  
})





// const form = document.querySelector("#updateForm")
//     form.addEventListener("change", function () {
//       const updateBtn = document.querySelector("button")
//       updateBtn.removeAttribute("disabled")
//     })