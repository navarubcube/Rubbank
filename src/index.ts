import "dotenv/config";
import express from "express";
import cors from 'cors';
import usersRoutes from "routes/UserRoute";
import contaRoutes from 'routes/ContaRoute';
import transacoesRoutes from "routes/TransacaoRoute";
import enderecosRoutes from "routes/EnderecoRoute";
import recebimentosPreDefinidosRoutes from "routes/RecebimentosPreDefinidosRoute";
import newsletterRoutes from 'routes/NewsletterRoute';
import { DateTime } from "luxon";


DateTime.local().setZone("America/Sao_Paulo");

const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  return res.send("Hello RubBank!");
});
app.use("/users", usersRoutes);
app.use("/conta", contaRoutes);
app.use("/transacoes", transacoesRoutes);
app.use("/enderecos", enderecosRoutes);
app.use("/recebimentos", recebimentosPreDefinidosRoutes);
app.use("/newsletter", newsletterRoutes);
app.listen(process.env.PORT || 3344);
