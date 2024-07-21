document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("task-form");  // Element formularza do dodawania zadañ
    const taskInput = document.getElementById("task-input"); // Pole wprowadzania nazwy zadania
    const dateInput = document.getElementById("date-input"); // Pole wprowadzania daty zadania
    const statusInput = document.getElementById("status-input"); // Lista rozwijana dla statusu zadania
    const taskList = document.getElementById("task-list"); // Element UL do przechowywania listy zadañ
    const filterInput = document.getElementById("filter-input"); // Pole wejœciowe do filtrowania zadañ

   // Zdarzenia dla przes³ania formularza w celu dodania nowego zadania
    taskForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Zapobieganie normalnemu przesy³aniu formularza
        addTask(taskInput.value, dateInput.value, statusInput.value); //  funkcja addTask
        taskInput.value = ""; // Wyczyœæ pole wprowadzania zadania
        dateInput.value = ""; // Wyczyœæ pole wprowadzania daty
        statusInput.value = "Do zrobienia"; // Zresetuj listê rozwijan¹ statusu
    });

    // Zdarzenie dla przycisków sortowania
    document.getElementById("sort-asc").addEventListener("click", () => sortTasks("asc"));
    document.getElementById("sort-desc").addEventListener("click", () => sortTasks("desc"));
    document.getElementById("sort-date-asc").addEventListener("click", () => sortTasksByDate("asc"));
    document.getElementById("sort-date-desc").addEventListener("click", () => sortTasksByDate("desc"));
    document.getElementById("download-pdf").addEventListener("click", () => downloadPDF());

    // Zdarzenie dla zadañ filtrowania
    filterInput.addEventListener("keyup", () => filterTasks(filterInput.value));

    // Funkcja dodaj¹ca nowe zadanie
    function addTask(task, date, status) {
        const li = document.createElement("li"); // Tworzenie nowego elementu listy
        li.innerHTML = `
            <span>${task}</span>
            <span>${date}</span>
            <span>${status}</span>
            <button class="edit-button">Edytuj</button>
            <button class="delete-button">Usun</button>
        `;
        taskList.appendChild(li); // Dodaj nowe zadanie do listy

       // Zdarzenie do usuwania zadania
        li.querySelector(".delete-button").addEventListener("click", () => {
            taskList.removeChild(li); // Usuñ zadanie z listy
        });

        // Event listener for editing a task
        li.querySelector(".edit-button").addEventListener("click", () => {
            taskInput.value = task; // Wype³nij pola wejœciowe szczegó³ami bie¿¹cego zadania.
            dateInput.value = date;
            statusInput.value = status;
            taskList.removeChild(li); //Usuniêcie bie¿¹cego zadania z listy
        });
    }

    // Funkcja sortowania zadañ alfabetycznie
    function sortTasks(order) {
        const tasks = Array.from(taskList.getElementsByTagName("li")); // Konwersja elementów listy do tablicy
        tasks.sort((a, b) => {
            const taskA = a.getElementsByTagName("span")[0].innerText.toLowerCase();
            const taskB = b.getElementsByTagName("span")[0].innerText.toLowerCase();
            if (order === "asc") {
                return taskA < taskB ? -1 : taskA > taskB ? 1 : 0;
            } else {
                return taskA > taskB ? -1 : taskA < taskB ? 1 : 0;
            }
        });
        taskList.innerHTML = ""; // Wyczyœæ bie¿¹c¹ listê
        tasks.forEach((task) => taskList.appendChild(task)); // Dodaj posortowane zadania
    }

   // Funkcja sortowania zadañ wed³ug daty
    function sortTasksByDate(order) {
        const tasks = Array.from(taskList.getElementsByTagName("li")); // Konwersja elementów listy do tablicy
        tasks.sort((a, b) => {
            const dateA = new Date(a.getElementsByTagName("span")[1].innerText);
            const dateB = new Date(b.getElementsByTagName("span")[1].innerText);
            return order === "asc" ? dateA - dateB : dateB - dateA;
        });
        taskList.innerHTML = ""; // Wyczyœæ bie¿¹c¹ listê
        tasks.forEach((task) => taskList.appendChild(task)); // Dodaj posortowane zadania
    }

    //Funkcja filtrowania zadañ na podstawie zapytania
    function filterTasks(query) {
        const tasks = Array.from(taskList.getElementsByTagName("li")); // Konwersja elementów listy do tablicy
        tasks.forEach((task) => {
            const taskText = task.getElementsByTagName("span")[0].innerText.toLowerCase();
            if (taskText.includes(query.toLowerCase())) {
                task.style.display = ""; // Poka¿ zadanie, jeœli pasuje do zapytania
            } else {
                task.style.display = "none"; // Ukryj zadanie, jeœli nie pasuje do zapytania
            }
        });
    }

     //Funkcja pobierania listy zadañ w formacie PDF
    function downloadPDF() {
        const { jsPDF } = window.jspdf; // Import jsPDF
        const doc = new jsPDF(); // Tworzenie nowego dokumentu jsPDF
        const tasks = Array.from(taskList.getElementsByTagName("li")); // Konwersja elementów listy do tablicy

        // Ustawienia nag³ówka
        doc.setFontSize(18);
        doc.text("Lista zadañ", 105, 20, null, null, "center");

        // Ustawienia kolumn
        const columns = ["Zadanie", "Data", "Status"];
        const columnPositions = [20, 90, 150];

        // Rysowanie nag³ówków kolumn
        doc.setFontSize(12);
        columns.forEach((column, index) => {
            doc.text(column, columnPositions[index], 30);
        });

        // Rysowanie linii oddzielaj¹cej nag³ówek od danych
        doc.line(20, 32, 190, 32);

        // Dodawanie zadañ do pliku PDF
        tasks.forEach((task, index) => {
            const taskText = task.getElementsByTagName("span")[0].innerText;
            const taskDate = task.getElementsByTagName("span")[1].innerText;
            const taskStatus = task.getElementsByTagName("span")[2].innerText;

            const rowPosition = 40 + (10 * index);

            doc.text(taskText, 20, rowPosition);
            doc.text(taskDate, 90, rowPosition);
            doc.text(taskStatus, 150, rowPosition);
        });

        // Zapisz do PDF
        doc.save("task-list.pdf");
    }
});
