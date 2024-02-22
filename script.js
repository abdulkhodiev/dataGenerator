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
const regionData = {};

function generateRandomSeed() {
    return Math.floor(Math.random() * 1000000).toString();
}

function getFakerConfig(region) {
    const fakerConfig = {};

    switch (region) {
        case "germany":
            faker.locale = "de";
            break;
        case "france":
            faker.locale = "fr";
            break;

        default:
            faker.locale = "en";
    }

    fakerConfig.name = faker.name.findName;
    fakerConfig.address = faker.address.streetAddress;
    fakerConfig.phone = faker.phone.phoneNumberFormat;

    return fakerConfig;
}

function generateFakeData(region, errors, seed, pageIndex, pageSize) {
    const data = [];
    const rng = new Math.seedrandom(seed + pageIndex);
    const fakerConfig = getFakerConfig(region);

    for (let i = 0; i < pageSize; i++) {
        const index = (pageIndex - 1) * pageSize + i + 1;
        let name = fakerConfig.name(); // Now calling the saved method
        let address = fakerConfig.address();
        let phone = fakerConfig.phone();

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
                const char = getRandomChar(rng);
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

function getRandomChar(rng) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    return alphabet.charAt(Math.floor(rng() * alphabet.length));
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

function handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
        currentPage++;
        updateTable(true);
    }
}
