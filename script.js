const regionSelect = document.getElementById("region");
const errorsSlider = document.getElementById("errors");
const errorCountInput = document.getElementById("errorCount");
const seedInput = document.getElementById("seed");
const randomSeedButton = document.getElementById("randomSeed");
const generateDataButton = document.getElementById("generateData");
document.getElementById("exportCsv").addEventListener("click", exportToCsv);

const dataTableBody = document
    .getElementById("dataTable")
    .getElementsByTagName("tbody")[0];
let currentPage = 1;
let seed = "";

function generateRandomSeed() {
    return Math.floor(Math.random() * 1000000).toString();
}

function generateFakeData(region, errors, seed, pageIndex, pageSize) {
    const data = [];
    const rng = new Math.seedrandom(seed + pageIndex);

    for (let i = 0; i < pageSize; i++) {
        const index = (pageIndex - 1) * pageSize + i + 1;
        let name = getRandomName(region, rng);
        let address = getRandomAddress(region, rng);
        let phone = getRandomPhone(region, rng);

        name = applyErrors(name, errors, rng);
        address = applyErrors(address, errors, rng);
        phone = applyErrors(phone, errors, rng);

        data.push({
            index: index,
            identifier: `id-${index}-${seed}`,
            name: name,
            address: address,
            phone: phone,
        });
    }
    return data;
}

function applyErrors(text, errors, rng) {
    for (let i = 0; i < errors; i++) {
        const errorType = Math.floor(rng() * 3);
        switch (errorType) {
            case 0:
                if (text.length > 0) {
                    const pos = Math.floor(rng() * text.length);
                    text = text.substring(0, pos) + text.substring(pos + 1);
                }
                break;
            case 1:
                const pos = Math.floor(rng() * text.length);
                const char = getRandomChar(region, rng);
                text = text.substring(0, pos) + char + text.substring(pos);
                break;
            case 2:
                if (text.length > 1) {
                    const pos = Math.floor(rng() * (text.length - 1));
                    text =
                        text.substring(0, pos) +
                        text.charAt(pos + 1) +
                        text.charAt(pos) +
                        text.substring(pos + 2);
                }
                break;
        }
    }
    return text;
}

const regionData = {
    poland: {
        firstNames: [
            "Jan",
            "Anna",
            "Piotr",
            "Mateusz",
            "Ewa",
            "Kamil",
            "Alicja",
            "Grzegorz",
            "Magdalena",
            "Wojciech",
        ],
        middleNames: [
            "Krzysztof",
            "Maria",
            "Tomasz",
            "Karolina",
            "Michał",
            "Monika",
            "Łukasz",
            "Katarzyna",
            "Marcin",
            "Natalia",
        ],
        lastNames: [
            "Nowak",
            "Kowalski",
            "Wiśniewski",
            "Dąbrowski",
            "Lewandowski",
            "Wójcik",
            "Kowalczyk",
            "Kamiński",
            "Lis",
            "Zając",
        ],
        cities: [
            "Warsaw",
            "Krakow",
            "Gdansk",
            "Wroclaw",
            "Poznan",
            "Katowice",
            "Szczecin",
            "Lodz",
            "Bydgoszcz",
            "Gdynia",
        ],
        streets: [
            "Marszałkowska",
            "Krakowskie Przedmieście",
            "Piotrkowska",
            "Aleje Jerozolimskie",
            "Łazienkowska",
            "Nowy Świat",
            "Hoża",
            "Wawelska",
            "Krótka",
            "Kościuszki",
        ],
        buildings: [
            "10",
            "20A",
            "15B",
            "25C",
            "30D",
            "18E",
            "22F",
            "12G",
            "27H",
            "14I",
        ],
        apartments: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        phoneFormats: [
            "+48 ### ### ###",
            "## ### ####",
            "+48 ###-###-###",
            "##-##-####",
        ],
    },
    usa: {
        firstNames: [
            "John",
            "Emily",
            "Michael",
            "Emma",
            "Christopher",
            "Olivia",
            "William",
            "Sophia",
            "James",
            "Ava",
        ],
        middleNames: [
            "Elizabeth",
            "James",
            "Marie",
            "David",
            "Grace",
            "Joseph",
            "Lily",
            "Robert",
            "Ella",
            "Benjamin",
        ],
        lastNames: [
            "Smith",
            "Johnson",
            "Williams",
            "Jones",
            "Brown",
            "Davis",
            "Miller",
            "Moore",
            "Taylor",
            "Anderson",
        ],
        cities: [
            "New York",
            "Los Angeles",
            "Chicago",
            "Houston",
            "Phoenix",
            "Philadelphia",
            "San Antonio",
            "Dallas",
            "San Diego",
            "Austin",
        ],
        streets: [
            "Main St",
            "Broadway",
            "Elm St",
            "Maple Ave",
            "Oak St",
            "Pine St",
            "Cedar St",
            "Hillside Ave",
            "Sunset Blvd",
            "Highland Ave",
        ],
        buildings: [
            "100",
            "200A",
            "150B",
            "300C",
            "250D",
            "180E",
            "220F",
            "120G",
            "270H",
            "140I",
        ],
        apartments: [
            "1A",
            "2B",
            "3C",
            "4D",
            "5E",
            "6F",
            "7G",
            "8H",
            "9I",
            "10J",
        ],
        phoneFormats: [
            "+1 (###) ###-####",
            "(###) ###-####",
            "+1 (###) ###-####",
            "(###) ###-####",
        ],
    },
    georgia: {
        firstNames: [
            "Giorgi",
            "Nino",
            "Davit",
            "Sopho",
            "Irakli",
            "Mariam",
            "Levan",
            "Ana",
            "Revaz",
            "Ketevan",
        ],
        middleNames: [
            "Irakli",
            "Mariam",
            "Levan",
            "Nino",
            "Giorgi",
            "Ana",
            "Revaz",
            "Davit",
            "Ketevan",
            "Zurab",
        ],
        lastNames: [
            "Ivanišvili",
            "Gelašvili",
            "Maisašvili",
            "Kartvelishvili",
            "Ninidze",
            "Bregvadze",
            "Javakhishvili",
            "Tatishvili",
            "Kekelidze",
            "Kharabadze",
        ],
        cities: [
            "Tbilisi",
            "Batumi",
            "Kutaisi",
            "Rustavi",
            "Gori",
            "Poti",
            "Zugdidi",
            "Telavi",
            "Akhaltsikhe",
            "Marneuli",
        ],
        streets: [
            "Rustaveli Ave",
            "Melikishvili St",
            "Tsereteli Ave",
            "Chavchavadze Ave",
            "Agmashenebeli Ave",
            "Tabidze St",
            "Gamsakhurdia St",
            "Saakadze St",
            "Dadiani St",
            "Vazha-Pshavela Ave",
        ],
        buildings: [
            "12",
            "34B",
            "56A",
            "78C",
            "90D",
            "23E",
            "45F",
            "67G",
            "89H",
            "10I",
        ],
        apartments: [
            "10",
            "20",
            "30",
            "40",
            "50",
            "60",
            "70",
            "80",
            "90",
            "100",
        ],
        phoneFormats: [
            "+995 ### ## ## ##",
            "0## ### ###",
            "+995 ## ### ###",
            "0## ## ## ##",
        ],
    },
};

function getRandomName(region, rng) {
    const data = regionData[region];
    const firstName =
        data.firstNames[Math.floor(rng() * data.firstNames.length)];
    const middleName =
        data.middleNames[Math.floor(rng() * data.middleNames.length)];
    const lastName = data.lastNames[Math.floor(rng() * data.lastNames.length)];
    return `${firstName} ${middleName} ${lastName}`;
}

function getRandomAddress(region, rng) {
    const data = regionData[region];
    const city = data.cities[Math.floor(rng() * data.cities.length)];
    const street = data.streets[Math.floor(rng() * data.streets.length)];
    const building = data.buildings[Math.floor(rng() * data.buildings.length)];
    const apartment =
        data.apartments[Math.floor(rng() * data.apartments.length)];
    const formats = [
        `${city}, ${street} ${building}, Apt. ${apartment}`,
        `${street} ${building}/${apartment}, ${city}`,
    ];
    return formats[Math.floor(rng() * formats.length)];
}

function getRandomPhone(region, rng) {
    const data = regionData[region];
    const format =
        data.phoneFormats[Math.floor(rng() * data.phoneFormats.length)];
    return format.replace(/#/g, () => Math.floor(rng() * 10));
}

function getRandomChar(region, rng) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    return alphabet.charAt(Math.floor(rng() * alphabet.length));
}

function updateTable(appendData = false) {
    if (!appendData) {
        dataTableBody.innerHTML = "";
    }
    const region = regionSelect.value;
    const errors = parseFloat(errorsSlider.value);
    const data = generateFakeData(region, errors, seed, currentPage, 20);

    data.forEach((row) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.index}</td>
            <td>${row.identifier}</td>
            <td>${row.name}</td>
            <td>${row.address}</td>
            <td>${row.phone}</td>
        `;
        dataTableBody.appendChild(tr);
    });
}

function handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
        currentPage++;
        updateTable(true);
    }
}

function exportToCsv() {
    const data = [];
    for (let i = 1; i <= currentPage; i++) {
        const pageData = generateFakeData(
            regionSelect.value,
            parseFloat(errorsSlider.value),
            seed,
            i,
            20
        );
        data.push(...pageData);
    }

    const csv = Papa.unparse(
        data.map((row) => ({
            Index: row.index,
            Identifier: row.identifier,
            Name: row.name,
            Address: row.address,
            Phone: row.phone,
        }))
    );

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "fake_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

errorsSlider.addEventListener("input", () => {
    errorCountInput.value = errorsSlider.value;
});

errorCountInput.addEventListener("input", () => {
    errorsSlider.value = errorCountInput.value;
});

seedInput.addEventListener("input", () => {
    seed = seedInput.value;
});

randomSeedButton.addEventListener("click", () => {
    seed = generateRandomSeed();
    seedInput.value = seed;
});

generateDataButton.addEventListener("click", () => {
    currentPage = 1;
    updateTable();
});

regionSelect.addEventListener("change", () => {
    currentPage = 1;
    updateTable();
});

window.addEventListener("scroll", handleScroll);
