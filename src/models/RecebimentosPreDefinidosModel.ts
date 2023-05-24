import { QueryResult } from "pg";
import { pool } from "../database/db";
import { RecebimentoPreDefinidoIn, RecebimentoPreDefinidoOut } from "../dtos/RecebimentosPreDefinidosDTO";

export default class RecebimentosPreDefinidosModel {
  async create(recebimentoPreDefinido: RecebimentoPreDefinidoIn): Promise<RecebimentoPreDefinidoOut> {
    const { descricao, valor, data_recebimento } = recebimentoPreDefinido;

    const result: QueryResult = await pool.query(
      `INSERT INTO recebimentos_pre_definidos (descricao, valor, data_recebimento)
      VALUES ($1, $2, $3)
      RETURNING id, descricao, valor, data_recebimento`,
      [descricao, valor, data_recebimento]
    );

    return result.rows[0];
  }

  async get(id: number): Promise<RecebimentoPreDefinidoOut | null> {
    const result: QueryResult = await pool.query(
      `SELECT id, descricao, valor, data_recebimento
      FROM recebimentos_pre_definidos
      WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  async getAll(): Promise<RecebimentoPreDefinidoOut[] | null> {
    const result: QueryResult = await pool.query(
      `SELECT id, descricao, valor, data_recebimento
      FROM recebimentos_pre_definidos`
    );

    return result.rows || null;
  }

  async update(id: number, recebimentoPreDefinido: RecebimentoPreDefinidoIn): Promise<RecebimentoPreDefinidoOut | null> {
    const { descricao, valor, data_recebimento } = recebimentoPreDefinido;

    const result: QueryResult = await pool.query(
      `UPDATE recebimentos_pre_definidos
      SET descricao = $1, valor = $2, data_recebimento = $3
      WHERE id = $4
      RETURNING id, descricao, valor, data_recebimento`,
      [descricao, valor, data_recebimento, id]
    );

    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result: QueryResult = await pool.query(
      `DELETE FROM recebimentos_pre_definidos
      WHERE id = $1`,
      [id]
    );

    return result.rowCount > 0;
  }
}
