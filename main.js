const express = require("express");
const { PinataSDK } = require("pinata-web3");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const keyJWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkM2RhOWY3NS01YzhkLTQwZjEtYmE4MS01ODE2ZDA2NmM0NjQiLCJlbWFpbCI6ImRhbmllbC5tYW50ZWNhLmdhcm1lbmRpYUBhbHVtbm9qb3lmZS5pZXBncm91cC5lcyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI0MjEwNzIzMzJjYjJkODIxNzkwZCIsInNjb3BlZEtleVNlY3JldCI6ImRlOWYzMzA5MmNiZWM1NzhhOGJhNmFlMWExODE2M2YzZTkwN2VmYmI5NmRiMzMxYTg0ZTAzZDA2OGUwNGRlMTkiLCJleHAiOjE3NjgzMzI0NzJ9.z9O_6AS21JAsPAko_Lgm1VdzkOC-fwh5uxeE_JfrFxc";

const pinata = new PinataSDK({
  pinataJwt: keyJWT,
  pinataGateway: "plum-rational-junglefowl-23.mypinata.cloud",
});

const app = express();
app.use(express.json());

let pedidos = [];

app.get("/api/v1/pedidos", async (req, res) => {
  try {
    const data = await pinata.gateways.get("bafkreicc6c7du4qrp636n7q3m3yxt4ravcp3ciydrbq4ve35udvake4ive");
    res.json({ content: data });
  } catch (error) {
    console.log(error);
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
