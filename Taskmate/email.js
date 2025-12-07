(function () {
  // Storage Key (Must match app.js)
  const LS_KEY = "taskmate.tasks.v1";
  const tasksContainer = document.getElementById("tasks");

  console.log("📧 Email Module Loaded (Simulation Mode)");

  if (tasksContainer) {
    tasksContainer.addEventListener("click", (e) => {
      // Check if the clicked element is an email button
      if (e.target.closest('[data-action="email"]')) {
        const btn = e.target.closest('[data-action="email"]');
        const taskId = btn.dataset.id;
        
        simulateEmailSend(taskId, btn);
      }
    });
  }

  async function simulateEmailSend(id, btn) {
    // 1. Get the task data
    const tasks = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      alert("Task not found.");
      return;
    }

    // 2. UI Feedback: "Sending..."
    const originalText = btn.textContent;
    btn.textContent = "Sending...";
    btn.disabled = true;
    btn.style.opacity = "0.7";
    btn.style.cursor = "wait";

    // 3. Prepare the Mock Data
    const emailPayload = {
      to: "User (Simulation)",
      subject: `Task Reminder: ${task.title}`,
      body: `
        Title: ${task.title}
        Priority: ${task.priority}
        Due: ${task.due ? new Date(task.due).toLocaleString() : "No date"}
        Notes: ${task.notes || "None"}
      `
    };

    // 4. Simulate Network Delay (1.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 5. Log to Console instead of sending
    console.group("📨 Mock Email Sent");
    console.log("Payload:", emailPayload);
    console.groupEnd();

    // 6. UI Feedback: "Sent!"
    btn.textContent = "Sent!";
    
    // Check if a success color variable exists, else default to green
    btn.style.color = getComputedStyle(document.body).getPropertyValue('--success') || 'green';
    btn.style.borderColor = btn.style.color;

    // 7. Reset Button after 2 seconds
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.opacity = "1";
      btn.style.cursor = "pointer";
      btn.style.color = "";
      btn.style.borderColor = "";
    }, 2000);
  }
})();