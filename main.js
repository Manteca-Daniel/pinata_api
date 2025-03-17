const express = require("express");
const { PinataSDK } = require("pinata-web3");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();

const keyJWT = process.env.KEY_JWT;

const pinata = new PinataSDK({
  pinataJwt: keyJWT,
  pinataGateway: "plum-rational-junglefowl-23.mypinata.cloud",
});

const app = express();
app.use(express.json());

let pedidos = [];

app.get("/api/v1/pedidos/:cid", async (req, res) => {
  try {
    const { cid } = req.params; // Obtener el CID desde los parámetros de la URL
    const data = await pinata.gateways.get(cid);
    res.json({ content: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener los datos" });
  }
});


// Crear un nuevo pedido
app.post("/api/v1/pedidos", async (req, res) => {
  try {
    const { cadena, datos } = req.body;

    if (!cadena || !datos) {
      return res.status(400).json({ error: "Se requiere 'cadena' y 'datos' en el cuerpo de la solicitud" });
    }

    const jsonContent = JSON.stringify(datos, null, 2);

    const file = new File([jsonContent], `${cadena}.json`, { type: "application/json" });

    const upload = await pinata.upload.file(file);

    res.json({ upload });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
});



// Arrancar el servidor
app.listen(3000, () => {
  console.log("Servidor arrancado en http://localhost:3000");
});
