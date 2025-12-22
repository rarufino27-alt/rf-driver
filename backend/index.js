import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MP_TOKEN = process.env.MP_ACCESS_TOKEN;

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
      },
      back_urls: {
        success: "https://SEU_SITE/sucesso.html",
        failure: "https://SEU_SITE/erro.html",
        pending: "https://SEU_SITE/pendente.html"
      },
      auto_return: "approved"
    };

    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${MP_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(preference)
      }
    );

    const data = await response.json();

    return res.json({
      init_point: data.init_point
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar pagamento" });
  }
});

/* ===============================
   INICIAR SERVIDOR
================================ */
app.listen(PORT, () => {
  console.log("Backend rodando na porta", PORT);
});
