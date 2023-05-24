import "dotenv/config";
import express from "express";
import usersRoutes from "routes/UserRoute";
import contaRoutes from 'routes/ContaRoute';
import transacoesRoutes from "routes/TransacaoRoute";
// import enderecosRoutes from "routes/EnderecoRoute";
// import recebimentosPreDefinidosRoutes from "routes/RecebimentosPreDefinidosRoute";
import { DateTime } from "luxon";


DateTime.local().setZone("America/Sao_Paulo");

const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  return res.send("Hello RubBank!");
});
app.use("/users", usersRoutes);
app.use("/conta", contaRoutes);
app.use("/transacoes", transacoesRoutes);
// app.use("/enderecos", enderecosRoutes);
// app.use("/recebimentos-pre-definidos", authentication, recebimentosPreDefinidosRoutes);
app.listen(process.env.PORT || 3344);
