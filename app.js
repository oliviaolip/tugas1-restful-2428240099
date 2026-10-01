const express = require("express");
const app = express();

app.use(express.json());

let laptops = [
  {
    id: 1,
    merek: "Lenovo",
    model: "IdeaPad Slim 3",
    prosesor: "Intel Core i5",
    ramGb: 16,
    harga: 8499000
  },
  {
    id: 2,
    merek: "ASUS",
    model: "Vivobook 14",
    prosesor: "AMD Ryzen 5",
    ramGb: 8,
    harga: 7299000
  },
  {
    id: 3,
    merek: "Acer",
    model: "Aspire 5",
    prosesor: "Intel Core i5",
    ramGb: 16,
    harga: 8199000
  }
];

let nextId = 4;

app.get("/", (req, res) => {
  res.json({
    nama: "Olivia Wijaya",
    nim: "2428240099",
    topik: 27,
    resource: "Laptop",
    endpoints: [
      "GET /laptops",
      "GET /laptops/:id",
      "GET /laptops?prosesor={nilai}",
      "POST /laptops",
      "PUT /laptops/:id",
      "DELETE /laptops/:id"
    ]
  });
});

app.get("/laptops", (req, res) => {
  const { prosesor } = req.query;

  if (prosesor) {
    const filtered = laptops.filter(
      (item) => item.prosesor.toLowerCase() === prosesor.toLowerCase()
    );
    return res.status(200).json(filtered);
  }

  res.status(200).json(laptops);
});

app.get("/laptops/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const laptop = laptops.find((item) => item.id === id);

  if (!laptop) {
    return res.status(404).json({
      status: "error",
      message: `Data dengan id ${id} tidak ditemukan`,
      data: null
    });
  }

  res.status(200).json(laptop);
});

app.post("/laptops", (req, res) => {
  const { merek, model, prosesor, ramGb, harga } = req.body;

  if (!merek || !prosesor || ramGb === undefined || harga === undefined) {
    return res.status(400).json({
      status: "error",
      message: "Field merek, prosesor, ramGb, dan harga wajib diisi",
      data: null
    });
  }

  const baru = {
    id: nextId++,
    merek,
    model: model || "",
    prosesor,
    ramGb: Number(ramGb),
    harga: Number(harga)
  };

  laptops.push(baru);

  res.status(201).json({
    status: "success",
    message: "Data berhasil ditambahkan",
    data: baru
  });
});

app.put("/laptops/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = laptops.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: `Data dengan id ${id} tidak ditemukan`,
      data: null
    });
  }

  const { merek, model, prosesor, ramGb, harga } = req.body;

  if (!merek || !prosesor || ramGb === undefined || harga === undefined) {
    return res.status(400).json({
      status: "error",
      message: "Field merek, prosesor, ramGb, dan harga wajib diisi",
      data: null
    });
  }

  const diperbarui = {
    id,
    merek,
    model: model || "",
    prosesor,
    ramGb: Number(ramGb),
    harga: Number(harga)
  };

  laptops[index] = diperbarui;

  res.status(200).json({
    status: "success",
    message: "Data berhasil diperbarui",
    data: diperbarui
  });
});

app.delete("/laptops/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = laptops.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: `Data dengan id ${id} tidak ditemukan`,
      data: null
    });
  }

  laptops.splice(index, 1);

  res.status(200).json({
    status: "success",
    message: `Data laptop dengan id ${id} berhasil dihapus`,
    data: null
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint tidak ditemukan",
    data: null
  });
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;