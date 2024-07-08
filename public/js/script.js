(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          let submit = document.querySelectorAll(".submit-btn");
          submit.forEach((btn) => {
            btn.setAttribute("disabled", true);
            btn.innerHTML =
              '<span class="spinner-grow spinner-grow-sm ms-1" role="status" aria-hidden="true"></span><span class=" ms-1 spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span><span class="spinner-grow spinner-grow-sm ms-1" role="status" aria-hidden="true"></span>';
          });
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();
