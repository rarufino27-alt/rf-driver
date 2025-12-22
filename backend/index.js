import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mercadopago from "mercadopago";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Configura Mercado Pago
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

/* ===============================
   ROTA DE TESTE
================================ */
app.get("/", (req, res) => {
  res.json({ status: "RF Driver backend online" });
});

/* ===============================
   CRIAR PAGAMENTO
================================ */
app.post("/criar-pagamento", async (req, res) => {
  try {
    const { plano, deviceId } = req.body;

    if (!plano || !deviceId) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const planos = {
      mensal: { title: "Plano Mensal RF Driver", price: 24.9 },
      semestral: { title: "Plano Semestral RF Driver", price: 124.9 },
      vitalicio: { title: "Plano Vitalício RF Driver", price: 299.9 }
    };

    if (!planos[plano]) {
      return res.status(400).json({ error: "Plano inválido" });
    }

    const preference = {
      items: [
        {
          title: planos[plano].title,
          quantity: 1,
          currency_id: "BRL",
          unit_price: planos[plano].price
        }
      ],
      metadata: {
        deviceId,
        plano
      }
    };

    const response = await mercadopago.preferences.create(preference);

    return res.json({
      init_point: response.body.init_point
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar pagamento" });
  }
});

import fs from "fs";

/* ===============================
   WEBHOOK MERCADO PAGO
================================ */
app.post("/webhook", async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type !== "payment") {
      return res.sendStatus(200);
    }

    const paymentId = data.id;

    const payment = await mercadopago.payment.findById(paymentId);

    if (payment.body.status !== "approved") {
      return res.sendStatus(200);
    }

    const { deviceId, plano } = payment.body.metadata;

    if (!deviceId || !plano) {
      return res.sendStatus(200);
    }

    // Lê planos existentes
    const planosPath = "./planos.json";
    const planosAtivos = JSON.parse(fs.readFileSync(planosPath));

    planosAtivos[deviceId] = {
      plano,
      ativo: true,
      data: new Date().toISOString()
    };

    fs.writeFileSync(planosPath, JSON.stringify(planosAtivos, null, 2));

    console.log("Plano ativado:", deviceId, plano);

    res.sendStatus(200);

  } catch (err) {
    console.error("Erro no webhook:", err);
    res.sendStatus(500);
  }
});

/* ===============================
   INICIAR SERVIDOR
================================ */
app.listen(PORT, () => {
  console.log("Backend rodando na porta", PORT);
});
