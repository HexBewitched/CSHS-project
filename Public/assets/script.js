const dateInput = document.getElementById("date");
const mileageForm = document.getElementById("mileageForm");
const successMessage = document.getElementById("successMessage");

// Auto-fill today's date
dateInput.valueAsDate = new Date();

mileageForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = {
        name: "TestRunner",
        date: document.getElementById("date").value,
        miles: document.getElementById("miles").value,
        notes: document.getElementById("notes").value
    };

    try {
        await fetch("/submit-mileage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        mileageForm.reset();
        dateInput.valueAsDate = new Date();
        successMessage.style.display = "block";
        /*
        setTimeout(function() {
            successMessage.style.display = "none";
        }, 2500);
        */
       //disable submit btn after 1 use, should have to reopen the form, or add a log another run button for ease
    } catch (error) {
        console.error("Error submitting form:", error);
    }
});
