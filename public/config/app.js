import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
        import { getDatabase, ref, set, push, onValue, remove, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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
            const contact = document.getElementById("contact").value;
            const nic = document.getElementById("nic").value.trim();
            const email = document.getElementById("email").value.trim();

            if (!name || !role || !contact || !nic || !email) {
                alert("All fields are required!");
                return;
            }

            const newEmployeeRef = push(employeesRef);
            set(newEmployeeRef, { name, role, contact, nic, email })
                .then(() => {
                    alert("Employee added successfully!");
                    document.getElementById("employee-form").reset();
                })
                .catch(error => {
                    alert("Error adding employee.");
                });
        }
        function searchTable() {
            let input = document.getElementById("searchInput").value.toLowerCase();
            let table = document.getElementById("employee-list");
            let rows = table.getElementsByTagName("tr");
        
            for (let i = 0; i < rows.length; i++) {
                let nameCell = rows[i].getElementsByTagName("td")[0]; // First column (Name)
                if (nameCell) {
                    let nameValue = nameCell.textContent || nameCell.innerText;
                    rows[i].style.display = nameValue.toLowerCase().includes(input) ? "" : "none";
                }
            }
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
                            <td>${employee.email}</td>
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
                    document.getElementById("modal-contact").textContent = data.contact;
                    document.getElementById("modal-nic").textContent = data.nic;
                    document.getElementById("modal-email").textContent = data.email;
                    document.getElementById("modal-address").textContent = data.address;
                    document.getElementById("modal-dob").textContent = data.dob;
                    document.getElementById("modal-blood-group").textContent = data.blood_group;
                    document.getElementById("modal-emergency-contact").textContent = data.emergency_contact;
                    document.getElementById("modal-relation").textContent ="("+ data.relation+")";

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
            document.getElementById("searchInput").addEventListener("change",searchTable)
        });