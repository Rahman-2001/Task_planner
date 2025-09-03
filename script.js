
  let tasks = [];

  window.onload = () => {
    loadTasks();
  };

  function addTask() {
    const title = document.getElementById("task-title").value.trim();
    const desc = document.getElementById("task-desc").value.trim();
    const mention = document.getElementById("task-mention").value.trim();
    const dateTime = document.getElementById("task-datetime").value;
    const deadline = document.getElementById("task-deadline").value;

    if (!title || !desc || !mention || !dateTime || !deadline) return;

    const taskObj = {
      id: Date.now(),
      title,
      desc,
      mention,
      dateTime,
      deadline,
      status: "planning"
    };

    tasks.push(taskObj);
    saveTasks();

    const task = createTaskElement(taskObj);
    document.getElementById("planning").appendChild(task);

    document.getElementById("task-title").value = "";
    document.getElementById("task-desc").value = "";
    document.getElementById("task-mention").value = "";
    document.getElementById("task-datetime").value = "";
    document.getElementById("task-deadline").value = "";
  }

  function createTaskElement(taskObj) {
    const { id, title, desc, mention, dateTime, deadline, status } = taskObj;

    const task = document.createElement("div");
    task.className = "task";
    task.dataset.id = id;

    const titleEl = document.createElement("p");
    titleEl.className = "task-title";
    titleEl.innerHTML = "<span>Title:</span> " + title;

    const descEl = document.createElement("p");
    descEl.className = "task-desc";
    descEl.innerHTML = "<span>Description:</span> " + desc;

    const mentionEl = document.createElement("p");
    mentionEl.className = "task-mention";
    mentionEl.innerHTML = "<span>Mention:</span> " + mention;

    const dateTimeEl = document.createElement("p");
    dateTimeEl.className = "task-datetime";
    dateTimeEl.innerHTML = "<span>Date & Time:</span> " + dateTime;

    const deadlineEl = document.createElement("p");
    deadlineEl.className = "task-deadline";
    deadlineEl.innerHTML = "<span>Deadline:</span> " + deadline;

    const taskedit = document.createElement("div");
    taskedit.className = "taskedit";

    // Edit button only in Planning
    if (status === "planning") {
      const btnEdit = document.createElement("button");
      btnEdit.textContent = "Edit";
      btnEdit.className = "edit-btn";
      btnEdit.onclick = () =>
        toggleEdit(task, titleEl, descEl, mentionEl, dateTimeEl, deadlineEl, btnEdit);
      taskedit.appendChild(btnEdit);
    }

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Delete";
    btnDelete.className = "delete-btn";
    btnDelete.onclick = () => {
      task.remove();
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
    };
    taskedit.appendChild(btnDelete);

    if (status !== "finished") {
      const statusBtn = document.createElement("button");
      statusBtn.className = "status-btn";
      updateStatusButton(statusBtn, task, status);
      taskedit.appendChild(statusBtn);
    }

    task.appendChild(titleEl);
    task.appendChild(descEl);
    task.appendChild(mentionEl);
    task.appendChild(dateTimeEl);
    task.appendChild(deadlineEl);
    task.appendChild(taskedit);

    return task;
  }

  function toggleEdit(task, titleEl, descEl, mentionEl, dateTimeEl, deadlineEl, btnEdit) {
    const isEditing = btnEdit.textContent === "Save";

    const btnDelete = task.querySelector(".delete-btn");
    const statusBtn = task.querySelector(".status-btn");

    if (isEditing) {
      // Save
      const inputTitle = task.querySelector(".edit-title");
      const inputDesc = task.querySelector(".edit-desc");
      const inputMention = task.querySelector(".edit-mention");
      const inputDateTime = task.querySelector(".edit-datetime");
      const inputDeadline = task.querySelector(".edit-deadline");

      const newTitle = inputTitle.value.trim();
      const newDesc = inputDesc.value.trim();
      const newMention = inputMention.value.trim();
      const newDateTime = inputDateTime.value;
      const newDeadline = inputDeadline.value;

      if (newTitle && newDesc && newMention && newDateTime && newDeadline) {
        titleEl.innerHTML = "<span>Title:</span> " + newTitle;
        descEl.innerHTML = "<span>Description:</span> " + newDesc;
        mentionEl.innerHTML = "<span>Mention:</span> " + newMention;
        dateTimeEl.innerHTML = "<span>Date & Time:</span> " + newDateTime;
        deadlineEl.innerHTML = "<span>Deadline:</span> " + newDeadline;

        titleEl.style.display = "block";
        descEl.style.display = "block";
        mentionEl.style.display = "block";
        dateTimeEl.style.display = "block";
        deadlineEl.style.display = "block";

        inputTitle.remove();
        inputDesc.remove();
        inputMention.remove();
        inputDateTime.remove();
        inputDeadline.remove();

        btnEdit.textContent = "Edit";
        btnEdit.className = "edit-btn";

        // Show back delete & move buttons
        if (btnDelete) btnDelete.style.display = "inline-block";
        if (statusBtn) statusBtn.style.display = "inline-block";

        const t = tasks.find(t => t.id === parseInt(task.dataset.id));
        if (t) {
          t.title = newTitle;
          t.desc = newDesc;
          t.mention = newMention;
          t.dateTime = newDateTime;
          t.deadline = newDeadline;
          saveTasks();
        }
      }
    } else {
      // Enter edit mode
      const inputTitle = document.createElement("input");
      inputTitle.type = "text";
      inputTitle.value = titleEl.textContent.replace("Title:", "").trim();
      inputTitle.className = "edit-title";

      const inputDesc = document.createElement("input");
      inputDesc.type = "text";
      inputDesc.value = descEl.textContent.replace("Description:", "").trim();
      inputDesc.className = "edit-desc";

      const inputMention = document.createElement("input");
      inputMention.type = "text";
      inputMention.value = mentionEl.textContent.replace("Mention:", "").trim();
      inputMention.className = "edit-mention";

      const inputDateTime = document.createElement("input");
      inputDateTime.type = "datetime-local";
      inputDateTime.value = dateTimeEl.textContent.replace("Date & Time:", "").trim();
      inputDateTime.className = "edit-datetime";

      const inputDeadline = document.createElement("input");
      inputDeadline.type = "date";
      inputDeadline.value = deadlineEl.textContent.replace("Deadline:", "").trim();
      inputDeadline.className = "edit-deadline";

      titleEl.style.display = "none";
      descEl.style.display = "none";
      mentionEl.style.display = "none";
      dateTimeEl.style.display = "none";
      deadlineEl.style.display = "none";

      task.insertBefore(inputTitle, task.querySelector(".taskedit"));
      task.insertBefore(inputDesc, task.querySelector(".taskedit"));
      task.insertBefore(inputMention, task.querySelector(".taskedit"));
      task.insertBefore(inputDateTime, task.querySelector(".taskedit"));
      task.insertBefore(inputDeadline, task.querySelector(".taskedit"));

      btnEdit.textContent = "Save";
      btnEdit.className = "save-btn";

      // Hide delete & move buttons
      if (btnDelete) btnDelete.style.display = "none";
      if (statusBtn) statusBtn.style.display = "none";
    }
  }

  function updateStatusButton(btn, task, status) {
    if (status === "planning") {
      btn.textContent = "Move to Processing";
      btn.onclick = () => moveTask(task, "processing");
    } else if (status === "processing") {
      btn.textContent = "Move to Completed";
      btn.onclick = () => moveTask(task, "completed");
    } else if (status === "completed") {
      btn.textContent = "Move to Finished";
      btn.onclick = () => moveTask(task, "finished");
    }
  }

  function moveTask(task, newStatus) {
    document.getElementById(newStatus).appendChild(task);
    const t = tasks.find(t => t.id === parseInt(task.dataset.id));
    if (t) {
      t.status = newStatus;
      saveTasks();
    }

    const statusBtn = task.querySelector(".status-btn");
    if (statusBtn) {
      if (newStatus === "finished") {
        statusBtn.remove();
        const editBtn = task.querySelector(".edit-btn");
        if (editBtn) editBtn.remove();
      } else {
        updateStatusButton(statusBtn, task, newStatus);
      }
    }
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      tasks = JSON.parse(stored);
      tasks.forEach(task => {
        const taskEl = createTaskElement(task);
        document.getElementById(task.status).appendChild(taskEl);
      });
    }
  }