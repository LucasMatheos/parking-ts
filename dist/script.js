"use strict";
(function () {
    const $ = (querySelector) => document.querySelector(querySelector);
    function handleTimeSpent(miliseconds) {
        console.log(miliseconds);
        const secondsToMiliseconds = 1000;
        const minuteToMiliseconds = 60 * 1000;
        let seconds = 0;
        const minute = Math.ceil(miliseconds / minuteToMiliseconds);
        if (minute == 0) {
            seconds = Math.ceil(miliseconds / secondsToMiliseconds);
        }
        else {
            seconds = Math.ceil((miliseconds % minute) / secondsToMiliseconds);
        }
        return `${minute}m e ${seconds}s:`;
    }
    const parking = {
        read() {
            const vehicles = localStorage.getItem("park")
                ? JSON.parse(localStorage.getItem("park"))
                : [];
            return vehicles;
        },
        add(vehicle, needSave) {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${vehicle.name}</td>
        <td>${vehicle.license}</td>
        <td>${vehicle.entryDate}</td>
        <td><button class="delete" data-placa="${vehicle.license}">X</button></td>
        `;
            row.querySelector(".delete")?.addEventListener("click", (e) => {
                const target = e.target;
                console.log(String(target.getAttribute("data-placa")));
                parking.delete(String(target.getAttribute("data-placa")));
            });
            $("#park")?.appendChild(row);
            if (needSave) {
                let vehicles = parking.read();
                vehicles.push(vehicle);
                parking.save(vehicles);
            }
        },
        delete(license) {
            const vehicles = parking.read();
            const vehicleExists = vehicles.find((vehicle) => vehicle.license === license);
            if (vehicleExists) {
                const { name, date } = vehicleExists;
                const totalTimeSpent = new Date().getTime() - new Date(date).getTime();
                const time = handleTimeSpent(totalTimeSpent);
                if (confirm(`O Veiculo ${name} permaneu por ${time}. Deseja encerrar ?`)) {
                    const updatedVehicles = vehicles.filter((vehicle) => vehicle.license !== license);
                    parking.save(updatedVehicles);
                    parking.render();
                }
                else {
                    return;
                }
            }
        },
        save(vehicle) {
            localStorage.setItem("park", JSON.stringify(vehicle));
        },
        render() {
            $("#park").innerHTML = "";
            const vehicles = parking.read();
            if (vehicles.length) {
                vehicles.forEach((vehicle) => {
                    parking.add(vehicle, false);
                });
            }
        },
    };
    parking.render();
    $("#register")?.addEventListener("click", () => {
        const name = $("#name")?.value;
        const license = $("#license")?.value;
        if (!name || !license) {
            alert("Nome e Placa obrigatórios");
            return;
        }
        parking.add({
            name,
            license,
            entryDate: `${new Date().toLocaleString("pt-BR")}`,
            date: new Date(),
        }, true);
    });
})();
