interface Vehicle {
  name: string;
  license: string;
  date: string;
}

(function () {
  const $ = (querySelector: string): HTMLInputElement | null =>
    document.querySelector(querySelector);

  const parking = {
    read(): Vehicle[] {
      const vehicles = localStorage.getItem("park")
        ? JSON.parse(localStorage.getItem("park") as string)
        : [];
      return vehicles;
    },
    add(vehicle: Vehicle, needSave: boolean) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${vehicle.name}</td>
        <td>${vehicle.license}</td>
        <td>${vehicle.date}</td>
        <td><button class="delete" data-placa="${vehicle.license}">X</button></td>
        `;

      $("#park")?.appendChild(row);
      if (needSave) {
        let vehicles = parking.read();
        vehicles.push(vehicle);
        parking.save(vehicles);
      }
    },
    delete() {},
    save(vehicle: Vehicle[]) {
      localStorage.setItem("park", JSON.stringify(vehicle));
    },
    render() {
      $("#park")!.innerHTML = "";
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
    parking.add(
      {
        name,
        license,
        date: new Date().toLocaleDateString("pt-BR"),
      },
      true
    );
  });
})();
