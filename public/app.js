import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseCon = {
    apiKey: "AIzaSyAat9ej8Xz9i4jrEF4p9ttnBmqLyhLNKWQ",
    authDomain: "flysecurity-790c8.firebaseapp.com",
    databaseURL: "https://flysecurity-790c8-default-rtdb.firebaseio.com",
    projectId: "flysecurity-790c8",
    storageBucket: "flysecurity-790c8.appspot.com",
    messagingSenderId: "864348312200",
    appId: "1:864348312200:web:82c514a6edddea84cd853d",
    measurementId: "G-S2FY7EVTEW"
};

const app = initializeApp(firebaseCon);
const database = getDatabase(app);
const employeesRef = ref(database, "employees");

function addEmployee() {
    const name = document.getElementById("name").value.trim();
    const role = document.getElementById("role").value.trim();
    const date = document.getElementById("date").value;
    const rate = document.getElementById("rate").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!name || !role || !date || !rate || !email) {
        alert("All fields are required!");
        return;
    }

    const newEmployeeRef = push(employeesRef);
    set(newEmployeeRef, { name, role, date, rate, email })
        .then(() => {
            alert("Employee added successfully!");
            document.getElementById("employee-form").reset();
        })
        .catch(error => {
            alert("Error adding employee.");
        });
}

function fetchEmployees() {
    onValue(employeesRef, (snapshot) => {
        const employeeList = document.getElementById("employee-list");
        employeeList.innerHTML = "";

        snapshot.forEach((childSnapshot) => {
            const employee = childSnapshot.val();
            const employeeKey = childSnapshot.key;

            employeeList.innerHTML += `
                        <tr onclick="viewEmployee('${employeeKey}')" style="cursor:pointer">
                            <td>${employee.name}</td>
                            <td>${employee.role}</td>
                            <td>${employee.date}</td>
                            <td>${employee.rate}</td>
                            <td>
                                <a href="edit.html?id=${employeeKey}" class="btn blue">Edit</a>
                                <button class="btn red remove-btn" data-key="${employeeKey}">Delete</button>
                            </td>
                        </tr>
                    `;
        });

        attachDeleteEvents();
    });
}

window.viewEmployee = (id) => {
    const employeeRef = ref(database, `employees/${id}`);
    get(employeeRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            document.getElementById("modal-name").textContent = data.name;
            document.getElementById("modal-role").textContent = data.role;
            document.getElementById("modal-date").textContent = data.date;
            document.getElementById("modal-rate").textContent = data.rate;
            document.getElementById("modal-email").textContent = data.email;

            const modal = document.querySelector("#view-member-dialog");
            M.Modal.getInstance(modal).open();
        }
    });
};

function attachDeleteEvents() {
    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", async (event) => {
            event.stopPropagation();
            await remove(ref(database, `employees/${button.dataset.key}`));
            fetchEmployees();
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fetchEmployees();
    M.Modal.init(document.querySelectorAll(".modal"));
    document.getElementById("addnewuser").addEventListener("click", addEmployee);
});